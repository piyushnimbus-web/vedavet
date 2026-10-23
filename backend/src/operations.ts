import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  Injectable,
  HttpException,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
@Injectable()
export class OpsDb extends PrismaClient {}
@Controller("api/v1/operations")
export class OperationsController {
  constructor(private db: OpsDb) {}
  private async who(a: string, roles: string[] = [], branchId?: string) {
    try {
      if (!a?.startsWith("Bearer ")) throw 0;
      let decoded: any = jwt.verify(
        a.slice(7),
        process.env.JWT_SECRET || "DEMO_ONLY_CHANGE_ME",
      );
      let u = await this.db.user.findUnique({
        where: { id: decoded.sub },
        include: { branches: true },
      });
      if (!u?.active) throw 0;
      if (roles.length && u.role !== "SUPER_ADMIN" && !roles.includes(u.role))
        throw new HttpException("Access denied", 403);
      if (
        branchId &&
        u.role !== "SUPER_ADMIN" &&
        !u.branches.some((x) => x.branchId === branchId)
      )
        throw new HttpException("Branch access denied", 403);
      return u;
    } catch (e: any) {
      if (e?.status === 403) throw e;
      throw new HttpException("Authentication required", 401);
    }
  }
  private log(
    actorId: string,
    action: string,
    entity: string,
    entityId: string,
    details: any = {},
  ) {
    return this.db.audit.create({
      data: { actorId, action, entity, entityId, details },
    });
  }
  @Get("billing/cashier-overview") async cashierOverview(
    @Headers("authorization") a: string,
  ) {
    const u = await this.who(a, [
      "CASHIER",
      "ACCOUNTANT",
      "ADMIN",
      "SUPER_ADMIN",
    ]);
    const branchIds = u.branches.map((b) => b.branchId);
    const where =
      u.role === "SUPER_ADMIN" ? {} : { branchId: { in: branchIds } };
    const invoices = await this.db.invoice.findMany({
      where,
      select: {
        id: true,
        number: true,
        branchId: true,
        ownerName: true,
        description: true,
        amount: true,
        paid: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 150,
    });
    return {
      invoices: invoices.map((x) => ({
        ...x,
        amount: Number(x.amount),
        paid: Number(x.paid),
        balance: Math.max(0, Number(x.amount) - Number(x.paid)),
      })),
      totals: {
        billed: invoices.reduce((v, x) => v + Number(x.amount), 0),
        collected: invoices.reduce((v, x) => v + Number(x.paid), 0),
        outstanding: invoices.reduce(
          (v, x) => v + Math.max(0, Number(x.amount) - Number(x.paid)),
          0,
        ),
      },
      notice:
        "Recent 150 invoices only; not an all-time accounting statement. UPI/CARD are cashier-verified counter entries, not gateway verification.",
    };
  }
  @Get("super-admin/overview") async overview(
    @Headers("authorization") a: string,
  ) {
    await this.who(a, ["SUPER_ADMIN"]);
    const [
      branches,
      staff,
      owners,
      pets,
      appointments,
      visits,
      invoices,
      boarding,
    ] = await Promise.all([
      this.db.branch.count(),
      this.db.user.count(),
      this.db.owner.count(),
      this.db.pet.count(),
      this.db.appointment.count(),
      this.db.visit.count(),
      this.db.invoice.findMany({
        select: { branchId: true, amount: true, paid: true },
      }),
      this.db.boardingStay.count(),
    ]);
    const byBranch: any = {};
    for (const x of invoices) {
      const b =
        byBranch[x.branchId] ||
        (byBranch[x.branchId] = { billed: 0, collected: 0, outstanding: 0 });
      b.billed += Number(x.amount);
      b.collected += Number(x.paid);
      b.outstanding += Math.max(0, Number(x.amount) - Number(x.paid));
    }
    return {
      branches,
      staff,
      owners,
      pets,
      appointments,
      visits,
      boarding,
      finance: {
        billed: invoices.reduce((s, x) => s + Number(x.amount), 0),
        collected: invoices.reduce((s, x) => s + Number(x.paid), 0),
        outstanding: invoices.reduce(
          (s, x) => s + Math.max(0, Number(x.amount) - Number(x.paid)),
          0,
        ),
      },
      byBranch,
      notice:
        "Collected totals from invoice records; expenses/profit not included until reconciled accounting implementation.",
    };
  }
  @Patch("super-admin/branches/:id/user-limit") async limit(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    let u = await this.who(a, ["SUPER_ADMIN"]);
    let count = Number(x.limit);
    if (!Number.isInteger(count) || count < 1 || count > 5000)
      throw new HttpException("Limit must be 1 to 5000", 400);
    let b = await this.db.branch.update({
      where: { id },
      data: { userLimit: count },
    });
    await this.log(u.id, "SET_USER_LIMIT", "Branch", id, { limit: count });
    return { id: b.id, userLimit: b.userLimit };
  }
  @Post("super-admin/users/:id/reset-password") async reset(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    let u = await this.who(a, ["SUPER_ADMIN"]);
    let pw = String(x.newPassword || "");
    if (
      pw.length < 12 ||
      pw.length > 128 ||
      !/[^a-zA-Z0-9]/.test(pw) ||
      !/[A-Z]/.test(pw) ||
      !/[0-9]/.test(pw)
    )
      throw new HttpException(
        "Use 12+ characters, uppercase, number and symbol",
        400,
      );
    const target = await this.db.user.findUnique({ where: { id } });
    if (!target) throw new HttpException("User not found", 404);
    await this.db.user.update({
      where: { id },
      data: { passwordHash: await bcrypt.hash(pw, 12) },
    });
    await this.log(u.id, "PASSWORD_RESET", "User", id);
    return {
      success: true,
      message:
        "Password reset; existing JWT sessions may remain valid until expiry in this development build.",
    };
  }
  @Get("reception/lookup/:query") async lookup(
    @Headers("authorization") a: string,
    @Param("query") query: string,
  ) {
    await this.who(a, ["RECEPTION", "ADMIN", "DOCTOR"]);
    let q = query.trim();
    if (q.length < 2 || q.length > 80)
      throw new HttpException("Query must be 2–80 characters", 400);
    let pets = await this.db.pet.findMany({
      where: {
        OR: [
          { petCode: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
          {
            owner: {
              OR: [
                { phone: { contains: q } },
                { name: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
      include: { owner: true },
      take: 25,
    });
    return pets.map((p) => ({
      id: p.id,
      petCode: p.petCode,
      name: p.name,
      species: p.species,
      breed: p.breed,
      owner: { id: p.owner.id, name: p.owner.name, phone: p.owner.phone },
    }));
  }
  @Get("reception/visits") async visits(@Headers("authorization") a: string) {
    let u = await this.who(a, ["RECEPTION", "ADMIN"]);
    return this.db.visit.findMany({
      where:
        u.role === "SUPER_ADMIN"
          ? {}
          : { branchId: { in: u.branches.map((b) => b.branchId) } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
  @Post("reception/visits") async checkin(
    @Headers("authorization") a: string,
    @Body() x: any,
  ) {
    let u = await this.who(a, ["RECEPTION", "ADMIN"], x.branchId);
    if (!x.branchId || !x.petId)
      throw new HttpException("Branch and pet required", 400);
    let pet = await this.db.pet.findUnique({ where: { id: x.petId } });
    if (!pet) throw new HttpException("Pet not found", 404);
    const date = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        return await this.db.$transaction(async (tx) => {
          const active = await tx.visit.findFirst({
            where: {
              petId: x.petId,
              branchId: x.branchId,
              status: { in: ["WAITING", "IN_PROGRESS", "READY_CHECKOUT"] },
            },
          });
          if (active)
            throw new HttpException("Pet already has an active visit", 409);
          const last = await tx.visit.findFirst({
            where: { branchId: x.branchId, visitDate: date },
            orderBy: { tokenNumber: "desc" },
          });
          const v = await tx.visit.create({
            data: {
              branchId: x.branchId,
              petId: x.petId,
              receptionistId: u.id,
              doctorId: x.doctorId || null,
              reason: x.reason || null,
              visitDate: date,
              tokenNumber: (last?.tokenNumber || 0) + 1,
            },
          });
          await tx.audit.create({
            data: {
              actorId: u.id,
              action: "RECEPTION_CHECKIN",
              entity: "Visit",
              entityId: v.id,
              details: { token: v.tokenNumber },
            },
          });
          return v;
        });
      } catch (e: any) {
        if (e.code === "P2002") continue;
        throw e;
      }
    }
    throw new HttpException("Could not allocate unique token; retry", 409);
  }
  @Patch("reception/visits/:id") async visitStatus(
    @Headers("authorization") a: string,
    @Param("id") id: string,
    @Body() x: any,
  ) {
    let u = await this.who(a, ["RECEPTION", "ADMIN"]);
    let v = await this.db.visit.findUnique({ where: { id } });
    if (!v) throw new HttpException("Visit not found", 404);
    await this.who(a, ["RECEPTION", "ADMIN"], v.branchId);
    const permitted: any = {
      WAITING: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["READY_CHECKOUT"],
      READY_CHECKOUT: ["CHECKED_OUT"],
    };
    if (!permitted[v.status]?.includes(x.status))
      throw new HttpException("Invalid visit transition", 409);
    if (x.status === "CHECKED_OUT")
      throw new HttpException(
        "Final unified checkout clearance not yet implemented; cannot bypass",
        409,
      );
    let r = await this.db.visit.update({
      where: { id },
      data: { status: x.status },
    });
    await this.log(u.id, "VISIT_STATUS", "Visit", id, {
      from: v.status,
      to: x.status,
    });
    return r;
  }
  @Get("reception/summary") async summary(@Headers("authorization") a: string) {
    let u = await this.who(a, ["RECEPTION", "ADMIN"]);
    const ids = u.branches.map((x) => x.branchId);
    let [appointments, visits, openInvoices] = await Promise.all([
      this.db.appointment.count({ where: { branchId: { in: ids } } }),
      this.db.visit.findMany({
        where: { branchId: { in: ids } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      this.db.invoice.count({
        where: { branchId: { in: ids }, status: { not: "PAID" } },
      }),
    ]);
    return {
      appointments,
      openInvoices,
      waiting: visits.filter((v) => v.status === "WAITING").length,
      inProgress: visits.filter((v) => v.status === "IN_PROGRESS").length,
      readyCheckout: visits.filter((v) => v.status === "READY_CHECKOUT").length,
      latest: visits.slice(0, 10),
    };
  }
}
