import { seedRoles } from "./seeds/roles";

async function seed() {
  console.log("seeding");
  await seedRoles();
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
