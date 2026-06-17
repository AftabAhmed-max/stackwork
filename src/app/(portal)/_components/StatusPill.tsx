/* ============================================
   STATUS PILL
   Plain, server-renderable status badge. The label
   text is from a fixed enum (never user free-text).
   ============================================ */
import type { ProjectStatus } from '@/lib/validation'

const LABELS: Record<ProjectStatus, string> = {
  ongoing: 'Ongoing',
  on_hold: 'On Hold',
  closed: 'Closed',
}

export default function StatusPill({ status }: { status: ProjectStatus }) {
  return <span className={`pill pill-${status}`}>{LABELS[status]}</span>
}
