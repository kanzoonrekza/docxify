import { seedGuestUsers } from "./seeds/guestUsers";
import { seedRoles } from "./seeds/roles";

async function seed() {
  console.log("seeding");
  await seedRoles();
  await seedGuestUsers();
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
