ALTER TABLE "templateTable" ADD COLUMN "organization_id" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templateTable" ADD CONSTRAINT "templateTable_organization_id_organizationTable_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizationTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
