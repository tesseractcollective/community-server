CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."userGroups"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "groupId" uuid NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "isFounder" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE cascade, FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON UPDATE restrict ON DELETE cascade);
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
CREATE TRIGGER "set_public_userGroups_updatedAt"
BEFORE UPDATE ON "public"."userGroups"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_userGroups_updatedAt" ON "public"."userGroups" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
