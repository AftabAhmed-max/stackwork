/* ============================================
   /portal/admin — admin dashboard
   Server-guarded (requireAdmin). Shows status summary
   counts + ALL projects. Data is read through the
   admin's own RLS context (the "admin reads all"
   policy), never via the service-role key.
   ============================================ */
import Link from 'next/link'
import { ChevronRight, FolderOpen } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { PROJECT_STATUSES, type ProjectStatus } from '@/lib/validation'
import PortalHeader from '../../_components/PortalHeader'
import StatusPill from '../../_components/StatusPill'
import CreateProjectForm from './_components/CreateProjectForm'

export const dynamic = 'force-dynamic'

type ProjectRow = {
  id: string
  name: string
  client_name: string
  status: ProjectStatus
  created_at: string
}

const STAT_META: Record<ProjectStatus, { label: string; color: string }> = {
  ongoing: { label: 'Ongoing', color: 'var(--color-orange)' },
  on_hold: { label: 'On Hold', color: 'var(--color-gold)' },
  closed: { label: 'Closed', color: 'var(--color-muted)' },
}

export default async function AdminDashboard() {
  await requireAdmin()

  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('id, name, client_name, status, created_at')
    .order('created_at', { ascending: false })

  const projects = (data ?? []) as ProjectRow[]

  const counts: Record<ProjectStatus, number> = {
    ongoing: 0,
    on_hold: 0,
    closed: 0,
  }
  for (const p of projects) counts[p.status] += 1

  return (
    <main className="portal-shell">
      <PortalHeader subtitle="Admin dashboard" />

      {/* Summary stats */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {PROJECT_STATUSES.map((s) => (
          <div className="portal-stat" key={s}>
            <div className="num" style={{ color: STAT_META[s].color }}>
              {counts[s]}
            </div>
            <div className="label">{STAT_META[s].label}</div>
          </div>
        ))}
      </section>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 28,
        }}
      >
        {/* Create new */}
        <section className="portal-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 4 }}>New project &amp; client</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>
            Creates the project and its client login together.
          </p>
          <CreateProjectForm />
        </section>

        {/* Projects list */}
        <section className="portal-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 18 }}>
            All projects
            <span className="muted" style={{ fontSize: 14, fontWeight: 400 }}>
              {' '}
              · {projects.length}
            </span>
          </h2>

          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="icon">
                <FolderOpen size={26} />
              </div>
              <p style={{ fontWeight: 600, color: '#cfd6e6' }}>No projects yet</p>
              <p style={{ fontSize: 13.5, marginTop: 4 }}>
                Create your first project and client above.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/portal/admin/${p.id}`}
                  className="doc-row"
                  style={{ justifyContent: 'space-between', textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.name}
                    </div>
                    <div className="doc-meta" style={{ marginTop: 2 }}>
                      {p.client_name}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
                    <StatusPill status={p.status} />
                    <ChevronRight size={18} className="muted" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
