/* ============================================
   /portal/admin/[projectId] — project detail (admin)
   Server-guarded (requireAdmin). Lets the admin change
   status, explicitly toggle the client's access, and
   upload / list / delete documents grouped by stage.
   ============================================ */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { isUuid, STAGE_LABELS, type ProjectStatus, type StageLabel } from '@/lib/validation'
import PortalHeader from '../../../_components/PortalHeader'
import StatusControl from './_components/StatusControl'
import ActiveToggle from './_components/ActiveToggle'
import DocumentUpload from './_components/DocumentUpload'
import DocumentRow from '../../../_components/DocumentRow'

export const dynamic = 'force-dynamic'

type Project = {
  id: string
  name: string
  client_name: string
  status: ProjectStatus
  owner_id: string
}

type DocRow = {
  id: string
  stage_label: StageLabel
  file_name: string
  mime_type: string | null
  size_bytes: number | null
  link_url: string | null
  uploaded_at: string
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  await requireAdmin()

  const { projectId } = await params
  if (!isUuid(projectId)) notFound()

  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, client_name, status, owner_id')
    .eq('id', projectId)
    .single()

  if (!project) notFound()
  const p = project as Project

  const [{ data: profile }, { data: docs }] = await Promise.all([
    supabase.from('profiles').select('is_active').eq('id', p.owner_id).single(),
    supabase
      .from('documents')
      .select('id, stage_label, file_name, mime_type, size_bytes, link_url, uploaded_at')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false }),
  ])

  const isActive = Boolean(profile?.is_active)
  const documents = (docs ?? []) as DocRow[]

  const grouped = STAGE_LABELS.map((stage) => ({
    stage,
    items: documents.filter((d) => d.stage_label === stage),
  }))

  return (
    <main className="portal-shell">
      <PortalHeader subtitle="Project detail" />

      <Link
        href="/portal/admin"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={15} /> All projects
      </Link>

      {/* Project header */}
      <section className="portal-card" style={{ padding: 24, marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          {p.client_name}
        </div>
        <h1 style={{ fontSize: 26, lineHeight: 1.15 }}>{p.name}</h1>

        <hr className="divider" style={{ margin: '20px 0' }} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          <div>
            <div className="label" style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 10 }}>
              Project status
            </div>
            <StatusControl projectId={p.id} current={p.status} />
          </div>

          <div>
            <div className="label" style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 10 }}>
              Client portal access
            </div>
            <ActiveToggle projectId={p.id} isActive={isActive} />
          </div>
        </div>
      </section>

      {/* Upload */}
      <section className="portal-card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Upload document</h2>
        <DocumentUpload projectId={p.id} />
      </section>

      {/* Documents grouped by stage */}
      <section className="portal-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 18 }}>
          Documents
          <span className="muted" style={{ fontSize: 14, fontWeight: 400 }}>
            {' '}· {documents.length}
          </span>
        </h2>

        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <FileText size={26} />
            </div>
            <p style={{ fontWeight: 600, color: '#cfd6e6' }}>No documents yet</p>
            <p style={{ fontSize: 13.5, marginTop: 4 }}>Upload the first document above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {grouped
              .filter((g) => g.items.length > 0)
              .map((g) => (
                <div key={g.stage}>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>
                    {g.stage}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {g.items.map((d) => (
                      <DocumentRow
                        key={d.id}
                        id={d.id}
                        fileName={d.file_name}
                        mimeType={d.mime_type}
                        sizeBytes={d.size_bytes}
                        linkUrl={d.link_url}
                        admin
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  )
}
