CREATE TABLE IF NOT EXISTS "organizationUserTable" (
	"user_id" text NOT NULL,
	"organization_id" integer NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizationUserTable_user_id_organization_id_pk" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizationTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userTable" (
	"username" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "userTable_username_unique" UNIQUE("username"),
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizationUserTable" ADD CONSTRAINT "organizationUserTable_user_id_userTable_username_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userTable"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizationUserTable" ADD CONSTRAINT "organizationUserTable_organization_id_organizationTable_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizationTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizationTable" ADD CONSTRAINT "organizationTable_owner_userTable_username_fk" FOREIGN KEY ("owner") REFERENCES "public"."userTable"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
