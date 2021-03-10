ALTER TABLE "public"."locations" ADD COLUMN "longitude" float8;
ALTER TABLE "public"."locations" ALTER COLUMN "longitude" DROP NOT NULL;
