ALTER TABLE "public"."devices" ADD COLUMN "updatedAt" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_devices_updatedAt"
BEFORE UPDATE ON "public"."devices"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_devices_updatedAt" ON "public"."devices" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
