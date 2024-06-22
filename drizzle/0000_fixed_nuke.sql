CREATE TABLE IF NOT EXISTS "templateTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"api_ready" boolean DEFAULT false NOT NULL,
	"tags" jsonb NOT NULL,
	"api" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
