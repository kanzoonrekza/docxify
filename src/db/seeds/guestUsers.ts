import { db } from "..";
import { users } from "../schema/users";

export async function seedGuestUsers() {
  await db
    .insert(users)
    .values({
      username: "guest",
      email: "guest@kocakhost.com",
    })
    .onConflictDoNothing();
  console.log("✅ Seed guest account completed");
}
