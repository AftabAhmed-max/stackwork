/* ============================================
   HERO SECTION
   - Particle network canvas background
   - Headline with endless word cycle
   - Subparagraph typewriter effect
   - CTA buttons stagger fade-up
   ============================================ */
'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const cycleWords = ['Websites', 'Apps', 'Dashboards', 'Digital Presence']
const subText    = 'We build websites, apps, and data tools for small businesses and startups — so you can focus on running your business, not chasing freelancers.'



/* ============================================
   HERO SECTION
   ============================================ */
export default function Hero() {
  const [wordIndex,   setWordIndex]   = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const [typed,       setTyped]       = useState('')
  const [typeDone,    setTypeDone]    = useState(false)
  const [ctaVisible,  setCtaVisible]  = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  /* ---- Word cycle ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex(p => (p + 1) % cycleWords.length)
        setWordVisible(true)
      }, 400)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  /* ---- Typewriter ---- */
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setTyped(subText.slice(0, i + 1))
      i++
      if (i >= subText.length) {
        clearInterval(interval)
        setTypeDone(true)
      }
    }, 22)
    return () => clearInterval(interval)
  }, [])

  /* ---- CTA fade-up ---- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCtaVisible(true) },
      { threshold: 0.5 }
    )
    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section style={{
      position:        'relative',
      minHeight:       'calc(100vh - 88px)',
      backgroundColor: 'transparent',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      overflow:        'hidden',
      padding:         '80px 60px',
    }}>

      {/* ---- Content ---- */}
      <div style={{
        position:  'relative',
        zIndex:    1,
        maxWidth:  '860px',
        textAlign: 'center',
      }}>

        {/* ---- H1 ---- */}
        <h1 style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(36px, 6vw, 72px)',
          fontWeight:    700,
          color:         '#ffffff',
          lineHeight:    1.1,
          marginBottom:  '32px',
          letterSpacing: '-1px',
        }}>
          Your Business Deserves Better{' '}
          <br />
          <span style={{
            color:      '#FF6B35',
            display:    'inline-block',
            opacity:    wordVisible ? 1 : 0,
            transform:  wordVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            minWidth:   '320px',
          }}>
            {cycleWords[wordIndex]}
          </span>
        </h1>

        {/* ---- Typewriter subparagraph ---- */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(15px, 2vw, 19px)',
          color:      'rgba(255,255,255,0.65)',
          lineHeight: 1.7,
          maxWidth:   '620px',
          margin:     '0 auto 48px',
          minHeight:  '80px',
        }}>
          {typed}
          {!typeDone && (
            <span style={{
              display:         'inline-block',
              width:           '2px',
              height:          '1em',
              backgroundColor: '#FF6B35',
              marginLeft:      '2px',
              verticalAlign:   'middle',
              animation:       'blink 0.8s step-end infinite',
            }} />
          )}
        </p>

        {/* ---- CTAs ---- */}
        <div ref={ctaRef} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="cta-pulse" style={{
            backgroundColor: '#FF6B35',
            color:           '#ffffff',
            fontFamily:      'var(--font-body)',
            fontWeight:      500,
            fontSize:        '16px',
            padding:         '14px 32px',
            borderRadius:    '6px',
            textDecoration:  'none',
            transition:      'background-color 0.2s ease, opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
            opacity:         ctaVisible ? 1 : 0,
            transform:       ctaVisible ? 'translateY(0)' : 'translateY(16px)',
            display:         'inline-block',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e55a28')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6B35')}
          >
            Let's Build Together
          </Link>

          <Link
            href="/services"
            style={{
              backgroundColor: 'transparent',
              color:           '#ffffff',
              fontFamily:      'var(--font-body)',
              fontWeight:      500,
              fontSize:        '16px',
              padding:         '14px 32px',
              borderRadius:    '6px',
              textDecoration:  'none',
              border:          '1px solid rgba(58,95,138,0.8)',
              transition:      'all 0.2s ease',
              display:         'inline-block',
              opacity:         ctaVisible ? 1 : 0,
              transform:       ctaVisible ? 'translateY(0)' : 'translateY(16px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.transform = 'scale(1.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(58,95,138,0.8)'
              e.currentTarget.style.transform = ctaVisible ? 'translateY(0)' : 'translateY(16px)'
            }}
          >
            See Our Work
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @media (max-width: 600px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

    </section>
  )
}