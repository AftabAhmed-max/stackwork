-- ============================================================
--  STACKWORK CLIENT PORTAL — SUPABASE SETUP
--  Idempotent: safe to paste into the Supabase SQL editor and
--  run repeatedly. Creates tables, the profile trigger, the
--  private storage bucket, and ALL Row-Level Security policies.
--
--  Security model (database-enforced — the frontend is cosmetic):
--    * profiles.role is the ONLY source of truth for role.
--    * Clients can read ONLY their own project + documents, and
--      only while their profile.is_active = true.
--    * A client can NEVER read another client's data, even via a
--      crafted/raw API request — RLS filters every row.
--    * All writes are performed by trusted server code using the
--      service-role key (which bypasses RLS); the anon/authenticated
--      roles get SELECT only + admin policies.
-- ============================================================

-- gen_random_uuid() is available in Supabase by default.
create extension if not exists pgcrypto;

-- ============================================================
--  TABLES
-- ============================================================

-- profiles: one row per auth user. role + is_active live here.
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         text not null default 'client' check (role in ('admin', 'client')),
  display_name text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- projects: each owned by exactly one client (owner_id).
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  client_name text not null,
  owner_id    uuid not null references auth.users (id) on delete cascade,
  status      text not null default 'ongoing' check (status in ('ongoing', 'on_hold', 'closed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_owner_id_idx on public.projects (owner_id);

-- documents: metadata for files in the private storage bucket.
create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  stage_label  text not null check (stage_label in ('Proposal', 'Signed Agreement', 'Staging Link', 'Other')),
  file_name    text not null,            -- ORIGINAL name, display label only (never used as a path)
  storage_path text not null,            -- server-generated: <projectId>/<uuid>.<ext>
  mime_type    text,
  size_bytes   bigint,
  uploaded_at  timestamptz not null default now()
);
create index if not exists documents_project_id_idx on public.documents (project_id);

-- ============================================================
--  HELPER FUNCTIONS  (SECURITY DEFINER → avoid RLS recursion)
-- ============================================================

-- True if the current user is an admin. Reading profiles inside a
-- SECURITY DEFINER function bypasses RLS, preventing policy recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- True if the current user is a client whose access is active.
create or replace function public.is_active_client()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_active_client() to anon, authenticated;

-- ============================================================
--  PROFILE AUTO-CREATION TRIGGER
--  Every new auth user gets a profile row (role='client',
--  is_active=true). display_name is taken from user metadata,
--  which the admin sets when creating the client.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name, is_active)
  values (new.id, 'client', new.raw_user_meta_data ->> 'display_name', true)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep projects.updated_at fresh on any update.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ============================================================
--  GRANTS
--  RLS still filters every row; grants just allow the role to
--  attempt the operation. Writes go through the service-role
--  key (bypasses RLS) so authenticated gets SELECT only.
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.profiles  to authenticated;
grant select on public.projects  to authenticated;
grant select on public.documents to authenticated;

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles  enable row level security;
alter table public.projects  enable row level security;
alter table public.documents enable row level security;

-- ---------- profiles ----------
-- A user can read their OWN profile; an admin can read ALL profiles.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Only admins may UPDATE profiles (is_active / role / display_name).
-- (In practice the server uses the service-role key, but this policy
--  guarantees no client can flip their own is_active or role.)
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- projects ----------
-- Admin: full read. Client: read ONLY their own project, and only
-- while active. This is the core anti-IDOR rule for projects.
drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects
  for select to authenticated
  using (
    public.is_admin()
    or (owner_id = auth.uid() and public.is_active_client())
  );

-- Admin-only writes (insert / update / delete).
drop policy if exists projects_admin_insert on public.projects;
create policy projects_admin_insert on public.projects
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists projects_admin_update on public.projects;
create policy projects_admin_update on public.projects
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists projects_admin_delete on public.projects;
create policy projects_admin_delete on public.projects
  for delete to authenticated
  using (public.is_admin());

-- ---------- documents ----------
-- Admin: full read. Client: read ONLY documents belonging to a
-- project they own, and only while active. Core anti-IDOR rule
-- for documents.
drop policy if exists documents_select on public.documents;
create policy documents_select on public.documents
  for select to authenticated
  using (
    public.is_admin()
    or (
      public.is_active_client()
      and exists (
        select 1 from public.projects p
        where p.id = documents.project_id
          and p.owner_id = auth.uid()
      )
    )
  );

-- Admin-only writes.
drop policy if exists documents_admin_insert on public.documents;
create policy documents_admin_insert on public.documents
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists documents_admin_update on public.documents;
create policy documents_admin_update on public.documents
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists documents_admin_delete on public.documents;
create policy documents_admin_delete on public.documents
  for delete to authenticated
  using (public.is_admin());

-- ============================================================
--  PRIVATE STORAGE BUCKET + STORAGE RLS
-- ============================================================

-- Private bucket (public = false → no public URLs).
insert into storage.buckets (id, name, public)
values ('project-documents', 'project-documents', false)
on conflict (id) do update set public = false;

-- Download/sign: admin any object; client only objects under a
-- project they own AND while active. The project id is the first
-- path segment of the object name (<projectId>/<uuid>.<ext>).
drop policy if exists "project-docs client read" on storage.objects;
create policy "project-docs client read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'project-documents'
    and (
      public.is_admin()
      or (
        public.is_active_client()
        and exists (
          select 1 from public.projects p
          where p.id = (split_part(name, '/', 1))::uuid
            and p.owner_id = auth.uid()
        )
      )
    )
  );

-- Writes to storage: admin only (server normally uses service-role,
-- which bypasses RLS — this policy blocks everyone else).
drop policy if exists "project-docs admin write" on storage.objects;
create policy "project-docs admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'project-documents' and public.is_admin())
  with check (bucket_id = 'project-documents' and public.is_admin());

-- ============================================================
--  DONE. Now create your FIRST admin user — see
--  SUPABASE_INSTRUCTIONS.md (one manual, intentional step).
-- ============================================================
