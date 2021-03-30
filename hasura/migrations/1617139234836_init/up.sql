CREATE FUNCTION public."set_current_timestamp_updatedAt"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updatedAt" = NOW();
  RETURN _new;
END;
$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.device (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    token text NOT NULL,
    type text NOT NULL,
    "userId" uuid NOT NULL,
    name text,
    "updatedAt" timestamp with time zone DEFAULT now(),
    "createdAt" timestamp with time zone DEFAULT now()
);
CREATE TABLE public.file (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "fileType" text NOT NULL,
    "postId" uuid,
    "groupId" uuid,
    "userId" uuid,
    name text,
    "mimeType" text NOT NULL,
    "contentLength" integer DEFAULT 0 NOT NULL,
    "cloudFrontData" jsonb,
    domain text NOT NULL
);
CREATE TABLE public."fileType" (
    type text NOT NULL
);
CREATE TABLE public."group" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "locationId" uuid,
    "isPrivate" boolean DEFAULT false NOT NULL
);
CREATE TABLE public.location (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    city text,
    state text,
    country text NOT NULL,
    "countryCode" text NOT NULL,
    "formattedAddress" text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "addressForLanguage" jsonb DEFAULT jsonb_build_object() NOT NULL
);
CREATE TABLE public.post (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "userId" uuid,
    "groupId" uuid,
    body text NOT NULL
);
CREATE TABLE public.reaction (
    name text NOT NULL
);
CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    email text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    role text DEFAULT 'user'::text NOT NULL
);
CREATE TABLE public."userGroup" (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "userId" uuid NOT NULL,
    "groupId" uuid NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "isFounder" boolean DEFAULT false NOT NULL
);
CREATE TABLE public."userPostReaction" (
    "userId" uuid NOT NULL,
    "postId" uuid NOT NULL,
    reaction text NOT NULL
);
ALTER TABLE ONLY public."fileType"
    ADD CONSTRAINT "assetTypes_pkey" PRIMARY KEY (type);
ALTER TABLE ONLY public.file
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.device
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.device
    ADD CONSTRAINT devices_token_key UNIQUE (token);
ALTER TABLE ONLY public."group"
    ADD CONSTRAINT groups_name_key UNIQUE (name);
ALTER TABLE ONLY public."group"
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.location
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.post
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reaction
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public."userGroup"
    ADD CONSTRAINT "userGroup_pkey" PRIMARY KEY ("userId", "groupId");
ALTER TABLE ONLY public."userPostReaction"
    ADD CONSTRAINT "userPostReactions_pkey" PRIMARY KEY ("userId", "postId");
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_assets_updated_at BEFORE UPDATE ON public.file FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_assets_updated_at ON public.file IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER "set_public_devices_updatedAt" BEFORE UPDATE ON public.device FOR EACH ROW EXECUTE FUNCTION public."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_devices_updatedAt" ON public.device IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE TRIGGER "set_public_groups_updatedAt" BEFORE UPDATE ON public."group" FOR EACH ROW EXECUTE FUNCTION public."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_groups_updatedAt" ON public."group" IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE TRIGGER "set_public_locations_updatedAt" BEFORE UPDATE ON public.location FOR EACH ROW EXECUTE FUNCTION public."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_locations_updatedAt" ON public.location IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE TRIGGER "set_public_posts_updatedAt" BEFORE UPDATE ON public.post FOR EACH ROW EXECUTE FUNCTION public."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_posts_updatedAt" ON public.post IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE TRIGGER "set_public_userGroups_updatedAt" BEFORE UPDATE ON public."userGroup" FOR EACH ROW EXECUTE FUNCTION public."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_userGroups_updatedAt" ON public."userGroup" IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE TRIGGER "set_public_users_updatedAt" BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_users_updatedAt" ON public."user" IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
ALTER TABLE ONLY public.device
    ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.file
    ADD CONSTRAINT "file_fileType_fkey" FOREIGN KEY ("fileType") REFERENCES public."fileType"(type) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.file
    ADD CONSTRAINT "files_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.file
    ADD CONSTRAINT "files_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.post(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.file
    ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."group"
    ADD CONSTRAINT "groups_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES public.location(id) ON UPDATE RESTRICT ON DELETE SET NULL;
ALTER TABLE ONLY public.post
    ADD CONSTRAINT "posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON UPDATE RESTRICT;
ALTER TABLE ONLY public.post
    ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE SET NULL;
ALTER TABLE ONLY public."userGroup"
    ADD CONSTRAINT "userGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public."userGroup"
    ADD CONSTRAINT "userGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public."userPostReaction"
    ADD CONSTRAINT "userPostReactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.post(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."userPostReaction"
    ADD CONSTRAINT "userPostReactions_reaction_fkey" FOREIGN KEY (reaction) REFERENCES public.reaction(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public."userPostReaction"
    ADD CONSTRAINT "userPostReactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
