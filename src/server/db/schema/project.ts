import { pgTable, uuid, varchar, text, date } from "drizzle-orm/pg-core";
import { documentTable } from "./document";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const projectTable = pgTable("projects", {
  id: uuid("id").notNull().primaryKey(),
  docId: uuid("document_id")
    .notNull()
    .references(() => documentTable.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  techUsed: text("tech_used"),
});

export const projectTableSchema = createInsertSchema(projectTable, {
  id: z.string().optional(),
}).pick({
  id: true,
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  techUsed: true,
});

export type ProjectTableSchema = z.infer<typeof projectTableSchema>;
