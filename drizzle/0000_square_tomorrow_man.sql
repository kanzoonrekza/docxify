CREATE TABLE IF NOT EXISTS "templateTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"api_ready" boolean DEFAULT false NOT NULL,
	"created_at" text,
	"updated_at" text
);
