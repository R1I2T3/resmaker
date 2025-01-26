import { Hono } from "hono";
import { auth } from "../../auth";
import { zValidator } from "@hono/zod-validator";
import {
  createDocumentTableSchema,
  DocumentSchema,
  documentTable,
} from "@/server/db/schema/document";
import { db } from "@/server/db";
import { and, desc, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { Variables } from "@/app/api/[[...route]]/route";

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

resumesRoutes.post(
  "/create",
  zValidator("json", createDocumentTableSchema),
  async (c) => {
    const user = c.get("user");
    const { title } = c.req.valid("json") as DocumentSchema;
    if (!user) {
      return c.json({ error: "unauthorized" }, { status: 401 });
    }
    const newDoc = {
      id: crypto.randomUUID(),
      title: title,
      userId: user.id,
      authorName: user.name,
      authorEmail: user.email,
    };
    const [data] = await db.insert(documentTable).values(newDoc).returning();
    return c.json(
      {
        success: "ok",
        data,
      },
      { status: 200 }
    );
  }
);

resumesRoutes.get("/all", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "unauthorized" }, { status: 401 });
  }
  const data = await db
    .select()
    .from(documentTable)
    .where(
      and(eq(documentTable.userId, user.id), ne(documentTable.userId, user.id))
    )
    .orderBy(desc(documentTable.createdAt));
  return c.json({ success: true, data });
});

resumesRoutes.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, { status: 401 });
    }
    const { id } = c.req.valid("param");
    const data = await db.query.documentTable.findFirst({
      where: and(eq(documentTable.id, id), eq(documentTable.userId, user.id)),
      with: {
        personalInfo: true,
        experiences: true,
        educations: true,
        skills: true,
      },
    });
    if (!data) {
      return c.json({ error: "not found" }, { status: 404 });
    }
    return c.json({ success: true, data });
  }
);

resumesRoutes.get(
  "/public/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await db.query.documentTable.findFirst({
      where: and(eq(documentTable.id, id), eq(documentTable.status, "public")),
      with: {
        personalInfo: true,
        experiences: true,
        educations: true,
        skills: true,
      },
    });
    if (!data) {
      return c.json({ error: "not found" }, { status: 404 });
    }
    return c.json({ success: true, data });
  }
);

export type AppType = typeof resumesRoutes;
