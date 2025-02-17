import { pgTable } from "drizzle-orm/pg-core";
import { uuid, varchar, text, date } from "drizzle-orm/pg-core";
import { documentTable } from "./document";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
export const certificateTable = pgTable("certificates", {
  id: uuid("id").notNull().primaryKey(),
  docId: uuid("document_id")
    .notNull()
    .references(() => documentTable.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  date: date("date"),
});

export const certificationTableSchema = createInsertSchema(certificateTable, {
  id: z.string().optional(),
}).pick({
  id: true,
  title: true,
  description: true,
  date: true,
});

export type CertificateTableSchema = z.infer<typeof certificationTableSchema>;
