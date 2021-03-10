alter table "public"."groups"
           add constraint "groups_locationId_fkey"
           foreign key ("locationId")
           references "public"."locations"
           ("id") on update restrict on delete set null;
