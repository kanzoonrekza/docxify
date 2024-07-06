ALTER TABLE "templateTable" ADD COLUMN "api_url" text;--> statement-breakpoint
ALTER TABLE "templateTable" ADD COLUMN "api_param" text[];--> statement-breakpoint
ALTER TABLE "templateTable" ADD COLUMN "api_connected_tags" jsonb;--> statement-breakpoint
ALTER TABLE "templateTable" DROP COLUMN IF EXISTS "api";