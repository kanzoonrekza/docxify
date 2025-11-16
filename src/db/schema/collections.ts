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
    organizationId: integer()
      .notNull()
      .references(() => organizations.id),
    name: varchar().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow(),
    archivedAt: timestamp({ withTimezone: true }),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (collections) => [
    uniqueIndex().on(collections.slug).where(isNull(collections.deletedAt)),
  ]
);
