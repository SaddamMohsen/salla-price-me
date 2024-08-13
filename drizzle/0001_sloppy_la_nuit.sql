ALTER TABLE "user" ADD COLUMN "userid" integer;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_userid_unique" UNIQUE("userid");