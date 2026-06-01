/* ============================================
   SERVICES PAGE CTA
   ============================================ */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageSquare } from 'lucide-react'

export default function ServicesCTA() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{ padding: isMobile ? '60px 24px 80px' : '80px 60px 100px' }}>
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
          Ready to Start?
        </span>

        <h2 style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      isMobile ? '28px' : '48px',
          fontWeight:    700,
          color:         '#ffffff',
          lineHeight:    1.15,
          maxWidth:      '600px',
        }}>
          Not Sure Which Service You Need?
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   isMobile ? '15px' : '18px',
          color:      'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          maxWidth:   '480px',
        }}>
          Book a free discovery call and we'll tell you exactly what your business needs — and what it doesn't.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/contact" className="cta-pulse" style={{
            display:         'inline-flex', alignItems: 'center', gap: '10px',
            backgroundColor: '#FF6B35', color: '#ffffff',
            fontFamily:      'var(--font-body)', fontWeight: 500, fontSize: '16px',
            padding:         '15px 36px', borderRadius: '6px', textDecoration: 'none',
          }}>
            Book a Free Discovery Call <ArrowRight size={16} />
          </Link>

          <a href="https://wa.me/919905800700"
            target="_blank"
            rel="noreferrer"
            style={{
              display:         'inline-flex',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             '10px',
              backgroundColor: '#25D366',
              color:           '#ffffff',
              fontFamily:      'var(--font-body)',
              fontWeight:      500,
              fontSize:        '16px',
              padding:         '15px 36px',
              borderRadius:    '6px',
              textDecoration:  'none',
              border:          '1px solid #25D366',
              transition:      'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1EBE5A'
              e.currentTarget.style.borderColor = '#1EBE5A'
              e.currentTarget.style.transform = 'scale(1.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#25D366'
              e.currentTarget.style.borderColor = '#25D366'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <MessageSquare size={16} /> WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}