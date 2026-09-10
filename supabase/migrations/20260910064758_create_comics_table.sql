create type "public"."comic_format" as enum ('single_issue', 'tpb');


  create table "public"."comics" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "issue_number" text,
    "format" public.comic_format not null default 'single_issue'::public.comic_format,
    "publisher" text not null,
    "genre" text,
    "main_character" text,
    "author" text,
    "penciler" text,
    "inker" text,
    "letterer" text,
    "condition" text,
    "notes" text,
    "cover_img_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."comics" enable row level security;

CREATE UNIQUE INDEX comics_pkey ON public.comics USING btree (id);

alter table "public"."comics" add constraint "comics_pkey" PRIMARY KEY using index "comics_pkey";

alter table "public"."comics" add constraint "comics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."comics" validate constraint "comics_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    new.updated_at = now();
    return new;
end;
$function$
;

grant delete on table "public"."comics" to "anon";

grant insert on table "public"."comics" to "anon";

grant references on table "public"."comics" to "anon";

grant select on table "public"."comics" to "anon";

grant trigger on table "public"."comics" to "anon";

grant truncate on table "public"."comics" to "anon";

grant update on table "public"."comics" to "anon";

grant delete on table "public"."comics" to "authenticated";

grant insert on table "public"."comics" to "authenticated";

grant references on table "public"."comics" to "authenticated";

grant select on table "public"."comics" to "authenticated";

grant trigger on table "public"."comics" to "authenticated";

grant truncate on table "public"."comics" to "authenticated";

grant update on table "public"."comics" to "authenticated";

grant delete on table "public"."comics" to "service_role";

grant insert on table "public"."comics" to "service_role";

grant references on table "public"."comics" to "service_role";

grant select on table "public"."comics" to "service_role";

grant trigger on table "public"."comics" to "service_role";

grant truncate on table "public"."comics" to "service_role";

grant update on table "public"."comics" to "service_role";


  create policy "Users can delete from own collection"
  on "public"."comics"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert comics into own collection"
  on "public"."comics"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own collection"
  on "public"."comics"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own collection"
  on "public"."comics"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER on_comics_updated BEFORE UPDATE ON public.comics FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


