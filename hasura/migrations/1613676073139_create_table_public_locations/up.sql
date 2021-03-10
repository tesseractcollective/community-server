CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."locations"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "latitude" float8 NOT NULL, "longitude" float8 NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_locations_updatedAt"
BEFORE UPDATE ON "public"."locations"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_locations_updatedAt" ON "public"."locations" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
