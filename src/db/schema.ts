import { boolean, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const templates = pgTable('templateTable', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  apiReady: boolean('api_ready').default(false).notNull(),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
});