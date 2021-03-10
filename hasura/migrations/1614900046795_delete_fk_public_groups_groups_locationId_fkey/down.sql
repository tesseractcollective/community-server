alter table "public"."groups" add foreign key ("locationId") references "public"."locations"("id") on update restrict on delete set null;
