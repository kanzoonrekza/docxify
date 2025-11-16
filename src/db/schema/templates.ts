import { isNull } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { collections } from "./collections";

export const templates = pgTable(
  "templates",
  {
    id: serial().notNull().primaryKey().unique(),
    slug: varchar().notNull(),
    collectionId: integer("collection_id")
      .notNull()
      .references(() => collections.id),
    name: text().notNull(),
    description: text(),
    fileUrl: text("file_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (templates) => [
    uniqueIndex().on(templates.slug).where(isNull(templates.deletedAt)),
  ]
);

export const templatesApi = pgTable("templates_api", {
  id: serial().primaryKey().unique(),
  templateId: integer().references(() => templates.id),
  url: text().notNull(),
  param: text().array(),
  connectedTags: jsonb(),
});
