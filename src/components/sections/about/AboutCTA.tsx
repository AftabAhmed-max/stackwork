/* ============================================
   ABOUT PAGE CTA
   ============================================ */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutCTA() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{ padding: isMobile ? '60px 24px' : '80px 60px' }}>
      <div style={{
        maxWidth:     '1200px',
        margin:       '0 auto',
        textAlign:    'center',
        display:      'flex',
        flexDirection: 'column',
        alignItems:   'center',
        gap:          '24px',
      }}>
        <span className="section-label" style={{
          fontFamily: 'var(--font-body)', fontSize: '13px',
          fontWeight: 500, color: '#FF6B35', textTransform: 'uppercase',
        }}>
          Let's Work Together
        </span>

        <h2 style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      isMobile ? '28px' : '48px',
          fontWeight:    700,
          color:         '#ffffff',
          lineHeight:    1.15,
          maxWidth:      '600px',
        }}>
          Ready to Build Something{' '}
          <span style={{ color: '#FF6B35' }}>That Works?</span>
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   isMobile ? '15px' : '18px',
          color:      'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          maxWidth:   '480px',
        }}>
          Tell us about your business and we will put together a plan that makes sense — no pressure, no jargon.
        </p>

        <Link href="/contact" className="cta-pulse" style={{
          display:         'inline-flex',
          alignItems:      'center',
          gap:             '10px',
          backgroundColor: '#FF6B35',
          color:           '#ffffff',
          fontFamily:      'var(--font-body)',
          fontWeight:      500,
          fontSize:        '16px',
          padding:         '15px 36px',
          borderRadius:    '6px',
          textDecoration:  'none',
        }}>
          Let's Build Together <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}