import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
  },
  verbose: true,
  strict: true,
});
