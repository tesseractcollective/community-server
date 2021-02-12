CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."devices"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "token" text NOT NULL, "type" text NOT NULL, "userId" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE cascade);
