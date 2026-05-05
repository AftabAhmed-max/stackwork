/* ============================================
   CONTACT HERO
   ============================================ */
'use client'

import { useEffect, useState } from 'react'

export default function ContactHero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{ padding: '80px 60px 40px', textAlign: 'center' }}>
      <div style={{
        maxWidth:   '700px',
        margin:     '0 auto',
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        <span className="section-label" style={{
          fontFamily: 'var(--font-body)', fontSize: '13px',
          fontWeight: 500, color: '#FF6B35', textTransform: 'uppercase',
        }}>
          Get In Touch
        </span>

        <h1 style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(36px, 5vw, 64px)',
          fontWeight:    700,
          color:         '#ffffff',
          lineHeight:    1.1,
          marginBottom:  '20px',
          letterSpacing: '-1px',
        }}>
          Let's Build Something{' '}
          <span style={{ color: '#FF6B35' }}>Together</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(15px, 2vw, 18px)',
          color:      'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          maxWidth:   '520px',
          margin:     '0 auto',
        }}>
          Tell us about your business and what you need. We typically respond within 24 hours.
        </p>
      </div>
    </section>
  )
}