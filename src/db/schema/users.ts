import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().notNull().primaryKey().unique(),
  username: varchar().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
  archivedAt: timestamp({ withTimezone: true }),
});

export const userProfiles = pgTable("user_profiles", {
  userId: integer()
    .notNull()
    .primaryKey()
    .references(() => users.id),
  email: varchar().notNull().unique(),
  fullName: text(),
  referal: varchar(),
});
