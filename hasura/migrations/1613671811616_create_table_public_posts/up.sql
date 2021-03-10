CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."posts"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "groupId" uuid, "body" text NOT NULL, "photoUrl" text, PRIMARY KEY ("id") , FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE set null, FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON UPDATE restrict ON DELETE no action);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updatedAt"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updatedAt" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_posts_updatedAt"
BEFORE UPDATE ON "public"."posts"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_posts_updatedAt" ON "public"."posts" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
