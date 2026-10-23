import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Headers,
  Param,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { Db } from "./routes";
import * as jwt from "jsonwebtoken";

@Controller("api/v1/clinical")
export class ClinicalController {
  constructor(private db: Db) {}
  private async auth(header: string, allowed: string[] = [], branch?: string) {
    let claims: any;
    try {
      claims = jwt.verify(
        (header || "").replace(/^Bearer /, ""),
        process.env.JWT_SECRET || "DEMO_ONLY_CHANGE_ME",
      );
    } catch {
      throw new HttpException("Login required", 401);
    }
    const user = await this.db.user.findUnique({
      where: { id: claims.sub },
      include: { branches: true },
    });
    if (!user?.active) throw new HttpException("Account disabled", 401);
    if (
      allowed.length &&
      !allowed.includes(user.role) &&
      user.role !== "SUPER_ADMIN"
    )
      throw new HttpException("Role not authorised", 403);
    if (
      branch &&
      user.role !== "SUPER_ADMIN" &&
      !user.branches.some((b) => b.branchId === branch)
    )
      throw new HttpException("Branch access denied", 403);
    return user;
  }
  private async entity<T extends { branchId: string }>(model: any, id: string) {
    const r: T | null = await model.findUnique({ where: { id } });
    if (!r) throw new HttpException("Record not found", 404);
    return r;
  }
  private async log(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
  ) {
    await this.db.audit.create({
      data: { actorId: userId, action, entity, entityId },
    });
  }
  private async petExists(petId: string) {
    if (!(await this.db.pet.findUnique({ where: { id: petId } })))
      throw new HttpException("Unknown patient", 400);
  }
  @Get("consultations") async consultations(
    @Headers("authorization") h: string,
  ) {
    const u = await this.auth(h);
    return this.db.consultation.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { branchId: { in: u.branches.map((b) => b.branchId) } },
      include: { prescriptions: true, labOrders: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }
  @Post("consultations") async addConsultation(
    @Headers("authorization") h: string,
    @Body() x: any,
  ) {
    const u = await this.auth(h, ["DOCTOR", "ADMIN"], x.branchId);
    await this.petExists(x.petId);
    if (!x.symptoms) throw new HttpException("Symptoms required", 400);
    const r = await this.db.consultation.create({
      data: {
        branchId: x.branchId,
        petId: x.petId,
        doctorUserId: u.id,
        appointmentId: x.appointmentId || null,
        symptoms: x.symptoms,
        vitals: x.vitals || {},
        diagnosis: x.diagnosis || null,
        treatment: x.treatment || null,
      },
    });
    await this.log(u.id, "CREATE", "Consultation", r.id);
    return r;
  }
  @Patch("consultations/:id") async updateConsultation(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    let c = await this.entity<any>(this.db.consultation, id);
    const u = await this.auth(h, ["DOCTOR", "ADMIN"], c.branchId);
    if (c.status !== "DRAFT")
      throw new HttpException("Final record is locked", 409);
    const data: any = {};
    for (const k of [
      "symptoms",
      "vitals",
      "diagnosis",
      "treatment",
      "followUpAt",
    ])
      if (x[k] !== undefined)
        data[k] = k === "followUpAt" && x[k] ? new Date(x[k]) : x[k];
    const r = await this.db.consultation.update({ where: { id }, data });
    await this.log(u.id, "UPDATE", "Consultation", id);
    return r;
  }
  @Post("consultations/:id/finalise") async finalise(
    @Headers("authorization") h: string,
    @Param("id") id: string,
  ) {
    let c = await this.entity<any>(this.db.consultation, id);
    const u = await this.auth(h, ["DOCTOR", "ADMIN"], c.branchId);
    if (c.status !== "DRAFT") throw new HttpException("Already final", 409);
    const r = await this.db.consultation.update({
      where: { id },
      data: { status: "FINAL" },
    });
    await this.log(u.id, "FINALISE", "Consultation", id);
    return r;
  }
  @Post("consultations/:id/prescriptions") async addRx(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const c = await this.entity<any>(this.db.consultation, id);
    const u = await this.auth(h, ["DOCTOR", "ADMIN"], c.branchId);
    if (c.status !== "DRAFT" || !Array.isArray(x.items) || !x.items.length)
      throw new HttpException("Draft consultation and medicines required", 409);
    const r = await this.db.prescription.create({
      data: { consultationId: id, items: x.items },
    });
    await this.log(u.id, "PRESCRIBE", "Prescription", r.id);
    return r;
  }
  @Post("prescriptions/:id/issue") async issueRx(
    @Headers("authorization") h: string,
    @Param("id") id: string,
  ) {
    const r = await this.db.prescription.findUnique({
      where: { id },
      include: { consultation: true },
    });
    if (!r) throw new HttpException("Prescription missing", 404);
    const u = await this.auth(h, ["DOCTOR", "ADMIN"], r.consultation.branchId);
    if (r.status !== "DRAFT") throw new HttpException("Already issued", 409);
    const out = await this.db.prescription.update({
      where: { id },
      data: { status: "ISSUED", issuedAt: new Date() },
    });
    await this.log(u.id, "ISSUE", "Prescription", id);
    return out;
  }
  @Post("consultations/:id/lab-orders") async addLab(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const c = await this.entity<any>(this.db.consultation, id);
    const u = await this.auth(h, ["DOCTOR", "ADMIN"], c.branchId);
    if (!x.testName || !String(x.testName).trim())
      throw new HttpException("Test required", 400);
    const urgency = String(x.urgency || "ROUTINE").toUpperCase();
    if (!["ROUTINE", "URGENT", "EMERGENCY"].includes(urgency))
      throw new HttpException("Invalid urgency", 400);
    const r = await this.db.labOrder.create({
      data: {
        consultationId: id,
        testName: String(x.testName).trim(),
        urgency,
        clinicalReason: x.clinicalReason || null,
      },
    });
    await this.log(u.id, "ORDER", "LabOrder", r.id);
    return r;
  }
  @Get("labs") async labs(@Headers("authorization") h: string) {
    const u = await this.auth(h);
    return this.db.labOrder.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : {
              consultation: {
                branchId: { in: u.branches.map((b) => b.branchId) },
              },
            },
      include: { consultation: true },
      orderBy: { createdAt: "desc" },
    });
  }
  @Post("labs/:id/arrive") async labArrive(
    @Headers("authorization") h: string,
    @Param("id") id: string,
  ) {
    const order = await this.db.labOrder.findUnique({
      where: { id },
      include: { consultation: true },
    });
    if (!order) throw new HttpException("Lab order not found", 404);
    const u = await this.auth(h, ["LAB", "ADMIN"], order.consultation.branchId);
    if (order.status !== "ORDERED")
      throw new HttpException("Order cannot be marked arrived", 409);
    const result = await this.db.labOrder.update({
      where: { id },
      data: { status: "ARRIVED", arrivedAt: new Date(), acceptedById: u.id },
    });
    await this.log(u.id, "ARRIVE", "LabOrder", id);
    return result;
  }
  @Post("labs/:id/invoice") async labInvoice(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const order = await this.db.labOrder.findUnique({
      where: { id },
      include: { consultation: true },
    });
    if (!order) throw new HttpException("Lab order missing", 404);
    const u = await this.auth(
      h,
      ["RECEPTION", "ADMIN"],
      order.consultation.branchId,
    );
    if (order.invoiceId) throw new HttpException("Invoice already linked", 409);
    if (order.status !== "ARRIVED")
      throw new HttpException("Patient must arrive at Lab first", 409);
    const amount = Number(x.amount);
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      Math.round(amount * 100) !== amount * 100
    )
      throw new HttpException("Valid approved test charge required", 400);
    const pet = await this.db.pet.findUnique({
      where: { id: order.consultation.petId },
      include: { owner: true },
    });
    const out = await this.db.$transaction(async (tx) => {
      const updated = await tx.labOrder.updateMany({
        where: { id, invoiceId: null, status: "ARRIVED" },
        data: { status: "BILLING_PENDING" },
      });
      if (updated.count !== 1)
        throw new HttpException("Order already invoiced or state changed", 409);
      const invoice = await tx.invoice.create({
        data: {
          number: "LAB-" + id.slice(-12).toUpperCase(),
          branchId: order.consultation.branchId,
          ownerName: pet?.owner?.name || "Pet Owner",
          description: "Lab: " + order.testName,
          amount,
        },
      });
      await tx.labOrder.update({
        where: { id },
        data: { invoiceId: invoice.id },
      });
      await tx.audit.create({
        data: {
          actorId: u.id,
          action: "LAB_INVOICE",
          entity: "LabOrder",
          entityId: id,
          details: { invoiceId: invoice.id, amount },
        },
      });
      return invoice;
    });
    return { orderId: id, invoice: out };
  }
  @Post("labs/:id/start") async labStart(
    @Headers("authorization") h: string,
    @Param("id") id: string,
  ) {
    const order = await this.db.labOrder.findUnique({
      where: { id },
      include: { consultation: true },
    });
    if (!order) throw new HttpException("Lab order missing", 404);
    const u = await this.auth(h, ["LAB", "ADMIN"], order.consultation.branchId);
    if (order.status !== "BILLING_PENDING" || !order.invoiceId)
      throw new HttpException("Lab arrival and invoice required", 409);
    const bill = await this.db.invoice.findUnique({
      where: { id: order.invoiceId },
    });
    if (
      !bill ||
      bill.status !== "PAID" ||
      Number(bill.paid) < Number(bill.amount)
    )
      throw new HttpException(
        "Lab invoice full payment clearance required",
        409,
      );
    const out = await this.db.labOrder.updateMany({
      where: { id, status: "BILLING_PENDING" },
      data: { status: "PROCESSING" },
    });
    if (out.count !== 1) throw new HttpException("Lab state changed", 409);
    await this.log(u.id, "START_TEST", "LabOrder", id);
    return this.db.labOrder.findUnique({ where: { id } });
  }
  @Post("labs/:id/review") async reviewLab(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const order = await this.db.labOrder.findUnique({
      where: { id },
      include: { consultation: true },
    });
    if (!order) throw new HttpException("Lab order missing", 404);
    const u = await this.auth(h, ["DOCTOR"], order.consultation.branchId);
    if (order.status !== "RELEASED")
      throw new HttpException("Only released reports may be acknowledged", 409);
    if (order.reportReviewedAt)
      throw new HttpException("Already reviewed", 409);
    if (!String(x.notes || "").trim())
      throw new HttpException("Doctor review notes required", 400);
    const out = await this.db.labOrder.update({
      where: { id },
      data: {
        reportReviewedAt: new Date(),
        reportReviewedById: u.id,
        reviewNotes: String(x.notes).trim(),
      },
    });
    await this.log(u.id, "REVIEW_REPORT", "LabOrder", id);
    return out;
  }
  @Post("labs/:id/result") async labResult(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const r = await this.db.labOrder.findUnique({
      where: { id },
      include: { consultation: true },
    });
    if (!r) throw new HttpException("Missing lab order", 404);
    const u = await this.auth(h, ["LAB", "ADMIN"], r.consultation.branchId);
    if (r.status !== "PROCESSING")
      throw new HttpException(
        "Lab processing must be started after payment clearance",
        409,
      );
    if (!x.findings || typeof x.findings !== "object")
      throw new HttpException("Result required", 400);
    const updated = await this.db.labOrder.update({
      where: { id },
      data: {
        findings: x.findings,
        status: "RESULT_ENTERED",
        reportedAt: new Date(),
      },
    });
    await this.log(u.id, "RESULT", "LabOrder", id);
    return updated;
  }
  @Post("labs/:id/release") async labRelease(
    @Headers("authorization") h: string,
    @Param("id") id: string,
  ) {
    const r = await this.db.labOrder.findUnique({
      where: { id },
      include: { consultation: true },
    });
    if (!r) throw new HttpException("Missing lab order", 404);
    const u = await this.auth(h, ["DOCTOR", "ADMIN"], r.consultation.branchId);
    if (r.status !== "RESULT_ENTERED")
      throw new HttpException("Result not ready", 409);
    const updated = await this.db.labOrder.update({
      where: { id },
      data: { status: "RELEASED", releasedAt: new Date(), approvedById: u.id },
    });
    await this.log(u.id, "RELEASE", "LabOrder", id);
    return updated;
  }
  @Get("admissions") async admissions(@Headers("authorization") h: string) {
    const u = await this.auth(h);
    return this.db.admission.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { branchId: { in: u.branches.map((b) => b.branchId) } },
      orderBy: { createdAt: "desc" },
    });
  }
  @Post("admissions") async admit(
    @Headers("authorization") h: string,
    @Body() x: any,
  ) {
    const u = await this.auth(h, ["IPD_OT", "DOCTOR", "ADMIN"], x.branchId);
    await this.petExists(x.petId);
    if (!x.bedCode || !(Number(x.dailyRate) >= 0))
      throw new HttpException("Bed and daily rate required", 400);
    const r = await this.db.admission.create({
      data: {
        branchId: x.branchId,
        petId: x.petId,
        bedCode: x.bedCode,
        dailyRate: Number(x.dailyRate),
        diagnosis: x.diagnosis || null,
        treatmentNotes: x.treatmentNotes || null,
      },
    });
    await this.log(u.id, "ADMIT", "Admission", r.id);
    return r;
  }
  @Post("admissions/:id/discharge") async discharge(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const r = await this.entity<any>(this.db.admission, id);
    const u = await this.auth(h, ["IPD_OT", "DOCTOR", "ADMIN"], r.branchId);
    if (r.status !== "ADMITTED")
      throw new HttpException("Patient is not admitted", 409);
    const updated = await this.db.admission.update({
      where: { id },
      data: {
        status: "DISCHARGED",
        dischargedAt: new Date(),
        treatmentNotes: x.treatmentNotes || r.treatmentNotes,
      },
    });
    await this.log(u.id, "DISCHARGE", "Admission", id);
    return updated;
  }
  @Get("surgeries") async surgeries(@Headers("authorization") h: string) {
    const u = await this.auth(h);
    return this.db.surgery.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { branchId: { in: u.branches.map((b) => b.branchId) } },
      orderBy: { scheduledAt: "desc" },
    });
  }
  @Post("surgeries") async surgery(
    @Headers("authorization") h: string,
    @Body() x: any,
  ) {
    const u = await this.auth(h, ["IPD_OT", "DOCTOR", "ADMIN"], x.branchId);
    await this.petExists(x.petId);
    if (!x.procedureName || !x.scheduledAt || !Number.isFinite(Number(x.fee)))
      throw new HttpException("Procedure, schedule and fee required", 400);
    const r = await this.db.surgery.create({
      data: {
        branchId: x.branchId,
        petId: x.petId,
        surgeonId: x.surgeonId || u.id,
        procedureName: x.procedureName,
        scheduledAt: new Date(x.scheduledAt),
        fee: Number(x.fee),
      },
    });
    await this.log(u.id, "SCHEDULE", "Surgery", r.id);
    return r;
  }
  @Patch("surgeries/:id") async updateSurgery(
    @Headers("authorization") h: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const r = await this.entity<any>(this.db.surgery, id);
    const u = await this.auth(h, ["IPD_OT", "DOCTOR", "ADMIN"], r.branchId);
    const data: any = {};
    for (const k of [
      "preOpNotes",
      "anaesthesiaNotes",
      "operativeNotes",
      "postOpNotes",
      "status",
    ])
      if (x[k] !== undefined) data[k] = x[k];
    if (
      data.status &&
      !["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(
        data.status,
      )
    )
      throw new HttpException("Invalid status", 400);
    const out = await this.db.surgery.update({ where: { id }, data });
    await this.log(u.id, "UPDATE", "Surgery", id);
    return out;
  }
  @Get("documents") async documents(@Headers("authorization") h: string) {
    const u = await this.auth(h);
    return this.db.clinicalDocument.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { branchId: { in: u.branches.map((b) => b.branchId) } },
      orderBy: { createdAt: "desc" },
    });
  }
  @Post("documents") async document(
    @Headers("authorization") h: string,
    @Body() x: any,
  ) {
    const u = await this.auth(
      h,
      ["DOCTOR", "LAB", "IPD_OT", "ADMIN", "ACCOUNTANT"],
      x.branchId,
    );
    await this.petExists(x.petId);
    if (!x.type || !x.title || !x.contents || typeof x.contents !== "object")
      throw new HttpException("Document metadata required", 400);
    const doc = await this.db.clinicalDocument.create({
      data: {
        branchId: x.branchId,
        petId: x.petId,
        type: x.type,
        title: x.title,
        contents: x.contents,
        referenceId: x.referenceId || null,
        generatedById: u.id,
      },
    });
    await this.log(u.id, "GENERATE", "ClinicalDocument", doc.id);
    return doc;
  }
}
