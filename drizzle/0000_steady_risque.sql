CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId"),
	CONSTRAINT "account_providerAccountId_unique" UNIQUE("providerAccountId")
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
	"owner" text
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
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"mobile" text,
	"role" text,
	"created_at" timestamp,
	"merchant" jsonb,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_mobile_unique" UNIQUE("mobile")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "merchants" ADD CONSTRAINT "merchants_owner_account_providerAccountId_fk" FOREIGN KEY ("owner") REFERENCES "public"."account"("providerAccountId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
