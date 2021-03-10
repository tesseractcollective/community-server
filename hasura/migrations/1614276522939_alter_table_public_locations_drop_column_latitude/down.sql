ALTER TABLE "public"."locations" ADD COLUMN "latitude" float8;
ALTER TABLE "public"."locations" ALTER COLUMN "latitude" DROP NOT NULL;
