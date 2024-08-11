CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"access_token" text,
	"expired_in" integer,
	"refresh_token" text,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "merchants" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" text,
	"name" text,
	"avatar" text,
	"location" text,
	"plan" text,
	"status" text,
	"domain" text,
	"tax_number" integer,
	"commercial_number" integer,
	"created_at" text,
	"owner" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" integer,
	"sku" text,
	"mpn" text,
	"gtin" text,
	"type" text,
	"name" text,
	"description" text,
	"quantity" integer,
	"status" text,
	"is_available" boolean,
	"cost_price" numeric(2, 10),
	"price" numeric(2, 10),
	"regular_price" numeric(2, 10),
	"taxed_price" numeric(2, 10),
	"pre_tax_price" numeric(2, 10),
	"tax" numeric(2, 10),
	"weight" numeric,
	"weight_type" text DEFAULT 'g',
	" with_tax" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"mobile" text,
	"role" text,
	"created_at" text,
	"updated_at" text,
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "merchants" ADD CONSTRAINT "merchants_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
