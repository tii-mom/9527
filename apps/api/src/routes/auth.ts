import type { FastifyInstance } from "fastify";
import { createUserAndDevice, requireUser } from "../services/auth.js";
import { fail, ok } from "../utils/http.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/v1/init", async (req: any) => ok(await createUserAndDevice(req.body || {})));

  app.get("/v1/me", async (req, reply) => {
    const user = await requireUser(req);
    if (!user) return fail(reply, 401, "UNAUTHORIZED", "Missing or invalid token");
    return ok({ id: user.id, email: user.email, status: user.status, createdAt: user.createdAt });
  });
}
