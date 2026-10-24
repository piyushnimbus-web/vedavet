import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Headers,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
@Injectable()
export class Db extends PrismaClient {}
const key = () => process.env.JWT_SECRET || "DEMO_ONLY_CHANGE_ME";
@Controller("api/v1")
export class ApiController {
  constructor(private db: Db) {}
  private async user(auth?: string) {
    try {
      if (!auth?.startsWith("Bearer ")) throw 1;
      const data: any = jwt.verify(auth.slice(7), key());
      const u = await this.db.user.findUnique({
        where: { id: data.sub },
        include: { branches: true },
      });
      if (!u?.active) throw 1;
      return u;
    } catch {
      throw new HttpException("Login required", 401);
    }
  }
  private async permission(
    auth: string,
    roles: string[] = [],
    branchId?: string,
  ) {
    const u = await this.user(auth);
    if (roles.length && !roles.includes(u.role) && u.role !== "SUPER_ADMIN")
      throw new HttpException("Role not permitted", 403);
    if (
      branchId &&
      u.role !== "SUPER_ADMIN" &&
      !u.branches.some((x) => x.branchId === branchId)
    )
      throw new HttpException("Branch not permitted", 403);
    return u;
  }
  private async audit(
    user: any,
    action: string,
    entity: string,
    id: string,
    details: any = {},
  ) {
    await this.db.audit.create({
      data: { actorId: user.id, action, entity, entityId: id, details },
    });
  }
  @Get("health") health() {
    return {
      status: "ok",
      service: "VedaVet Local API",
      payments: "DISABLED",
      notifications: "DISABLED",
    };
  }
  @Post("auth/login") async login(@Body() x: any) {
    const u = await this.db.user.findUnique({
      where: { email: String(x.email || "").toLowerCase() },
      include: { branches: { include: { branch: true } } },
    });
    if (
      !u?.active ||
      !(await bcrypt.compare(String(x.password || ""), u.passwordHash))
    )
      throw new HttpException("Invalid credentials", 401);
    const token = jwt.sign({ sub: u.id, role: u.role }, key(), {
      expiresIn: "8h",
    });
    return {
      token,
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        branches: u.branches.map((b) => ({
          id: b.branchId,
          name: b.branch.name,
        })),
      },
    };
  }
  @Get("auth/me") async me(@Headers("authorization") a: string) {
    let u = await this.user(a);
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      branchIds: u.branches.map((x) => x.branchId),
    };
  }
  @Get("public/branches") branches() {
    return this.db.branch.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  }
  @Get("public/doctors") doctors() {
    return this.db.doctor.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  }
  @Get("public/services") services() {
    return this.db.service.findMany({ where: { active: true } });
  }
  @Get("public/products") async products() {
    const items = await this.db.product.findMany({
      where: { active: true },
      include: { stocks: true },
    });
    return items.map((p) => ({
      ...p,
      stock: p.stocks.reduce((x, s) => x + s.quantity, 0),
    }));
  }
  @Post("public/appointments") async book(@Body() x: any) {
    const { ownerName, phone, email, petName, branchId, doctorId, date, time } =
      x || {};
    if (
      !ownerName ||
      !phone ||
      !petName ||
      !branchId ||
      !doctorId ||
      !date ||
      !/^\d\d:\d\d$/.test(time || "")
    )
      throw new HttpException("Complete all required fields", 400);
    const doc = await this.db.doctor.findFirst({
      where: { id: doctorId, branchId, active: true },
    });
    if (!doc) throw new HttpException("Doctor not assigned to branch", 400);
    const startAt = new Date(`${date}T${time}:00+05:30`);
    if (isNaN(+startAt) || startAt < new Date())
      throw new HttpException("Choose a future time", 400);
    try {
      return await this.db.$transaction(async (tx) => {
        let owner = await tx.owner.create({
          data: {
            name: String(ownerName),
            phone: String(phone),
            email: email || null,
          },
        });
        let pet = await tx.pet.create({
          data: {
            name: String(petName),
            species: "Not specified",
            ownerId: owner.id,
            petCode: "VDV" + Date.now().toString().slice(-9),
          },
        });
        return tx.appointment.create({
          data: {
            branchId,
            doctorId,
            ownerId: owner.id,
            petId: pet.id,
            startAt,
          },
          include: { doctor: true, branch: true },
        });
      });
    } catch (e: any) {
      if (e.code === "P2002")
        throw new HttpException("Time slot unavailable; choose another", 409);
      throw e;
    }
  }
  @Post("public/orders") async order(@Body() x: any) {
    if (
      !x.customerName ||
      !x.phone ||
      !x.address ||
      !Array.isArray(x.items) ||
      !x.items.length
    )
      throw new HttpException("Missing order data", 400);
    return this.db.$transaction(async (tx) => {
      let total = 0;
      let orderItems: any[] = [];
      for (let item of x.items) {
        let p = await tx.product.findFirst({
          where: { id: item.productId, active: true },
        });
        if (
          !p ||
          !Number.isInteger(+item.quantity) ||
          +item.quantity < 1 ||
          +item.quantity > 50
        )
          throw new HttpException("Invalid product or quantity", 400);
        const qty = +item.quantity;
        const stock = await tx.stock.findFirst({
          where: { productId: p.id, quantity: { gte: qty } },
        });
        if (!stock)
          throw new HttpException("Insufficient stock: " + p.name, 409);
        let updated = await tx.stock.updateMany({
          where: { id: stock.id, quantity: { gte: qty } },
          data: { quantity: { decrement: qty } },
        });
        if (updated.count !== 1)
          throw new HttpException("Stock changed; retry", 409);
        total += Number(p.price) * qty;
        orderItems.push({ productId: p.id, quantity: qty, price: p.price });
      }
      return tx.shopOrder.create({
        data: {
          customerName: x.customerName,
          phone: x.phone,
          address: x.address,
          amount: total,
          status: "UNPAID",
          items: { create: orderItems },
        },
        include: { items: true },
      });
    });
  }
  @Get("dashboard") async dashboard(@Headers("authorization") a: string) {
    let u = await this.permission(a);
    let ids = u.branches.map((b) => b.branchId);
    const where = u.role === "SUPER_ADMIN" ? {} : { branchId: { in: ids } };
    let [appointments, branches, invoices, clinical, orders] =
      await Promise.all([
        this.db.appointment.count({ where }),
        this.db.branch.count(),
        this.db.invoice.findMany({ where }),
        this.db.clinicalCase.count({ where }),
        this.db.shopOrder.count(),
      ]);
    return {
      role: u.role,
      branches,
      appointments,
      clinicalCases: clinical,
      orders,
      invoices: invoices.length,
      billed: invoices.reduce((v, x) => v + Number(x.amount), 0),
      collected: invoices.reduce((v, x) => v + Number(x.paid), 0),
    };
  }
  @Get("admin/branches") async listBranches(
    @Headers("authorization") a: string,
  ) {
    let u = await this.permission(a);
    return this.db.branch.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { id: { in: u.branches.map((x) => x.branchId) } },
    });
  }
  @Post("admin/branches") async createBranch(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    let u = await this.permission(a, ["SUPER_ADMIN"]);
    if (!x.name || !x.city || !x.code)
      throw new HttpException("code, name and city required", 400);
    let v = await this.db.branch.create({
      data: {
        name: x.name,
        city: x.city,
        code: x.code,
        address: x.address || "",
      },
    });
    await this.audit(u, "CREATE", "Branch", v.id);
    return v;
  }
  @Get("admin/users") async users(@Headers("authorization") a: string) {
    let u = await this.permission(a, ["SUPER_ADMIN", "ADMIN"]);
    return this.db.user.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : {
              branches: {
                some: { branchId: { in: u.branches.map((z) => z.branchId) } },
              },
            },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        branches: true,
      },
    });
  }
  @Post("admin/users") async addUser(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    let u = await this.permission(a, ["SUPER_ADMIN", "ADMIN"]);
    if (!x.email || !x.name || !x.role || !x.password || !x.branchId)
      throw new HttpException("Missing staff fields", 400);
    if (
      ![
        "ADMIN",
        "DOCTOR",
        "RECEPTION",
        "LAB",
        "PHARMACY",
        "IPD_OT",
        "BOARDING",
        "ACCOUNTANT",
        "SHOP_MANAGER",
        "GROOMING",
        "INVENTORY",
      ].includes(x.role)
    )
      throw new HttpException("Invalid role", 400);
    if (u.role === "ADMIN" && x.role === "ADMIN")
      throw new HttpException("Only Super Admin can add admins", 403);
    await this.permission(a, [], x.branchId);
    const branch = await this.db.branch.findUnique({
      where: { id: x.branchId },
    });
    if (!branch) throw new HttpException("Branch not found", 404);
    const existing = await this.db.userBranch.count({
      where: { branchId: x.branchId, user: { active: true } },
    });
    if (existing >= branch.userLimit)
      throw new HttpException(
        "Branch user limit reached; contact Super Admin",
        409,
      );
    if (String(x.password).length < 12)
      throw new HttpException("Password must have at least 12 characters", 400);
    let v = await this.db.user.create({
      data: {
        email: x.email.toLowerCase(),
        name: x.name,
        role: x.role,
        passwordHash: await bcrypt.hash(x.password, 10),
        branches: { create: { branchId: x.branchId } },
      },
    });
    await this.audit(u, "CREATE", "User", v.id);
    return { id: v.id, email: v.email };
  }
  @Get("admin/:resource") async list(
    @Headers("authorization") a: string,
    @Param("resource") resource: string,
  ) {
    let u = await this.permission(a);
    let ids = u.branches.map((b) => b.branchId);
    let w = u.role === "SUPER_ADMIN" ? {} : { branchId: { in: ids } };
    switch (resource) {
      case "doctors":
        return this.db.doctor.findMany({ where: w });
      case "owners":
        return this.db.owner.findMany({ include: { pets: true } });
      case "pets":
        return this.db.pet.findMany({ include: { owner: true } });
      case "appointments":
        return this.db.appointment.findMany({
          where: w,
          include: { pet: true, owner: true, doctor: true, branch: true },
          orderBy: { startAt: "desc" },
          take: 150,
        });
      case "cases":
        return this.db.clinicalCase.findMany({
          where: w,
          include: { pet: true, branch: true },
          orderBy: { createdAt: "desc" },
        });
      case "products":
        return this.db.product.findMany({ include: { stocks: true } });
      case "stocks":
        return this.db.stock.findMany({
          where: w,
          include: { product: true, branch: true },
        });
      case "invoices":
        return this.db.invoice.findMany({
          where: w,
          include: { payments: true, branch: true },
          orderBy: { createdAt: "desc" },
        });
      case "orders":
        return this.db.shopOrder.findMany({
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: "desc" },
        });
      case "services":
        return this.db.service.findMany();
      case "audit":
        await this.permission(a, ["SUPER_ADMIN", "ADMIN"]);
        return this.db.audit.findMany({ orderBy: { at: "desc" }, take: 200 });
      default:
        throw new HttpException("Unknown resource", 404);
    }
  }
  @Post("admin/:resource") async create(
    @Headers("authorization") a: string,
    @Param("resource") resource: string,
    @Body() x: any,
  ) {
    let roles: any = {
      doctors: ["ADMIN"],
      services: ["ADMIN"],
      cases: ["DOCTOR", "LAB", "PHARMACY", "IPD_OT", "BOARDING", "ADMIN"],
      products: ["SHOP_MANAGER", "ADMIN"],
      stocks: ["PHARMACY", "SHOP_MANAGER", "ADMIN"],
      invoices: ["ACCOUNTANT", "ADMIN", "RECEPTION"],
      owners: ["RECEPTION", "ADMIN"],
      pets: ["RECEPTION", "ADMIN"],
    };
    if (!roles[resource]) throw new HttpException("Unsupported", 404);
    let u = await this.permission(a, roles[resource], x.branchId);
    let v: any;
    switch (resource) {
      case "doctors":
        v = await this.db.doctor.create({
          data: {
            name: x.name,
            specialty: x.specialty || "Veterinary",
            branchId: x.branchId,
          },
        });
        break;
      case "services":
        v = await this.db.service.create({
          data: { name: x.name, price: Number(x.price) },
        });
        break;
      case "cases":
        v = await this.db.clinicalCase.create({
          data: {
            type: x.type,
            title: x.title,
            petId: x.petId,
            branchId: x.branchId,
            notes: x.notes || "",
            status: x.status || "OPEN",
          },
        });
        break;
      case "products":
        v = await this.db.product.create({
          data: {
            name: x.name,
            category: x.category,
            price: Number(x.price),
            description: x.description || "",
            imageUrl: x.imageUrl || null,
          },
        });
        break;
      case "stocks":
        v = await this.db.stock.upsert({
          where: {
            branchId_productId: {
              branchId: x.branchId,
              productId: x.productId,
            },
          },
          create: {
            branchId: x.branchId,
            productId: x.productId,
            quantity: Number(x.quantity),
          },
          update: { quantity: Number(x.quantity) },
        });
        break;
      case "invoices":
        v = await this.db.invoice.create({
          data: {
            number: x.number || `INV-${Date.now()}`,
            branchId: x.branchId,
            ownerName: x.ownerName,
            description: x.description,
            amount: Number(x.amount),
          },
        });
        break;
      case "owners":
        v = await this.db.owner.create({
          data: { name: x.name, phone: x.phone, email: x.email || null },
        });
        break;
      case "pets":
        v = await this.db.pet.create({
          data: {
            name: x.name,
            species: x.species,
            ownerId: x.ownerId,
            petCode: x.petCode || "VDV" + Date.now().toString().slice(-9),
          },
        });
        break;
    }
    await this.audit(u, "CREATE", resource, v.id);
    return v;
  }
  @Patch("admin/:resource/:id") async update(
    @Headers("authorization") a: string,
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const roles: any = {
      branches: ["SUPER_ADMIN"],
      doctors: ["ADMIN"],
      services: ["ADMIN"],
      cases: ["DOCTOR", "LAB", "PHARMACY", "IPD_OT", "BOARDING", "ADMIN"],
      products: ["SHOP_MANAGER", "ADMIN"],
      owners: ["RECEPTION", "ADMIN"],
      pets: ["RECEPTION", "ADMIN"],
      appointments: ["RECEPTION", "ADMIN"],
      users: ["SUPER_ADMIN", "ADMIN"],
    };
    if (!roles[resource])
      throw new HttpException("Not editable through this API", 403);
    let u = await this.permission(a, roles[resource]);
    let allowed: any = {
      branches: ["name", "city", "address", "phone", "active"],
      doctors: ["name", "specialty", "active"],
      services: ["name", "price", "active"],
      cases: ["title", "notes", "status"],
      products: [
        "name",
        "category",
        "description",
        "price",
        "imageUrl",
        "active",
      ],
      owners: ["name", "phone", "email"],
      pets: ["name", "species", "breed"],
      appointments: ["status", "notes"],
      users: ["active", "name"],
    };
    let data: any = {};
    for (let k of allowed[resource])
      if (x[k] !== undefined) data[k] = k === "price" ? Number(x[k]) : x[k];
    if (!Object.keys(data).length)
      throw new HttpException("No permitted fields", 400);
    let model: any = (this.db as any)[
      {
        branches: "branch",
        doctors: "doctor",
        services: "service",
        cases: "clinicalCase",
        products: "product",
        owners: "owner",
        pets: "pet",
        appointments: "appointment",
        users: "user",
      }[resource]
    ];
    let old = await model.findUnique({ where: { id } });
    if (!old) throw new HttpException("Not found", 404);
    if (old.branchId) await this.permission(a, [], old.branchId);
    if (
      resource === "users" &&
      u.role === "ADMIN" &&
      old.role === "SUPER_ADMIN"
    )
      throw new HttpException("Not permitted", 403);
    let v = await model.update({ where: { id }, data });
    await this.audit(u, "UPDATE", resource, id, { fields: Object.keys(data) });
    return v;
  }
  @Delete("admin/products/:id") async removeProduct(
    @Headers("authorization") a: string,
    @Param("id") id: string,
  ) {
    const u = await this.permission(a, ["SHOP_MANAGER", "ADMIN"]);
    const old = await this.db.product.findUnique({ where: { id } });
    if (!old) throw new HttpException("Not found", 404);
    // Products referenced by past orders are deactivated instead, so order history stays intact.
    const ordered = await this.db.orderItem.count({ where: { productId: id } });
    if (ordered) {
      await this.db.product.update({ where: { id }, data: { active: false } });
      await this.audit(u, "DEACTIVATE", "products", id);
      return { removed: false, deactivated: true };
    }
    await this.db.$transaction([
      this.db.stock.deleteMany({ where: { productId: id } }),
      this.db.product.delete({ where: { id } }),
    ]);
    await this.audit(u, "DELETE", "products", id);
    return { removed: true };
  }
  @Post("admin/invoices/:id/payments") async payment(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    const u = await this.permission(a, ["CASHIER", "ACCOUNTANT"]);
    const method = String(x.method || "");
    if (!["CASH", "UPI_COUNTER", "CARD_COUNTER"].includes(method))
      throw new HttpException(
        "Only cashier-confirmed counter methods supported; online gateway inactive",
        400,
      );
    const amount = Number(x.amount);
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      Math.round(amount * 100) !== amount * 100
    )
      throw new HttpException(
        "Positive amount with max 2 decimal places required",
        400,
      );
    const reference = String(x.reference || "").trim();
    if (method !== "CASH" && reference.length < 6)
      throw new HttpException(
        "UPI/Card requires a verified transaction reference (6+ chars)",
        400,
      );
    const invoice = await this.db.invoice.findUnique({ where: { id } });
    if (!invoice) throw new HttpException("Invoice not found", 404);
    await this.permission(a, [], invoice.branchId);
    // Serializable transaction prevents two concurrent cashiers overpaying one invoice.
    try {
      return await this.db.$transaction(
        async (tx) => {
          const latest = await tx.invoice.findUnique({ where: { id } });
          if (!latest) throw new HttpException("Invoice not found", 404);
          const totalPaise = Math.round(Number(latest.amount) * 100),
            paidPaise = Math.round(Number(latest.paid) * 100),
            amountPaise = Math.round(amount * 100);
          if (amountPaise > totalPaise - paidPaise)
            throw new HttpException("Payment exceeds remaining balance", 409);
          if (
            reference &&
            (await tx.payment.findFirst({ where: { method, reference } }))
          )
            throw new HttpException("Payment reference already recorded", 409);
          const payment = await tx.payment.create({
            data: {
              invoiceId: id,
              amount,
              method,
              receivedBy: u.id,
              reference: reference || null,
            },
          });
          const newPaid = (paidPaise + amountPaise) / 100;
          await tx.invoice.update({
            where: { id },
            data: {
              paid: newPaid,
              status:
                paidPaise + amountPaise === totalPaise ? "PAID" : "PARTIAL",
            },
          });
          await tx.audit.create({
            data: {
              actorId: u.id,
              action: "COUNTER_PAYMENT",
              entity: "Invoice",
              entityId: id,
              details: {
                amount,
                method,
                reference: reference || null,
                paymentId: payment.id,
              },
            },
          });
          return {
            paymentId: payment.id,
            invoiceId: id,
            amount,
            paid: newPaid,
            balance: (totalPaise - paidPaise - amountPaise) / 100,
            status: paidPaise + amountPaise === totalPaise ? "PAID" : "PARTIAL",
          };
        },
        { isolationLevel: "Serializable" },
      );
    } catch (e: any) {
      if (e.code === "P2034")
        throw new HttpException(
          "Concurrent payment update, please retry after refreshing",
          409,
        );
      throw e;
    }
  }

  @Get("admin/kennels") async kennels(@Headers("authorization") a: string) {
    let u = await this.permission(a);
    return this.db.kennel.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { branchId: { in: u.branches.map((b) => b.branchId) } },
      orderBy: { code: "asc" },
    });
  }
  @Post("admin/kennels") async addKennel(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    let u = await this.permission(a, ["ADMIN"], x.branchId);
    if (!x.code || !x.name || !(Number(x.ratePerNight) >= 0))
      throw new HttpException(
        "Branch, code, name and valid nightly rate required",
        400,
      );
    let v = await this.db.kennel.create({
      data: {
        branchId: x.branchId,
        code: x.code,
        name: x.name,
        ratePerNight: Number(x.ratePerNight),
      },
    });
    await this.audit(u, "CREATE", "Kennel", v.id);
    return v;
  }
  @Get("admin/boarding") async boarding(@Headers("authorization") a: string) {
    let u = await this.permission(a);
    return this.db.boardingStay.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { branchId: { in: u.branches.map((b) => b.branchId) } },
      include: { kennel: true, logs: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });
  }
  @Post("admin/boarding") async reserveBoarding(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    let u = await this.permission(
      a,
      ["BOARDING", "ADMIN", "RECEPTION"],
      x.branchId,
    );
    let kennel = await this.db.kennel.findFirst({
      where: { id: x.kennelId, branchId: x.branchId, active: true },
    });
    let pet = await this.db.pet.findUnique({ where: { id: x.petId } });
    let start = new Date(x.checkIn),
      end = new Date(x.checkOutExpected);
    if (!kennel || !pet || !(end > start))
      throw new HttpException("Valid pet, kennel and stay dates required", 400);
    return this.db.$transaction(async (tx) => {
      let clash = await tx.boardingStay.count({
        where: {
          kennelId: kennel.id,
          status: { in: ["RESERVED", "CHECKED_IN"] },
          checkIn: { lt: end },
          checkOutExpected: { gt: start },
        },
      });
      if (clash)
        throw new HttpException("Kennel already reserved for these dates", 409);
      let v = await tx.boardingStay.create({
        data: {
          branchId: x.branchId,
          petId: x.petId,
          kennelId: kennel.id,
          checkIn: start,
          checkOutExpected: end,
          nightlyRate: kennel.ratePerNight,
          feedingNotes: x.feedingNotes || "",
          medicationNotes: x.medicationNotes || "",
        },
      });
      const nights = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / 86400000),
      );
      const owner = await tx.owner.findUnique({ where: { id: pet.ownerId } });
      const invoice = await tx.invoice.create({
        data: {
          number: "BOARD-" + v.id.slice(-10).toUpperCase(),
          branchId: x.branchId,
          ownerName: owner?.name || "Owner",
          description: `Boarding plan: ${nights} night(s), kennel ${kennel.code}`,
          amount: Number(kennel.ratePerNight) * nights,
        },
      });
      await tx.boardingStay.update({
        where: { id: v.id },
        data: { invoiceId: invoice.id },
      });
      await tx.audit.create({
        data: {
          actorId: u.id,
          action: "CREATE",
          entity: "BoardingStay",
          entityId: v.id,
          details: { invoiceId: invoice.id },
        },
      });
      return {
        ...v,
        invoiceId: invoice.id,
        amount: Number(kennel.ratePerNight) * nights,
      };
    });
  }
  @Post("admin/boarding/:id/checkin") async boardingCheckin(
    @Headers("authorization") a: string,
    @Param("id") id: string,
  ) {
    let u = await this.permission(a, ["BOARDING", "ADMIN", "RECEPTION"]);
    let v = await this.db.boardingStay.findUnique({ where: { id } });
    if (!v || v.status !== "RESERVED")
      throw new HttpException("Reservation not available for check-in", 409);
    await this.permission(a, [], v.branchId);
    if (!v.invoiceId)
      throw new HttpException(
        "Plan invoice is missing; payment required before check-in",
        409,
      );
    const invoice = await this.db.invoice.findUnique({
      where: { id: v.invoiceId },
    });
    if (
      !invoice ||
      invoice.status !== "PAID" ||
      Number(invoice.paid) < Number(invoice.amount)
    )
      throw new HttpException(
        "Full verified boarding plan payment required before check-in",
        409,
      );
    let out = await this.db.boardingStay.update({
      where: { id },
      data: { status: "CHECKED_IN" },
    });
    await this.audit(u, "CHECK_IN", "BoardingStay", id);
    return out;
  }
  @Post("admin/boarding/:id/logs") async boardingLog(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    let u = await this.permission(a, ["BOARDING", "ADMIN"]);
    let v = await this.db.boardingStay.findUnique({ where: { id } });
    if (!v || v.status !== "CHECKED_IN")
      throw new HttpException("Stay is not checked in", 409);
    await this.permission(a, [], v.branchId);
    if (
      !x.notes ||
      !["FEEDING", "WALK", "MEDICATION", "OBSERVATION"].includes(x.type)
    )
      throw new HttpException("Valid log type and notes required", 400);
    return this.db.boardingLog.create({
      data: { stayId: id, type: x.type, notes: x.notes, staffId: u.id },
    });
  }
  @Post("admin/boarding/:id/checkout") async boardingCheckout(
    @Headers("authorization") a: string,
    @Param("id") id: string,
  ) {
    let u = await this.permission(a, ["BOARDING", "ADMIN", "ACCOUNTANT"]);
    let stay = await this.db.boardingStay.findUnique({
      where: { id },
      include: { kennel: true },
    });
    if (!stay || stay.status !== "CHECKED_IN")
      throw new HttpException("Stay is not checked in", 409);
    await this.permission(a, [], stay.branchId);
    let pet = await this.db.pet.findUnique({
      where: { id: stay.petId },
      include: { owner: true },
    });
    let now = new Date();
    let days = Math.max(
      1,
      Math.ceil((now.getTime() - stay.checkIn.getTime()) / 86400000),
    );
    let amount = Number(stay.nightlyRate) * days;
    return this.db.$transaction(async (tx) => {
      let updated = await tx.boardingStay.updateMany({
        where: { id, status: "CHECKED_IN" },
        data: { status: "CHECKED_OUT", checkOutActual: now },
      });
      if (updated.count !== 1)
        throw new HttpException("Already checked out", 409);
      const invoice = stay.invoiceId
        ? await tx.invoice.findUnique({ where: { id: stay.invoiceId } })
        : null;
      if (
        !invoice ||
        invoice.status !== "PAID" ||
        Number(invoice.paid) < Number(invoice.amount)
      )
        throw new HttpException("Final boarding plan payment not cleared", 409);
      await tx.audit.create({
        data: {
          actorId: u.id,
          action: "CHECK_OUT",
          entity: "BoardingStay",
          entityId: id,
          details: { invoiceId: invoice.id, days, amount },
        },
      });
      return { invoice, days, stayId: id };
    });
  }
}
