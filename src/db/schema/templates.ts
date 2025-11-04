import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const templates = pgTable("templates", {
  id: uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  title: text().notNull(),
  description: text(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
