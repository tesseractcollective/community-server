ALTER TABLE "public"."devices" ADD COLUMN "createdAt" timestamptz NULL DEFAULT now();
