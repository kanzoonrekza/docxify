import { isNull } from "drizzle-orm";
import {
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
    fullName: text("full_name"),
    referral: varchar(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (users) => [uniqueIndex().on(users.username).where(isNull(users.deletedAt))]
);
