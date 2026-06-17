-- ============================================================
--  MIGRATION — "Staging Link" documents become URLs, not files
--  Run this ONCE in the Supabase SQL editor (idempotent: safe to
--  re-run). Required BEFORE testing the Staging Link feature.
--
--  A `documents` row is now EITHER a file OR a link:
--    * FILE  → storage_path set,  link_url null
--    * LINK  → link_url set,       storage_path null
--
--  RLS: no policy change is needed. The existing
--  `documents_select` / admin-write policies operate per-ROW, so
--  the new `link_url` column is automatically covered by them.
--  (The storage.objects policies are unaffected — link rows have
--  no storage object at all.)
-- ============================================================

-- 1) New nullable column for the URL.
alter table public.documents
  add column if not exists link_url text;

-- 2) storage_path must become nullable (link rows have no file).
alter table public.documents
  alter column storage_path drop not null;

-- 3) Enforce the file-XOR-link invariant. Existing rows are files
--    (storage_path set, link_url null) and already satisfy it.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'documents_file_xor_link'
  ) then
    alter table public.documents
      add constraint documents_file_xor_link
      check (
        (storage_path is not null and link_url is null)
        or (storage_path is null and link_url is not null)
      );
  end if;
end $$;

comment on column public.documents.link_url is
  'Set ONLY for Staging Link rows (a URL). Mutually exclusive with storage_path (see documents_file_xor_link).';
