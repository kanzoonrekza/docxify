import {
	boolean,
	integer,
	jsonb,
	pgTable,
	primaryKey,
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
	api_url: text("api_url"),
	api_param: text("api_param").array(),
	api_connected_tags: jsonb("api_connected_tags"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const users = pgTable("userTable", {
	username: text("username").notNull().primaryKey().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const organizations = pgTable("organizationTable", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  owner: text("owner").notNull().references(() => users.username),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const organizationUsers = pgTable("organizationUserTable", {
  userId: text("user_id").notNull().references(() => users.username),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  role: text("role").notNull().default('user'), // 'admin' or 'user'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey(t.userId, t.organizationId),
}));

