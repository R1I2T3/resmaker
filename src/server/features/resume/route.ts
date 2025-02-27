import { Hono } from "hono";
import { auth } from "../../auth";
import { zValidator } from "@hono/zod-validator";
import {
  createDocumentTableSchema,
  DocumentSchema,
  documentTable,
  updateCombinedSchema,
  UpdateDocumentSchema,
} from "@/server/db/schema/document";
import { db } from "@/server/db";
import { and, desc, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { Variables } from "@/app/api/[[...route]]/route";
import { personalInfoTable } from "@/server/db/schema";
import { experienceTable } from "@/server/db/schema";
import { educationTable } from "@/server/db/schema";
import { skillsTable } from "@/server/db/schema";
import { projectTable } from "@/server/db/schema";
export const resumesRoutes = new Hono<{ Variables: Variables }>()
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return c.json({ error: "unauthorized" }, { status: 401 });
    }
    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .post("/create", zValidator("json", createDocumentTableSchema), async (c) => {
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
  })
  .get("/all", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, { status: 401 });
    }
    const data = await db
      .select()
      .from(documentTable)
      .where(
        and(
          eq(documentTable.userId, user.id),
          ne(documentTable.userId, user.id)
        )
      )
      .orderBy(desc(documentTable.createdAt));
    return c.json({ success: true, data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
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
        projects: true,
      },
    });
    if (!data) {
      return c.json({ error: "not found" }, { status: 404 });
    }
    return c.json({ success: true, data });
  })
  .get(
    "/public/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await db.query.documentTable.findFirst({
        where: and(
          eq(documentTable.id, id),
          eq(documentTable.status, "public")
        ),
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
  )
  .put(
    "/update/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", updateCombinedSchema),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "unauthorized" }, { status: 401 });
      }
      const { id } = c.req.valid("param");
      const {
        title,
        status,
        summary,
        thumbnail,
        themeColor,
        currentPosition,
        personalInfo,
        experience,
        education,
        skills,
        projects,
      } = c.req.valid("json");
      const userId = c.get("user")?.id;
      if (!userId) {
        return c.json({ error: "unauthorized" }, { status: 401 });
      }
      await db.transaction(async (trx) => {
        const [existingDocument] = await trx
          .select()
          .from(documentTable)
          .where(
            and(eq(documentTable.id, id), eq(documentTable.userId, userId))
          );
        if (!existingDocument) {
          return c.json({ error: "not found" }, { status: 404 });
        }
        const resumeUpdate = {} as UpdateDocumentSchema;
        if (title) {
          resumeUpdate.title = title;
        }
        if (status) {
          resumeUpdate.status = status;
        }
        if (summary) {
          resumeUpdate.summary = summary;
        }
        if (thumbnail) {
          resumeUpdate.thumbnail = thumbnail;
        }
        if (themeColor) {
          resumeUpdate.themeColor = themeColor;
        }
        if (currentPosition) {
          resumeUpdate.currentPosition = currentPosition;
        }
        if (Object.keys(resumeUpdate).length > 0) {
          await trx
            .update(documentTable)
            .set(resumeUpdate)
            .where(eq(documentTable.id, id))
            .returning();
        }
        if (personalInfo) {
          if (!personalInfo.firstName && !personalInfo.lastName) return;
          const exists = await trx
            .select()
            .from(personalInfoTable)
            .where(eq(personalInfoTable.docId, existingDocument.id));
          if (exists.length > 0) {
            await trx
              .update(personalInfoTable)
              .set(personalInfo)
              .where(eq(personalInfoTable.docId, existingDocument.id));
          } else {
            await trx.insert(personalInfoTable).values({
              id: crypto.randomUUID(),
              docId: existingDocument.id,
              ...personalInfo,
            });
          }
        }
        if (experience && Array.isArray(experience)) {
          const existingExperiences = await trx
            .select()
            .from(experienceTable)
            .where(eq(experienceTable.docId, existingDocument.id));
          const existingExperienceMap = new Set(
            existingExperiences.map((exp) => exp.id)
          );
          for (const exp of experience) {
            const { id, ...data } = exp;
            if (id && existingExperienceMap.has(id)) {
              await trx
                .update(experienceTable)
                .set(data)
                .where(
                  and(
                    eq(experienceTable.docId, existingDocument.id),
                    eq(experienceTable.id, id)
                  )
                );
              existingExperienceMap.delete(id);
            } else {
              await trx.insert(experienceTable).values({
                id: crypto.randomUUID(),
                docId: existingDocument.id,
                ...data,
              });
            }
          }
        }
        if (education && Array.isArray(education)) {
          const existingEducations = await trx
            .select()
            .from(educationTable)
            .where(eq(educationTable.docId, existingDocument.id));
          const existingEducationMap = new Set(
            existingEducations.map((edu) => edu.id)
          );
          for (const edu of education) {
            const { id, ...data } = edu;
            if (id && existingEducationMap.has(id)) {
              await trx
                .update(educationTable)
                .set(data)
                .where(
                  and(
                    eq(educationTable.docId, existingDocument.id),
                    eq(educationTable.id, id)
                  )
                );
              existingEducationMap.delete(id);
            } else {
              await trx.insert(educationTable).values({
                id: crypto.randomUUID(),
                docId: existingDocument.id,
                ...data,
              });
            }
          }
        }
        if (skills && Array.isArray(skills)) {
          const existingSkills = await trx
            .select()
            .from(skillsTable)
            .where(eq(skillsTable.docId, existingDocument.id));
          const existingSkillsMap = new Set(
            existingSkills.map((skill) => skill.id)
          );
          for (const skill of skills) {
            const { id, ...data } = skill;
            if (id && existingSkillsMap.has(id)) {
              await trx
                .update(skillsTable)
                .set(data)
                .where(
                  and(
                    eq(skillsTable.docId, existingDocument.id),
                    eq(skillsTable.id, id)
                  )
                );
              existingSkillsMap.delete(id);
            } else {
              await trx.insert(skillsTable).values({
                id: crypto.randomUUID(),
                docId: existingDocument.id,
                ...data,
              });
            }
          }
        }
        if (projects && Array.isArray(projects)) {
          const existingProjects = await trx
            .select()
            .from(projectTable)
            .where(eq(projectTable.docId, existingDocument.id));
          const existingProjectsMap = new Set(
            existingProjects.map((project) => project.id)
          );
          for (const project of projects) {
            const { id, ...data } = project;
            if (id && existingProjectsMap.has(id)) {
              await trx
                .update(projectTable)
                .set(data)
                .where(
                  and(
                    eq(skillsTable.docId, existingDocument.id),
                    eq(skillsTable.id, id)
                  )
                );
              existingProjectsMap.delete(id);
            } else {
              await trx.insert(projectTable).values({
                id: crypto.randomUUID(),
                docId: existingDocument.id,
                ...data,
              });
            }
          }
        }
      });
      return c.json({ success: true, message: "Info Updated Successfully" });
    }
  )
  .put(
    "/restore/archive",
    zValidator("json", z.object({ id: z.string(), status: z.string() })),
    async (c) => {
      const { id, status } = c.req.valid("json");
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "unauthorized" }, { status: 401 });
      }
      if (!id) {
        return c.json({ message: "DocumentId must provided" }, 400);
      }
      if (status !== "archived") {
        return c.json(
          { message: "Status must be archived before restore" },
          400
        );
      }
      const [documentData] = await db
        .update(documentTable)
        .set({ status: "private" })
        .where(and(eq(documentTable.id, id), eq(documentTable.userId, user.id)))
        .returning();
      if (!documentData) {
        return c.json({ message: "Document not found" }, 404);
      }
      return c.json(
        { success: "oK", message: "Updated Successfully", data: documentData },
        { status: 200 }
      );
    }
  )
  .get("/trash/all", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, { status: 401 });
    }
    const userId = user.id;
    const documents = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.userId, userId));
    return c.json({
      success: true,
      data: documents,
    });
  })
  .put(
    "/restore/archive",
    zValidator(
      "json",
      z.object({ documentId: z.string(), status: z.string() })
    ),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "unauthorized" }, { status: 401 });
      }
      const { documentId, status } = c.req.valid("json");
      if (!documentId) {
        return c.json(
          { error: "Resume Not found" },
          {
            status: 404,
          }
        );
      }
      if (status !== "archived") {
        return c.json({ error: "Status must be archived before restore" }, 400);
      }

      const [documentData] = await db
        .update(documentTable)
        .set({
          status: "archived",
        })
        .where(
          and(
            eq(documentTable.id, documentId),
            eq(documentTable.userId, user.id)
          )
        )
        .returning();

      if (!documentData) {
        return c.json({ message: "Document not found" }, 404);
      }

      return c.json(
        {
          success: "ok",
          message: "Updated successfully",
          data: documentData,
        },
        { status: 200 }
      );
    }
  );
