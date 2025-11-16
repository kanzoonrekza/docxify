import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: serial().notNull().primaryKey().unique(),
  name: varchar().notNull().unique(),
  description: text(),
});
