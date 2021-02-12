DROP TRIGGER IF EXISTS "set_public_devices_updatedAt" ON "public"."devices";
ALTER TABLE "public"."devices" DROP COLUMN "updatedAt";
