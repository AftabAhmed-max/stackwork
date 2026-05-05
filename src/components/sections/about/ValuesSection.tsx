/* ============================================
   VALUES SECTION
   - 4 core values with animated icons
   ============================================ */
'use client'

import { useEffect, useState } from 'react'

const values = [
  {
    number: '01',
    title:  'Clarity Over Complexity',
    body:   'Every deliverable we produce is easy to understand, easy to use, and easy to hand over. No black boxes, no lock-in.',
    color:  '#FF6B35',
  },
  {
    number: '02',
    title:  'Quality Without Excuses',
    body:   'We hold every project to enterprise standards regardless of budget size. Good enough is never good enough.',
    color:  '#00D4FF',
  },
  {
    number: '03',
    title:  'Long-Term Partnerships',
    body:   'We measure success by how your business performs after launch, not just at delivery. We stay invested.',
    color:  '#C9A84C',
  },
  {
    number: '04',
    title:  'Built for Real Businesses',
    body:   'Everything we build is designed for actual daily use — by restaurant owners, clinic managers, and logistics teams, not just tech people.',
    color:  '#8B5CF6',
  },
]

export default function ValuesSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{ padding: isMobile ? '60px 24px' : '80px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '56px', maxWidth: '560px' }}>
          <span className="section-label" style={{
            fontFamily: 'var(--font-body)', fontSize: '13px',
            fontWeight: 500, color: '#FF6B35', textTransform: 'uppercase',
          }}>
            What We Stand For
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   isMobile ? '28px' : '42px',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.2,
          }}>
            Values That Drive Every Project
          </h2>
        </div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap:                 '20px',
        }}>
          {values.map((value) => (
            <div key={value.number} className="card-animated" style={{
              backgroundColor: 'rgba(13,27,62,0.5)',
              borderRadius:    '12px',
              padding:         '36px 32px',
              border:          '1px solid rgba(255,255,255,0.06)',
              position:        'relative',
              overflow:        'hidden',
              display:         'flex',
              gap:             '24px',
              alignItems:      'flex-start',
            }}>

              {/* Number */}
              <span style={{
                position:   'absolute',
                top:        '16px',
                right:      '20px',
                fontFamily: 'var(--font-heading)',
                fontSize:   '56px',
                fontWeight: 700,
                color:      `${value.color}08`,
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {value.number}
              </span>

              {/* Color bar */}
              <div style={{
                width:           '4px',
                minHeight:       '100%',
                backgroundColor: value.color,
                borderRadius:    '2px',
                flexShrink:      0,
                alignSelf:       'stretch',
                boxShadow:       `0 0 12px ${value.color}50`,
              }} />

              <div>
                <h3 style={{
                  fontFamily:   'var(--font-heading)',
                  fontSize:     '20px',
                  fontWeight:   700,
                  color:        '#ffffff',
                  marginBottom: '12px',
                  lineHeight:   1.3,
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   '15px',
                  color:      'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                }}>
                  {value.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}