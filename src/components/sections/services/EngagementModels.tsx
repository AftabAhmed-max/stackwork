/* ============================================
   ENGAGEMENT MODELS
   ============================================ */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, RefreshCw, MessageSquare } from 'lucide-react'

const models = [
  {
    icon:     Zap,
    title:    'One-Time Project',
    price:    'Fixed Price',
    color:    '#FF6B35',
    desc:     'A defined scope, fixed timeline, and clear deliverables. Best for websites, apps, and dashboards with a clear brief.',
    features: ['Fixed quote upfront', 'Defined milestones', 'Full handover on completion', '30-day post-launch support'],
    cta:      "Let's Build Together",
  },
  {
    icon:     RefreshCw,
    title:    'Monthly Retainer',
    price:    'Monthly Plan',
    color:    '#00D4FF',
    desc:     'Ongoing support, updates, and development hours each month. Best for businesses that need a consistent digital partner.',
    features: ['Priority support', 'Monthly hours bank', 'Regular updates & backups', 'Performance monitoring'],
    cta:      'Get a Free Quote',
    highlight: true,
  },
  {
    icon:     MessageSquare,
    title:    'Consultation Only',
    price:    'Per Session',
    color:    '#C9A84C',
    desc:     'Not ready to build yet? Book a strategy session to get clarity on what you need, what it costs, and how to proceed.',
    features: ['1-2 hour deep dive', 'Written recommendations', 'Tech audit & roadmap', 'No obligation to proceed'],
    cta:      'Book a Session',
  },
]

export default function EngagementModels() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
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
            How We Work
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   isMobile ? '28px' : '42px',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.2,
          }}>
            Pick the Model That Fits You
          </h2>
        </div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap:                 '20px',
          alignItems:          'stretch',
        }}>
          {models.map((model) => {
            const Icon = model.icon
            return (
              <div key={model.title} className="card-animated" style={{
                backgroundColor: model.highlight ? 'rgba(0,212,255,0.05)' : 'rgba(13,27,62,0.5)',
                borderRadius:    '12px',
                padding:         '36px 28px',
                border:          model.highlight
                  ? '1px solid rgba(0,212,255,0.25)'
                  : '1px solid rgba(255,255,255,0.06)',
                display:         'flex',
                flexDirection:   'column',
                gap:             '20px',
                position:        'relative',
              }}>

                {model.highlight && (
                  <div style={{
                    position:        'absolute',
                    top:             '-3px',
                    left:            '50%',
                    transform:       'translateX(-50%)',
                    backgroundColor: '#00D4FF',
                    color:           '#080b14',
                    fontFamily:      'var(--font-body)',
                    fontSize:        '11px',
                    fontWeight:      700,
                    padding:         '3px 14px',
                    borderRadius:    '100px',
                    whiteSpace:      'nowrap',
                    letterSpacing:   '0.5px',
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width:           '48px', height: '48px', borderRadius: '10px',
                    backgroundColor: `${model.color}15`, border: `1px solid ${model.color}30`,
                    display:         'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={22} color={model.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                      {model.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: model.color, marginTop: '2px' }}>
                      {model.price}
                    </div>
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  {model.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                  {model.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: model.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="cta-pulse" style={{
                  display:         'inline-flex', alignItems: 'center', gap: '8px',
                  backgroundColor: model.color, color: '#ffffff',
                  fontFamily:      'var(--font-body)', fontWeight: 500, fontSize: '14px',
                  padding:         '11px 22px', borderRadius: '6px', textDecoration: 'none',
                  justifyContent:  'center',
                }}>
                  {model.cta} <ArrowRight size={14} />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}