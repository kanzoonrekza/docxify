import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: serial().notNull().primaryKey().unique(),
  name: text().notNull().unique(),
  description: text(),
});
