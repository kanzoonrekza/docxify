import { isNull } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const organizations = pgTable(
  "organizations",
  {
    id: serial().notNull().primaryKey().unique(),
    slug: varchar().notNull(),
    name: varchar().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (organizations) => [
    uniqueIndex().on(organizations.slug).where(isNull(organizations.deletedAt)),
  ]
);
