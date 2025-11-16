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
    collectionId: integer()
      .notNull()
      .references(() => collections.id),
    name: text().notNull(),
    description: text(),
    fileUrl: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow(),
    archivedAt: timestamp({ withTimezone: true }),
    deletedAt: timestamp({ withTimezone: true }),
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
