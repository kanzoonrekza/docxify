import {
	boolean,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const templates = pgTable("templateTable", {
	id: serial("id").primaryKey(),
	fileUrl: text("file_url").notNull().default(""),
	title: text("title").notNull(),
	description: text("description"),
	category: text("category").notNull(),
	apiReady: boolean("api_ready").default(false).notNull(),
	tags: jsonb("tags").notNull(),
	api: jsonb("api"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
