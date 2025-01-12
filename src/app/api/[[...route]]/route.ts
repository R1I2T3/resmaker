import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { resumesRoutes } from "@/server/features/resume/route";
import { auth } from "@/server/auth";
import { cors } from "hono/cors";
export const runtime = "edge";

export const app = new Hono();
app.use(
  "/api/auth/**",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.route("/api", resumesRoutes);

app.use("*", logger());
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "internal error" });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
