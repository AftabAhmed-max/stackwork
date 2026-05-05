/* ============================================
   CTA BANNER SECTION
   - Full width deep navy band
   - Bold headline + single CTA
   - Subtle background texture for depth
   ============================================ */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTABanner() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="section-overlay" style={{
      backgroundColor: 'transparent',
      padding:         isMobile ? '60px 24px' : '100px 60px',
      position:        'relative',
      overflow:        'hidden',
    }}>

      {/* ---- Content ---- */}
      <div style={{
        position:      'relative',
        zIndex:        1,
        maxWidth:      '1200px',
        margin:        '0 auto',
        display:       'flex',
        alignItems:    'center',
        justifyContent: 'space-between',
        flexWrap:      'wrap',
        gap:           '40px',
      }}>

        {/* Left: text */}
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     isMobile ? '28px' : '48px',
            fontWeight:   700,
            color:        '#ffffff',
            lineHeight:   1.15,
            marginBottom: '16px',
          }}>
            Ready to Build Something{' '}
            <span style={{ color: '#FF6B35' }}>That Actually Works?</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   isMobile ? '15px' : '18px',
            color:      'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
          }}>
            Tell us about your business and we will put together a plan. No pressure, no jargon — just an honest conversation about what you need.
          </p>
        </div>

        {/* Right: CTA */}
        <Link
          href="/contact"
          className="cta-pulse"
          style={{
            display:         'inline-flex',
            alignItems:      'center',
            gap:             '10px',
            backgroundColor: '#FF6B35',
            color:           '#ffffff',
            fontFamily:      'var(--font-body)',
            fontWeight:      500,
            fontSize:        '16px',
            padding:         '16px 36px',
            borderRadius:    '6px',
            textDecoration:  'none',
            whiteSpace:      'nowrap',
            transition:      'background-color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e55a28')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6B35')}
        >
          Start a Project <ArrowRight size={16} />
        </Link>

      </div>
    </section>
  )
}