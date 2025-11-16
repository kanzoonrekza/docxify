import { integer, pgTable, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { roles } from "./roles";
import { users } from "./users";
import { isNull } from "drizzle-orm";

export const organizationUsers = pgTable(
  "organization_users",
  {
    userId: integer()
      .notNull()
      .references(() => users.id),
    organizationId: integer()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    roleId: integer()
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    archivedAt: timestamp({ withTimezone: true }),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (organizationUsers) => [
    uniqueIndex()
      .on(organizationUsers.userId, organizationUsers.organizationId)
      .where(isNull(organizationUsers.deletedAt)),
  ]
);
