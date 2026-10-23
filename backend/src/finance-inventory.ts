import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Headers,
  Res,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { Response } from "express";
const bwipjs = require("bwip-js");
const PDFDocument = require("pdfkit");
@Controller("api/v1")
export class FinanceInventoryController {
  private db = new PrismaClient();
  private async staff(auth: string, roles: string[] = [], branch?: string) {
    try {
      if (!auth?.startsWith("Bearer ")) throw Error();
      const claims: any = jwt.verify(
        auth.slice(7),
        process.env.JWT_SECRET || "DEMO_ONLY_CHANGE_ME",
      );
      const user = await this.db.user.findUnique({
        where: { id: claims.sub },
        include: { branches: true },
      });
      if (!user?.active) throw Error();
      if (
        roles.length &&
        !roles.includes(user.role) &&
        user.role !== "SUPER_ADMIN"
      )
        throw new HttpException("Permission denied", 403);
      if (
        branch &&
        user.role !== "SUPER_ADMIN" &&
        !user.branches.some((x) => x.branchId === branch)
      )
        throw new HttpException("Branch denied", 403);
      return user;
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException("Login required", 401);
    }
  }
  @Get("admin/pets/:id/barcode") async barcode(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    await this.staff(a);
    const pet = await this.db.pet.findUnique({ where: { id } });
    if (!pet) throw new HttpException("Pet not found", 404);
    const bytes = await bwipjs.toBuffer({
      bcid: "code128",
      text: pet.petCode,
      scale: 3,
      height: 12,
      includetext: true,
      textxalign: "center",
    });
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${pet.petCode}.png"`,
    );
    res.send(bytes);
  }
  @Get("admin/pets/:id/id-card.pdf") async idcard(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    await this.staff(a);
    const pet = await this.db.pet.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!pet) throw new HttpException("Pet not found", 404);
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: pet.petCode,
      scale: 3,
      height: 12,
      includetext: true,
    });
    return this.pdf(res, `pet-${pet.petCode}.pdf`, (doc: any) => {
      this.header(doc, "DIGITAL PET ID");
      doc
        .fontSize(13)
        .text(`Pet: ${pet.name}`)
        .text(`Pet ID: ${pet.petCode}`)
        .text(`Species: ${pet.species}`)
        .text(`Owner: ${pet.owner.name}`);
      doc.moveDown().image(png, { fit: [350, 90] });
    });
  }
  @Get("admin/inventory/items") async items(
    @Headers("authorization") a: string,
    @Query("department") department?: string,
  ) {
    await this.staff(a);
    return this.db.inventoryItem.findMany({
      where: department ? { department } : undefined,
      include: { batches: true },
      orderBy: { name: "asc" },
    });
  }
  @Post("admin/inventory/items") async item(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    await this.staff(a, ["ADMIN", "PHARMACY", "LAB", "SHOP_MANAGER"]);
    if (
      !x.name ||
      !x.sku ||
      !["PHARMACY", "LAB", "SHOP"].includes(x.department)
    )
      throw new HttpException("Invalid item", 400);
    return this.db.inventoryItem.create({
      data: {
        name: x.name,
        sku: x.sku,
        department: x.department,
        unit: x.unit || "UNIT",
        hsnSac: x.hsnSac || null,
        gstRate: this.rate(x.gstRate),
      },
    });
  }
  @Post("admin/inventory/batches") async batch(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    const u = await this.staff(
      a,
      ["ADMIN", "PHARMACY", "LAB", "SHOP_MANAGER"],
      x.branchId,
    );
    const item = await this.db.inventoryItem.findUnique({
      where: { id: x.itemId },
    });
    if (
      !item ||
      !x.batchNumber ||
      !Number.isInteger(x.quantity) ||
      x.quantity < 0
    )
      throw new HttpException("Invalid batch", 400);
    const b = await this.db.inventoryBatch.create({
      data: {
        branchId: x.branchId,
        itemId: x.itemId,
        batchNumber: x.batchNumber,
        quantity: x.quantity,
        expiry: x.expiry ? new Date(x.expiry) : null,
        unitCost: Number(x.unitCost || 0),
      },
    });
    await this.db.inventoryMovement.create({
      data: {
        batchId: b.id,
        kind: "OPENING",
        quantity: x.quantity,
        userId: u.id,
      },
    });
    return b;
  }
  @Post("admin/inventory/dispense") async dispense(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    const u = await this.staff(
      a,
      ["ADMIN", "PHARMACY", "LAB", "SHOP_MANAGER"],
      x.branchId,
    );
    const qty = Number(x.quantity);
    if (!Number.isInteger(qty) || qty <= 0 || !x.batchId || !x.reference)
      throw new HttpException("Batch, quantity and reference required", 400);
    return this.db.$transaction(async (tx) => {
      const b = await tx.inventoryBatch.findUnique({
        where: { id: x.batchId },
        include: { item: true },
      });
      if (!b || b.branchId !== x.branchId)
        throw new HttpException("Batch not in branch", 403);
      if (b.expiry && b.expiry < new Date())
        throw new HttpException("Expired batch", 409);
      if (b.item.department === "PHARMACY" && !x.prescriptionId)
        throw new HttpException(
          "Prescription ID required for pharmacy dispense",
          400,
        );
      const r = await tx.inventoryBatch.updateMany({
        where: { id: b.id, quantity: { gte: qty } },
        data: { quantity: { decrement: qty } },
      });
      if (!r.count) throw new HttpException("Insufficient inventory", 409);
      const move = await tx.inventoryMovement.create({
        data: {
          batchId: b.id,
          kind: "DISPENSE",
          quantity: -qty,
          reference: String(x.reference),
          userId: u.id,
        },
      });
      return move;
    });
  }
  @Get("admin/inventory/movements") async movements(
    @Headers("authorization") a: string,
    @Query("branchId") branchId: string,
  ) {
    await this.staff(a, [], branchId);
    return this.db.inventoryMovement.findMany({
      where: { batch: branchId ? { branchId } : undefined },
      include: { batch: { include: { item: true } } },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  }
  @Post("admin/pets/:id/vaccinations") async vaccination(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const u = await this.staff(a, ["DOCTOR", "ADMIN", "RECEPTION"]);
    const pet = await this.db.pet.findUnique({ where: { id } });
    if (!pet || !x.vaccine || !x.validUntil)
      throw new HttpException("Pet, vaccine and expiry required", 400);
    return this.db.petVaccination.create({
      data: {
        petId: id,
        vaccine: x.vaccine,
        validUntil: new Date(x.validUntil),
        administeredAt: x.administeredAt ? new Date(x.administeredAt) : null,
        notes: x.notes || null,
        verifiedById: u.id,
      },
    });
  }
  @Get("admin/pets/:id/vaccinations") async vaccinations(
    @Headers("authorization") a: string,
    @Param("id") id: string,
  ) {
    await this.staff(a);
    return this.db.petVaccination.findMany({
      where: { petId: id },
      orderBy: { validUntil: "desc" },
    });
  }
  @Post("admin/billing/itemized") async itemized(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    const u = await this.staff(
      a,
      ["ACCOUNTANT", "ADMIN", "RECEPTION"],
      x.branchId,
    );
    if (
      !x.ownerName ||
      !Array.isArray(x.items) ||
      !x.items.length ||
      x.items.length > 100
    )
      throw new HttpException("Invalid invoice", 400);
    const lines = x.items.map((it: any) => {
      const qty = Number(it.quantity),
        unit = Number(it.unitPrice),
        discount = Number(it.discount || 0),
        rate = this.rate(it.gstRate);
      if (
        !it.description ||
        !Number.isInteger(qty) ||
        qty < 1 ||
        unit < 0 ||
        discount < 0 ||
        discount > qty * unit
      )
        throw new HttpException("Invalid invoice line", 400);
      const base = this.round(qty * unit - discount),
        tax = this.round((base * rate) / 100),
        interstate = !!x.interstate;
      return {
        description: String(it.description),
        hsnSac: it.hsnSac || null,
        quantity: qty,
        unitPrice: unit,
        discount,
        gstRate: rate,
        cgst: interstate ? 0 : this.round(tax / 2),
        sgst: interstate ? 0 : this.round(tax - this.round(tax / 2)),
        igst: interstate ? tax : 0,
        total: this.round(base + tax),
      };
    });
    const total = this.round(
      lines.reduce((n: number, it: any) => n + it.total, 0),
    );
    return this.db.$transaction(async (tx) => {
      const inv = await tx.invoice.create({
        data: {
          number:
            "VDV-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
          branchId: x.branchId,
          ownerName: x.ownerName,
          description: "Itemised services and products",
          amount: total,
        },
      });
      await tx.invoiceTaxLine.createMany({
        data: lines.map((it: any) => ({ ...it, invoiceId: inv.id })),
      });
      await tx.audit.create({
        data: {
          actorId: u.id,
          action: "ISSUE_GST_INVOICE",
          entity: "Invoice",
          entityId: inv.id,
        },
      });
      return { invoice: inv, lines };
    });
  }
  @Get("admin/invoices/:id/pdf") async invoicePDF(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    const inv = await this.db.invoice.findUnique({
      where: { id },
      include: { branch: true, payments: true },
    });
    if (!inv) throw new HttpException("Invoice not found", 404);
    await this.staff(a, [], inv.branchId);
    const lines = await this.db.invoiceTaxLine.findMany({
      where: { invoiceId: id },
    });
    return this.pdf(res, `invoice-${inv.number}.pdf`, (doc: any) => {
      this.header(doc, "INVOICE");
      doc
        .fontSize(11)
        .text(`Invoice: ${inv.number}`)
        .text(`Branch: ${inv.branch.name}`)
        .text(`Customer: ${inv.ownerName}`)
        .text(`Date: ${inv.createdAt.toISOString().slice(0, 10)}`)
        .moveDown();
      for (const l of lines) {
        doc.text(
          `${l.description} | Qty ${l.quantity} | Rate INR ${l.unitPrice} | GST ${l.gstRate}% | Total INR ${l.total}`,
        );
      }
      doc
        .moveDown()
        .fontSize(12)
        .text(`Total: INR ${inv.amount}`)
        .text(`Paid: INR ${inv.paid}`)
        .text(
          `Balance: INR ${(Number(inv.amount) - Number(inv.paid)).toFixed(2)}`,
        );
      doc
        .fontSize(9)
        .text(
          "Tax treatment, HSN/SAC and registration details must be verified by hospital accountant before use as statutory tax invoice.",
        );
    });
  }
  @Get("admin/billing/reconciliation") async reconcile(
    @Headers("authorization") a: string,
    @Query("branchId") branchId?: string,
  ) {
    const u = await this.staff(a, ["ACCOUNTANT", "ADMIN"], branchId);
    const ids =
      u.role === "SUPER_ADMIN" ? undefined : u.branches.map((b) => b.branchId);
    const where: any = {
      ...(branchId ? { branchId } : ids ? { branchId: { in: ids } } : {}),
    };
    const invoices = await this.db.invoice.findMany({
      where,
      include: { payments: true },
    });
    return invoices.map((inv) => ({
      number: inv.number,
      branchId: inv.branchId,
      billed: Number(inv.amount),
      postedPaid: Number(inv.paid),
      paymentSum: this.round(
        inv.payments.reduce((t, p) => t + Number(p.amount), 0),
      ),
      difference: this.round(
        Number(inv.paid) -
          inv.payments.reduce((t, p) => t + Number(p.amount), 0),
      ),
      balance: this.round(Number(inv.amount) - Number(inv.paid)),
      status: inv.status,
    }));
  }
  @Get("admin/billing/reconciliation.pdf") async reconcilePDF(
    @Headers("authorization") a: string,
    @Res() res: Response,
    @Query("branchId") branchId?: string,
  ) {
    const rows = await this.reconcile(a, branchId);
    return this.pdf(res, "reconciliation.pdf", (doc: any) => {
      this.header(doc, "BILLING RECONCILIATION");
      for (const row of rows.slice(0, 75))
        doc
          .fontSize(9)
          .text(
            `${row.number} | Billed ${row.billed} | Paid ${row.paymentSum} | Difference ${row.difference}`,
          );
      doc
        .moveDown()
        .text(
          `Total exceptions: ${rows.filter((x) => Math.abs(x.difference) > 0.009).length}`,
        );
    });
  }
  private rate(n: any) {
    const v = Number(n || 0);
    if (!Number.isFinite(v) || v < 0 || v > 100)
      throw new HttpException("Invalid GST rate", 400);
    return v;
  }
  private round(n: number) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }
  private header(doc: any, title: string) {
    doc
      .fontSize(19)
      .fillColor("#07376E")
      .text("VedaVet Pet Hospital")
      .fillColor("#111111")
      .moveDown(0.5)
      .fontSize(15)
      .text(title)
      .moveDown();
  }
  private pdf(res: Response, filename: string, fill: (doc: any) => void) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
    );
    res.setHeader("Cache-Control", "no-store");
    const doc = new PDFDocument({ margin: 42 });
    doc.pipe(res);
    fill(doc);
    doc.end();
  }
}
