import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { resumesRoutes } from "@/server/features/resume/route";
import { auth } from "@/server/auth";
import { cors } from "hono/cors";
import { User } from "better-auth";
export type Variables = {
  user: User | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any | null;
};
const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.use(
  "/auth/**",
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
app.on(["POST", "GET"], "/auth/**", (c) => {
  return auth.handler(c.req.raw);
});
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "internal error" });
});
const handler = handle(app);

export async function GET(req: Request) {
  return handler(req);
}
export async function POST(req: Request) {
  return handler(req);
}
export async function PUT(req: Request) {
  return handler(req);
}
export async function DELETE(req: Request) {
  return handler(req);
}
export async function PATCH(req: Request) {
  return handler(req);
}

export const runtime = "edge";
