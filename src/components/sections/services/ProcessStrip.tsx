/* ============================================
   PROCESS STRIP
   - Animated horizontal timeline
   ============================================ */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, FileText, Code2, Eye, Rocket } from 'lucide-react'

const steps = [
  { icon: Search,   title: 'Discovery',  desc: 'We learn about your business, goals, and what success looks like for you.',          color: '#FF6B35' },
  { icon: FileText, title: 'Proposal',   desc: 'You receive a clear scope, timeline, and fixed price. No surprises.',                color: '#00D4FF' },
  { icon: Code2,    title: 'Build',      desc: 'We design and develop your project with regular check-ins and progress updates.',    color: '#C9A84C' },
  { icon: Eye,      title: 'Review',     desc: 'You test everything. We refine until it is exactly right.',                          color: '#8B5CF6' },
  { icon: Rocket,   title: 'Launch',     desc: 'We go live and stay available for support. This is where most agencies disappear.',  color: '#2C6E49' },
]

export default function ProcessStrip() {
  const [active,   setActive]   = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [inView,   setInView]   = useState(false)
  const ref                     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setActive(p => (p + 1) % steps.length), 1800)
    return () => clearInterval(t)
  }, [inView])

  return (
    <section ref={ref} style={{ padding: isMobile ? '60px 24px' : '80px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '56px', maxWidth: '560px' }}>
          <span className="section-label" style={{
            fontFamily: 'var(--font-body)', fontSize: '13px',
            fontWeight: 500, color: '#FF6B35', textTransform: 'uppercase',
          }}>
            How It Works
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   isMobile ? '28px' : '42px',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.2,
          }}>
            A Clear Process, Every Time
          </h2>
        </div>

        {/* Steps */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
          gap:                 isMobile ? '16px' : '0',
          position:            'relative',
        }}>
          {/* Connecting line — desktop only */}
          {!isMobile && (
            <div style={{
              position:        'absolute',
              top:             '32px',
              left:            '10%',
              right:           '10%',
              height:          '1px',
              background:      'linear-gradient(to right, transparent, rgba(255,107,53,0.2) 20%, rgba(0,212,255,0.3) 50%, rgba(139,92,246,0.2) 80%, transparent)',
              zIndex:          0,
            }} />
          )}

          {steps.map((step, i) => {
            const Icon    = step.icon
            const isActive = active === i

            return (
              <div
                key={step.title}
                onClick={() => setActive(i)}
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     isMobile ? 'flex-start' : 'center',
                  textAlign:      isMobile ? 'left' : 'center',
                  padding:        isMobile ? '16px 20px' : '0 12px',
                  cursor:         'pointer',
                  position:       'relative',
                  zIndex:         1,
                  backgroundColor: isMobile ? (isActive ? 'rgba(13,27,62,0.6)' : 'rgba(13,27,62,0.3)') : 'transparent',
                  borderRadius:   isMobile ? '10px' : '0',
                  border:         isMobile ? `1px solid ${isActive ? step.color + '40' : 'rgba(255,255,255,0.06)'}` : 'none',
                  transition:     'all 0.3s ease',
                }}
              >
                {/* Icon circle */}
                <div style={{
                  width:           '64px',
                  height:          '64px',
                  borderRadius:    '50%',
                  backgroundColor: isActive ? `${step.color}20` : 'rgba(255,255,255,0.05)',
                  border:          `2px solid ${isActive ? step.color : 'rgba(255,255,255,0.1)'}`,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  marginBottom:    isMobile ? '0' : '20px',
                  flexShrink:      0,
                  transition:      'all 0.4s ease',
                  boxShadow:       isActive ? `0 0 20px ${step.color}40` : 'none',
                  marginRight:     isMobile ? '16px' : '0',
                }}>
                  <Icon size={24} color={isActive ? step.color : 'rgba(255,255,255,0.35)'} />
                </div>

                <div style={{ display: isMobile ? 'flex' : 'block', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{
                    fontFamily:   'var(--font-heading)',
                    fontSize:     '16px',
                    fontWeight:   700,
                    color:        isActive ? step.color : '#ffffff',
                    marginBottom: '8px',
                    transition:   'color 0.3s ease',
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   '13px',
                    color:      isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                    lineHeight: 1.6,
                    transition: 'color 0.3s ease',
                    maxHeight:  isActive || isMobile ? '200px' : isMobile ? '0' : '200px',
                    overflow:   'hidden',
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}