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
    price:    'From ₹10,000',
    color:    '#FF6B35',
    desc:     'A defined scope, fixed timeline, clear deliverables. Websites from ₹10,000 · E-commerce from ₹50,000 · Booking systems from ₹40,000 · Business systems from ₹60,000.',
    features: ['Fixed quote upfront', 'Defined milestones', 'Full handover on completion', '30-day post-launch support'],
    cta:      "Let's Build Together",
  },
  {
    icon:     MessageSquare,
    title:    'Free Discovery Call',
    price:    'No Cost',
    color:    '#00D4FF',
    desc:     'The first step. We talk through what you need, what it would cost, and how it works — then send you a clear proposal. No charge, no obligation.',
    features: ['Understand your goals', 'Honest scope & pricing', 'Leads to a written proposal', 'No obligation to proceed'],
    cta:      'Book a Free Call',
  },
  {
    icon:     RefreshCw,
    title:    'Hourly Work',
    price:    '₹699 / hour',
    color:    '#C9A84C',
    desc:     'For changes, fixes, or maintenance that fall outside the scope of a project. Available on request — you only pay for the time actually used.',
    features: ['No retainer required', 'Pay only for time used', 'Changes & maintenance', 'Available on request'],
    cta:      'Get a Free Quote',
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
                backgroundColor: 'rgba(13,27,62,0.5)',
                borderRadius:    '12px',
                padding:         '36px 28px',
                border:          '1px solid rgba(255,255,255,0.06)',
                display:         'flex',
                flexDirection:   'column',
                gap:             '20px',
                position:        'relative',
              }}>

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