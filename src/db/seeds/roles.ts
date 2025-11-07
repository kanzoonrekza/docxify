import { db } from "..";
import { roles } from "../schema/roles";

export async function seedRoles() {
  await db
    .insert(roles)
    .values([
      {
        id: 1,
        name: "Owner",
        description:
          "Full authority including billing and organization deletion",
      },
      {
        id: 2,
        name: "Admin",
        description:
          "Full access to collections, templates, and member management",
      },
      {
        id: 3,
        name: "Editor",
        description:
          "Full access to templates with admin confirmation for deletion",
      },
      { id: 4, name: "Viewer", description: "View and use templates" },
    ])
    .onConflictDoNothing();
  console.log("✅ Seed roles completed");
}
