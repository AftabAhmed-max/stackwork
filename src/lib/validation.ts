/* ============================================
   SERVER-SIDE INPUT VALIDATION + CONSTANTS
   Single source of truth for the enums and limits
   enforced on the server. The frontend may mirror
   these for UX, but the server NEVER trusts the
   client — every action re-validates here.
   ============================================ */

/* ---- Status enum (mirrors the DB CHECK constraint) ---- */
export const PROJECT_STATUSES = ['ongoing', 'on_hold', 'closed'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export function isProjectStatus(v: unknown): v is ProjectStatus {
  return typeof v === 'string' && (PROJECT_STATUSES as readonly string[]).includes(v)
}

/* ---- Document stage labels (mirrors the DB CHECK) ---- */
// NOTE: this array is the single source of truth for the allowed
// stage labels AND their display order. The DB CHECK constraint on
// documents.stage_label must be kept in sync — see
// supabase_migration_stages.sql. 'Staging Link' is the special URL
// type; every other label is an uploaded file.
export const STAGE_LABELS = [
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
  'Other',
] as const
export type StageLabel = (typeof STAGE_LABELS)[number]

export function isStageLabel(v: unknown): v is StageLabel {
  return typeof v === 'string' && (STAGE_LABELS as readonly string[]).includes(v)
}

/* ---- File upload allowlist ---- */
// Map of allowed MIME types -> human label. The real MIME type
// reported by the upload is checked against THIS allowlist on the
// server; the original filename is never trusted for type.
export const ALLOWED_MIME_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

export function isAllowedMime(mime: unknown): mime is string {
  return typeof mime === 'string' && Object.prototype.hasOwnProperty.call(ALLOWED_MIME_TYPES, mime)
}

export const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB

/* ---- Field validators ---- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8
export const MAX_TEXT_LENGTH = 200

export function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && v.length <= 254 && EMAIL_RE.test(v)
}

export function isValidPassword(v: unknown): v is string {
  return typeof v === 'string' && v.length >= MIN_PASSWORD_LENGTH && v.length <= 200
}

/**
 * Trim and bound a required free-text field. Returns the cleaned
 * string, or null if it is empty / not a string / too long.
 * The value is stored and later rendered as PLAIN TEXT via React's
 * default escaping — never as HTML — so no markup sanitisation is
 * required, but we still bound the length.
 */
export function cleanRequiredText(v: unknown, maxLen = MAX_TEXT_LENGTH): string | null {
  if (typeof v !== 'string') return null
  const trimmed = v.trim()
  if (trimmed.length === 0 || trimmed.length > maxLen) return null
  return trimmed
}

/** Validate a value is a UUID (used for path/id params). */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export function isUuid(v: unknown): v is string {
  return typeof v === 'string' && UUID_RE.test(v)
}

/* ---- Staging Link URL validation ---- */
export const MAX_URL_LENGTH = 500

/**
 * A well-formed http(s) URL, bounded to 500 chars. Used for the
 * "Staging Link" document type (a URL, not an uploaded file).
 * Only http/https schemes are accepted — no javascript:, data:, etc.
 */
export function isValidHttpUrl(v: unknown): v is string {
  if (typeof v !== 'string' || v.length === 0 || v.length > MAX_URL_LENGTH) return false
  let parsed: URL
  try {
    parsed = new URL(v)
  } catch {
    return false
  }
  return parsed.protocol === 'http:' || parsed.protocol === 'https:'
}

/** Friendly display label for a staging link (its hostname). */
export function hostnameLabel(url: string): string {
  try {
    return new URL(url).hostname || 'Staging Link'
  } catch {
    return 'Staging Link'
  }
}
