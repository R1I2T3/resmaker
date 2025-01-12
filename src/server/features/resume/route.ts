import { Hono } from "hono";
import { auth } from "../../auth";
import { User } from "better-auth";
type Variables = {
  user: User | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any | null;
};

export const resumesRoutes = new Hono<{ Variables: Variables }>().basePath(
  "/resumes"
);

resumesRoutes.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return c.json({ error: "unauthorized" }, { status: 401 });
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});
resumesRoutes.get("/", (c) => {
  return c.json({ message: "GET resumes" });
});
