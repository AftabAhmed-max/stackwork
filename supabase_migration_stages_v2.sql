-- ============================================================
--  MIGRATION v2 — reorder + rename documents.stage_label values
--  Run this ONCE in the Supabase SQL editor (idempotent: safe to
--  re-run). REQUIRED BEFORE testing — the renamed label
--  ('Wireframe Feedback Form' → 'Wireframe') and any new inserts
--  will otherwise fail the existing CHECK constraint.
--
--  ORDER MATTERS — drop → remap → add:
--    1. DROP the CHECK first so nothing blocks the remap.
--    2. REMAP the renamed label on existing rows.
--    3. ADD the CHECK back with the new 12-label set.
--  (Recreating the CHECK before remapping — the old bug — would
--   reject the still-old 'Wireframe Feedback Form' rows.)
--
--  Touches ONLY documents_stage_label_check. RLS, the file-XOR-link
--  CHECK, and every other constraint are untouched.
-- ============================================================

-- 1) Drop FIRST.
alter table public.documents
  drop constraint if exists documents_stage_label_check;

-- 2) Remap the renamed label (no-op if no such rows exist).
update public.documents
  set stage_label = 'Wireframe'
  where stage_label = 'Wireframe Feedback Form';

-- 3) Add the CHECK back, mirroring STAGE_LABELS in
--    src/lib/validation.ts (order is cosmetic in SQL; the set is
--    what's enforced).
alter table public.documents
  add constraint documents_stage_label_check
  check (stage_label = any (array[
    'Project Proposal',
    'Project Agreement',
    'Wireframe',
    'Change Order',
    'Client Intake Form',
    'Discovery Call Script',
    'Hourly Work Confirmation',
    'Project Handover Checklist',
    'Staging Link',
    'Invoice',
    'End of Service',
    'Other'
  ]::text[]));
