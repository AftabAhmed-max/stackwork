-- ============================================================
--  MIGRATION — expand documents.stage_label allowed values
--  Run this ONCE in the Supabase SQL editor (idempotent: safe to
--  re-run). REQUIRED BEFORE testing the new stages — inserting any
--  of the new labels will otherwise fail the old CHECK constraint.
--
--  ORDER MATTERS — drop → remap → add:
--    1. DROP the existing CHECK first so nothing blocks the remap.
--    2. REMAP old rows to the new labels.
--    3. ADD the CHECK back with the new set.
--  (The earlier version recreated/kept the CHECK before remapping,
--   which rejected the about-to-be-remapped rows — fixed here.)
--
--  This ONLY touches the stage_label CHECK constraint. It does not
--  alter RLS, the file-XOR-link CHECK, or any other constraint.
--
--  NOTE: superseded by supabase_migration_stages_v2.sql (which
--  renames 'Wireframe Feedback Form' → 'Wireframe' and reorders).
--  Kept correct so a fresh setup applying migrations in order won't
--  hit the old constraint-violation bug.
-- ============================================================

-- 1) Drop FIRST so the remap below can't violate the old CHECK.
alter table public.documents
  drop constraint if exists documents_stage_label_check;

-- 2) Migrate any pre-existing rows that used the OLD labels so they
--    satisfy the new CHECK. (No-ops if those rows don't exist.)
--    'Other' and 'Staging Link' are unchanged (still valid).
update public.documents set stage_label = 'Project Proposal'  where stage_label = 'Proposal';
update public.documents set stage_label = 'Project Agreement' where stage_label = 'Signed Agreement';

-- 3) Recreate the CHECK with the full set of allowed labels.
alter table public.documents
  add constraint documents_stage_label_check
  check (stage_label in (
    'Project Proposal',
    'Project Agreement',
    'Change Order',
    'Wireframe Feedback Form',
    'Client Intake Form',
    'Invoice',
    'Hourly Work Confirmation',
    'Project Handover Checklist',
    'Discovery Call Script',
    'Staging Link',
    'End of Service',
    'Other'
  ));
