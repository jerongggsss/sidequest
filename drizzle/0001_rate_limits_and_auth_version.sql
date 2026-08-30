CREATE TABLE IF NOT EXISTS "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"reset_at" timestamp NOT NULL
);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "auth_version" integer DEFAULT 1 NOT NULL;
ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;
