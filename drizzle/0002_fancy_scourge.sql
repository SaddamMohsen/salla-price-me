ALTER TABLE "merchants" DROP CONSTRAINT "merchants_owner_account_providerAccountId_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "merchants" ADD CONSTRAINT "merchants_owner_account_providerAccountId_fk" FOREIGN KEY ("owner") REFERENCES "public"."account"("providerAccountId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
