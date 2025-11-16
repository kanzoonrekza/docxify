import { integer, pgTable, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { roles } from "./roles";
import { users } from "./users";
import { isNull } from "drizzle-orm";

export const organizationUsers = pgTable(
  "organization_users",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (organizationUsers) => [
    uniqueIndex()
      .on(organizationUsers.userId, organizationUsers.organizationId)
      .where(isNull(organizationUsers.deletedAt)),
  ]
);
