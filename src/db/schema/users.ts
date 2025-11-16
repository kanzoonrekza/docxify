import { isNull } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial().notNull().primaryKey().unique(),
    username: varchar().notNull(),
    email: varchar().notNull(),
    fullName: text(),
    referral: varchar(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow(),
    archivedAt: timestamp({ withTimezone: true }),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (users) => [uniqueIndex().on(users.username).where(isNull(users.deletedAt))]
);
