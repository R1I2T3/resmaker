import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { personalInfoTable, personalInfoTableSchema } from "./personal-info";
import { experienceTable, experienceTableSchema } from "./experience";
import { educationTable, educationTableSchema } from "./education";
import { skillsTable, skillsTableSchema } from "./skills";
import { createInsertSchema } from "drizzle-zod";
import { projectTableSchema, projectTable } from "./project";
import { certificationTableSchema } from "./certificate";
import { z } from "zod";

export const statusEnum = pgEnum("status", ["archived", "private", "public"]);

export const documentTable = pgTable("document", {
  id: uuid("id").notNull().primaryKey(),
  userId: varchar("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  themeColor: varchar("theme_color", { length: 255 })
    .notNull()
    .default("#7c3aed"),
  thumbnail: text("thumbnail"),
  currentPosition: integer("current_position").notNull().default(1),
  status: statusEnum("status").notNull().default("private"),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const documentRelations = relations(documentTable, ({ one, many }) => {
  return {
    personalInfo: one(personalInfoTable),
    experiences: many(experienceTable),
    educations: many(educationTable),
    skills: many(skillsTable),
    projects: many(projectTable),
  };
});

export const createDocumentTableSchema = createInsertSchema(documentTable, {
  title: (schema) => schema.min(1),
  themeColor: (schema) => schema.optional(),
  thumbnail: (schema) => schema.optional(),
  currentPosition: (schema) => schema.optional(),
}).pick({
  title: true,
  status: true,
  summary: true,
  themeColor: true,
  thumbnail: true,
  currentPosition: true,
});

export const updateCombinedSchema = z.object({
  title: createDocumentTableSchema.shape.title.optional(),
  status: createDocumentTableSchema.shape.status.optional(),
  thumbnail: createDocumentTableSchema.shape.thumbnail.optional(),
  summary: createDocumentTableSchema.shape.summary.optional(),
  themeColor: createDocumentTableSchema.shape.themeColor.optional(),
  currentPosition: createDocumentTableSchema.shape.currentPosition.optional(),
  personalInfo: personalInfoTableSchema.optional(),
  education: z.array(educationTableSchema).optional(),
  experience: z.array(experienceTableSchema).optional(),
  skills: z.array(skillsTableSchema).optional(),
  projects: z.array(projectTableSchema).optional(),
  certificates: z.array(certificationTableSchema).optional(),
});

export type DocumentSchema = z.infer<typeof createDocumentTableSchema>;

export type UpdateDocumentSchema = z.infer<typeof updateCombinedSchema>;
