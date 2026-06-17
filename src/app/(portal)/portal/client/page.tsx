/* ============================================
   /portal/client — read-only client view
   Server-guarded (requireClient). Shows ONLY the
   signed-in client's own project: status + documents
   grouped by stage, each with a download button. No
   edit / upload / delete affordances exist here, and
   the database RLS would refuse such writes anyway.

   Inactive clients authenticate but see a designed
   "access inactive" state with ZERO data fetched.
   ============================================ */
import { Lock, FolderOpen } from 'lucide-react'
import { requireClient } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { STAGE_LABELS, type ProjectStatus, type StageLabel } from '@/lib/validation'
import PortalHeader from '../../_components/PortalHeader'
import StatusPill from '../../_components/StatusPill'
import ClientDocTimeline from './_components/ClientDocTimeline'

export const dynamic = 'force-dynamic'

type Project = {
  id: string
  name: string
  client_name: string
  status: ProjectStatus
}

type DocRow = {
  id: string
  stage_label: StageLabel
  file_name: string
  mime_type: string | null
  size_bytes: number | null
  link_url: string | null
}

const STATUS_BLURB: Record<ProjectStatus, string> = {
  ongoing: 'Your project is actively in progress.',
  on_hold: 'Your project is currently on hold.',
  closed: 'This project has been completed and closed.',
}

export default async function ClientView() {
  const ctx = await requireClient()

  /* ---- Locked / inactive state — fetch NOTHING ---- */
  if (!ctx.profile.is_active) {
    return (
      <main className="portal-shell">
        <PortalHeader subtitle="Client portal" />
        <section className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '56px 28px', textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 20px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: 16,
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.3)',
                color: 'var(--color-gold)',
              }}
            >
              <Lock size={28} />
            </div>
            <h1 style={{ fontSize: 24, marginBottom: 10 }}>Portal access inactive</h1>
            <p className="muted" style={{ maxWidth: 420, margin: '0 auto', lineHeight: 1.55 }}>
              Your portal access is currently inactive. Please contact Stackwork to
              restore access to your project and documents.
            </p>
          </div>
        </section>
      </main>
    )
  }

  /* ---- Active client — RLS returns only their own project ---- */
  const supabase = await createClient()
  const { data: projectData } = await supabase
    .from('projects')
    .select('id, name, client_name, status')
    .order('created_at', { ascending: false })
    .limit(1)

  const project = (projectData?.[0] ?? null) as Project | null

  if (!project) {
    return (
      <main className="portal-shell">
        <PortalHeader subtitle="Client portal" />
        <section className="portal-card" style={{ padding: 24 }}>
          <div className="empty-state">
            <div className="icon">
              <FolderOpen size={26} />
            </div>
            <p style={{ fontWeight: 600, color: '#cfd6e6' }}>No project assigned yet</p>
            <p style={{ fontSize: 13.5, marginTop: 4 }}>
              Your project will appear here once Stackwork sets it up.
            </p>
          </div>
        </section>
      </main>
    )
  }

  const { data: docs } = await supabase
    .from('documents')
    .select('id, stage_label, file_name, mime_type, size_bytes, link_url')
    .eq('project_id', project.id)
    .order('uploaded_at', { ascending: false })

  const documents = (docs ?? []) as DocRow[]
  // Group by stage in STAGE_LABELS order, drop empty stages, and map
  // to the serializable shape the (client) timeline expects.
  const grouped = STAGE_LABELS.map((stage) => ({
    stage,
    items: documents
      .filter((d) => d.stage_label === stage)
      .map((d) => ({
        id: d.id,
        fileName: d.file_name,
        mimeType: d.mime_type,
        sizeBytes: d.size_bytes,
        linkUrl: d.link_url,
      })),
  })).filter((g) => g.items.length > 0)

  return (
    <main className="portal-shell">
      <PortalHeader subtitle={`Welcome${ctx.profile.display_name ? `, ${ctx.profile.display_name}` : ''}`} />

      {/* Status hero */}
      <section className="portal-card" style={{ padding: 28, marginBottom: 22 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Your project
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <h1 style={{ fontSize: 28, lineHeight: 1.15 }}>{project.name}</h1>
          <StatusPill status={project.status} />
        </div>
        <p className="muted" style={{ marginTop: 12, fontSize: 14.5 }}>
          {STATUS_BLURB[project.status]}
        </p>
      </section>

      {/* Project journey timeline */}
      <section className="portal-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>Project journey</h2>
        <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
          Your project from proposal to handover. Documents appear as each
          stage is reached.
        </p>
        <ClientDocTimeline groups={grouped} />
      </section>
    </main>
  )
}
