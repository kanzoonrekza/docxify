import {
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { isNull } from "drizzle-orm";

export const collections = pgTable(
  "collections",
  {
    id: serial().notNull().primaryKey().unique(),
    slug: varchar().notNull(),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id),
    name: varchar().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (collections) => [
    uniqueIndex().on(collections.slug).where(isNull(collections.deletedAt)),
  ]
);
