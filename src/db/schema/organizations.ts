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
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow(),
    archivedAt: timestamp({ withTimezone: true }),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (organizations) => [
    uniqueIndex().on(organizations.slug).where(isNull(organizations.deletedAt)),
  ]
);
