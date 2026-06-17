'use client'

/* ============================================
   CLIENT DOCUMENT TIMELINE (client component)
   A vertical, read-top-to-bottom project journey.
   Everything is visible at once (no collapsing).

   Presentation-only anchors (the data model is
   unchanged — admins can upload any stage):
     - FIRST node is always "Project Proposal".
     - LAST  node is always "End of Service".
   Between them, only stages the admin actually
   uploaded appear, in STAGE_LABELS order (already
   applied by the server before this list is passed).

   Node states:
     - PENDING (not uploaded): hollow muted dot, muted
       label, "Pending" tag, no rows.
     - ACTIVE (uploaded): filled dot + white label +
       document row(s). "End of Service" uses gold when
       active; all other active nodes use orange.

   React state only, no web storage, no innerHTML.
   ============================================ */
import { Check } from 'lucide-react'
import DocumentRow from '../../../_components/DocumentRow'

type Item = {
  id: string
  fileName: string
  mimeType: string | null
  sizeBytes: number | null
  linkUrl: string | null
}

export type TimelineGroup = { stage: string; items: Item[] }

const FIRST_ANCHOR = 'Project Proposal'
const LAST_ANCHOR = 'End of Service'

const ORANGE = '#FF6B35'
const GOLD = '#C9A84C'
const MUTED = '#888888'
const DOTTED = 'rgba(136,136,136,0.45)'

type Node = {
  stage: string
  active: boolean
  items: Item[]
  accent: string // color used when active
}

export default function ClientDocTimeline({ groups }: { groups: TimelineGroup[] }) {
  const byStage = new Map(groups.map((g) => [g.stage, g.items]))

  const proposalItems = byStage.get(FIRST_ANCHOR) ?? []
  const endItems = byStage.get(LAST_ANCHOR) ?? []
  const middle = groups.filter(
    (g) => g.stage !== FIRST_ANCHOR && g.stage !== LAST_ANCHOR,
  )

  const nodes: Node[] = [
    { stage: FIRST_ANCHOR, active: proposalItems.length > 0, items: proposalItems, accent: ORANGE },
    ...middle.map((g) => ({ stage: g.stage, active: true, items: g.items, accent: ORANGE })),
    { stage: LAST_ANCHOR, active: endItems.length > 0, items: endItems, accent: GOLD },
  ]

  return (
    <div>
      {nodes.map((node, i) => {
        const isLast = i === nodes.length - 1
        const dotColor = node.active ? node.accent : MUTED

        return (
          <div
            key={node.stage}
            style={{
              display: 'grid',
              gridTemplateColumns: '28px minmax(0, 1fr)',
              columnGap: 14,
              alignItems: 'stretch',
            }}
          >
            {/* Left rail: dot + dotted connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                aria-hidden
                style={{
                  flex: 'none',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  marginTop: 2,
                  background: node.active ? dotColor : 'transparent',
                  border: node.active ? `2px solid ${dotColor}` : `2px solid ${MUTED}`,
                  boxShadow: node.active ? `0 0 0 4px ${dotColor}22` : 'none',
                  transition: 'background 0.2s ease',
                }}
              >
                {node.active ? <Check size={12} color="#1a0f08" strokeWidth={3} /> : null}
              </div>

              {!isLast ? (
                <div
                  aria-hidden
                  style={{
                    flex: 1,
                    width: 0,
                    minHeight: 28,
                    margin: '4px 0',
                    borderLeft: `2px dotted ${DOTTED}`,
                  }}
                />
              ) : null}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 22, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                  minHeight: 24,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 15.5,
                    color: node.active ? '#ffffff' : MUTED,
                  }}
                >
                  {node.stage}
                </span>
                {!node.active ? (
                  <span
                    className="pill"
                    style={{
                      color: MUTED,
                      background: 'rgba(136,136,136,0.12)',
                      borderColor: 'rgba(136,136,136,0.28)',
                      fontSize: 11,
                      padding: '3px 10px',
                    }}
                  >
                    Pending
                  </span>
                ) : null}
              </div>

              {node.active && node.items.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  {node.items.map((d) => (
                    <DocumentRow
                      key={d.id}
                      id={d.id}
                      fileName={d.fileName}
                      mimeType={d.mimeType}
                      sizeBytes={d.sizeBytes}
                      linkUrl={d.linkUrl}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
