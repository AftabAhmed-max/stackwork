/* ============================================
   ABOUT HERO
   - Page title + mission statement
   ============================================ */
'use client'

import { useEffect, useState } from 'react'

export default function AboutHero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{
      padding:        '80px 60px 60px',
      textAlign:      'center',
      position:       'relative',
    }}>
      <div style={{
        maxWidth:   '760px',
        margin:     '0 auto',
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        <span className="section-label" style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '13px',
          fontWeight:    500,
          color:         '#FF6B35',
          textTransform: 'uppercase',
        }}>
          About Stackwork
        </span>

        <h1 style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(36px, 5vw, 64px)',
          fontWeight:    700,
          color:         '#ffffff',
          lineHeight:    1.1,
          marginBottom:  '24px',
          letterSpacing: '-1px',
        }}>
          Built to Solve Real{' '}
          <span style={{ color: '#FF6B35' }}>Business Problems</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(16px, 2vw, 20px)',
          color:      'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          maxWidth:   '600px',
          margin:     '0 auto',
        }}>
          Stackwork is not just a digital agency — it is an initiative to help small and medium businesses build a real digital presence, track their growth, and compete at a higher level.
        </p>
      </div>
    </section>
  )
}