/* ============================================
   SERVICES HERO
   ============================================ */
'use client'

import { useEffect, useState } from 'react'

const serviceNames = [
  'Web Design',
  'App Development',
  'Data Analytics',
  'Business Setup',
  'Maintenance',
]

export default function ServicesHero() {
  const [visible,     setVisible]     = useState(false)
  const [wordIndex,   setWordIndex]   = useState(0)
  const [wordVisible, setWordVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex(p => (p + 1) % serviceNames.length)
        setWordVisible(true)
      }, 400)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section style={{ padding: '80px 60px 60px', textAlign: 'center' }}>
      <div style={{
        maxWidth:   '860px',
        margin:     '0 auto',
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        <span className="section-label" style={{
          fontFamily: 'var(--font-body)', fontSize: '13px',
          fontWeight: 500, color: '#FF6B35', textTransform: 'uppercase',
        }}>
          What We Offer
        </span>

        <h1 style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(28px, 3.5vw, 52px)',
          fontWeight:    700,
          color:         '#ffffff',
          lineHeight:    1.3,
          marginBottom:  '16px',
          letterSpacing: '-0.5px',
        }}>
          <span style={{ display: 'block' }}>One Partner.</span>
          <span style={{ display: 'block', color: '#FF6B35' }}>Every Solution.</span>
          <span style={{ display: 'block' }}>Zero Compromise.</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(15px, 2vw, 19px)',
          color:      'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          maxWidth:   '580px',
          margin:     '0 auto 32px',
        }}>
          Everything your business needs to build, grow, and operate digitally — delivered end to end by one team that stays accountable.
        </p>

        {/* Cycling service pills */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {serviceNames.map((name, i) => (
            <span key={name} style={{
              fontFamily:      'var(--font-body)',
              fontSize:        '13px',
              fontWeight:      500,
              color:           wordIndex === i ? '#FF6B35' : 'rgba(255,255,255,0.4)',
              backgroundColor: wordIndex === i ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.04)',
              border:          `1px solid ${wordIndex === i ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:    '100px',
              padding:         '6px 16px',
              transition:      'all 0.4s ease',
            }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}