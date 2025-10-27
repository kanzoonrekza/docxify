ALTER TABLE "organizationUserTable" DROP CONSTRAINT "organizationUserTable_organization_id_organizationTable_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizationUserTable" ADD CONSTRAINT "organizationUserTable_organization_id_organizationTable_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizationTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
