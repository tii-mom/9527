import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../db/prisma.js";
import { fail, ok } from "../utils/http.js";

function isAdmin(req: FastifyRequest) {
  return req.headers.authorization === `Bearer ${process.env.ADMIN_TOKEN || "dev-admin-token"}`;
}

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (req, reply) => {
    if (req.url.startsWith("/admin") && !isAdmin(req)) return fail(reply, 401, "UNAUTHORIZED", "Admin token required");
  });

  app.get("/admin/campaigns", async () => ok({ items: await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }) }));
  app.post("/admin/campaigns", async (req: any) => ok(await prisma.campaign.create({ data: { id: `camp_${randomUUID()}`, ...req.body } })));
  app.patch("/admin/campaigns/:id", async (req: any) => ok(await prisma.campaign.update({ where: { id: req.params.id }, data: req.body })));
  app.post("/admin/campaigns/:id/pause", async (req: any) => ok(await prisma.campaign.update({ where: { id: req.params.id }, data: { status: "paused" } })));

  app.get("/admin/shop/items", async () => ok({ items: await prisma.shopItem.findMany({ orderBy: { createdAt: "desc" } }) }));
  app.post("/admin/shop/items", async (req: any) => ok(await prisma.shopItem.create({ data: { id: `item_${randomUUID()}`, ...req.body } })));
  app.patch("/admin/shop/items/:id", async (req: any) => ok(await prisma.shopItem.update({ where: { id: req.params.id }, data: req.body })));

  app.get("/admin/redemptions", async () => ok({ items: await prisma.redemptionOrder.findMany({ include: { item: true, user: true }, orderBy: { createdAt: "desc" } }) }));
  app.patch("/admin/redemptions/:id", async (req: any) => ok(await prisma.redemptionOrder.update({ where: { id: req.params.id }, data: req.body })));
  app.post("/admin/redemptions/:id/approve", async (req: any) => ok(await prisma.redemptionOrder.update({ where: { id: req.params.id }, data: { status: "approved", riskStatus: "approved", completedAt: new Date() } })));
  app.post("/admin/redemptions/:id/reject", async (req: any) => ok(await prisma.redemptionOrder.update({ where: { id: req.params.id }, data: { status: "rejected", riskStatus: "rejected" } })));

  app.get("/admin/users", async () => ok({ items: await prisma.user.findMany({ include: { account: true }, orderBy: { createdAt: "desc" } }) }));
  app.get("/admin/ledger", async () => ok({ items: await prisma.pointLedger.findMany({ orderBy: { createdAt: "desc" } }) }));
}
