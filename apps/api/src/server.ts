import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth.js";
import { campaignRoutes } from "./routes/campaigns.js";
import { adSessionRoutes } from "./routes/ad-sessions.js";
import { pointRoutes } from "./routes/points.js";
import { shopRoutes } from "./routes/shop.js";
import { adminRoutes } from "./routes/admin.js";

export async function buildServer() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(authRoutes);
  await app.register(campaignRoutes);
  await app.register(adSessionRoutes);
  await app.register(pointRoutes);
  await app.register(shopRoutes);
  await app.register(adminRoutes);
  return app;
}

if (process.env.NODE_ENV !== "test") {
  const app = await buildServer();
  const port = Number(process.env.PORT || 3000);
  await app.listen({ port, host: "0.0.0.0" });
}
