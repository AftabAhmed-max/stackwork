/* ============================================
   WHY STACKWORK SECTION
   - 2x2 grid
   - Each card has a constantly animated
     visual that matches the differentiator
   ============================================ */
'use client'

import { useEffect, useRef, useState } from 'react'

const reasons = [
  {
    title:  'End-to-End Delivery',
    body:   'From strategy to design to development to launch — we handle everything. No coordinating between multiple vendors, no dropped balls.',
    accent: '#FF6B35',
  },
  {
    title:  'Built for India & the Gulf',
    body:   'We understand the markets, the business culture, and the expectations of clients across India, UAE, Qatar, Bahrain, Kuwait, and Saudi Arabia.',
    accent: '#C9A84C',
  },
  {
    title:  'Post-Launch Support',
    body:   'We do not disappear after delivery. Every project comes with support, and we offer retainer plans for businesses that want a long-term partner.',
    accent: '#FF6B35',
  },
  {
    title:  'No Jargon, Just Results',
    body:   'We speak your language, not tech language. Clear timelines, honest pricing, and deliverables that match exactly what was agreed.',
    accent: '#C9A84C',
  },
]

/* ---- 1. End-to-End: Pipeline flow ---- */
function PipelineVisual({ accent }: { accent: string }) {
  const [active, setActive] = useState(0)
  const steps = ['Strategy', 'Design', 'Build', 'Launch']

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % steps.length), 900)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', padding: '16px 0 8px' }}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{
              width:           '32px',
              height:          '32px',
              borderRadius:    '50%',
              backgroundColor: i <= active ? accent : 'rgba(255,255,255,0.06)',
              border:          `2px solid ${i <= active ? accent : 'rgba(255,255,255,0.1)'}`,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              transition:      'all 0.4s ease',
              marginBottom:    '6px',
            }}>
              <span style={{ fontSize: '10px', color: i <= active ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                {i + 1}
              </span>
            </div>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-body)', color: i <= active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', textAlign: 'center', transition: 'color 0.4s ease' }}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              height:          '2px',
              width:           '100%',
              backgroundColor: i < active ? accent : 'rgba(255,255,255,0.08)',
              transition:      'background-color 0.4s ease',
              marginBottom:    '18px',
              flex:            1,
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ---- 2. India & Gulf: Pinging map dots ---- */
function RegionsVisual({ accent }: { accent: string }) {
  const [ping, setPing] = useState(0)
  const regions = [
    { label: 'India',   x: '30%',  y: '45%' },
    { label: 'UAE',     x: '52%',  y: '52%' },
    { label: 'Qatar',   x: '55%',  y: '48%' },
    { label: 'Bahrain', x: '57%',  y: '44%' },
    { label: 'Kuwait',  x: '54%',  y: '40%' },
    { label: 'KSA',     x: '53%',  y: '55%' },
  ]

  useEffect(() => {
    const t = setInterval(() => setPing(p => (p + 1) % regions.length), 700)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ position: 'relative', height: '80px', marginTop: '8px' }}>
      {/* Connecting lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {regions.slice(1).map((r, i) => (
          <line
            key={i}
            x1={regions[0].x} y1={regions[0].y}
            x2={r.x} y2={r.y}
            stroke={`${accent}25`}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}
      </svg>
      {regions.map((r, i) => (
        <div key={r.label} style={{
          position:  'absolute',
          left:      r.x,
          top:       r.y,
          transform: 'translate(-50%, -50%)',
        }}>
          <div style={{
            width:           i === ping ? '10px' : '7px',
            height:          i === ping ? '10px' : '7px',
            borderRadius:    '50%',
            backgroundColor: accent,
            opacity:         i === ping ? 1 : 0.4,
            transition:      'all 0.3s ease',
            boxShadow:       i === ping ? `0 0 8px ${accent}` : 'none',
          }} />
          <span style={{
            position:   'absolute',
            top:        '12px',
            left:       '50%',
            transform:  'translateX(-50%)',
            fontSize:   '8px',
            fontFamily: 'var(--font-body)',
            color:      i === ping ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s ease',
          }}>
            {r.label}
          </span>
        </div>
      ))}
    </div>
  )
}


/* ---- 3. Post-Launch: Uptime ticker ---- */
function SupportVisual({ accent }: { accent: string }) {
  const [tick, setTick]     = useState(0)
  const [uptime, setUptime] = useState(99.98)
  const [bars, setBars]     = useState<{ up: boolean; height: number }[]>([])

  /* ---- Generate bars only on client ---- */
  useEffect(() => {
    setBars(
      Array.from({ length: 28 }, () => ({
        up:     Math.random() > 0.04,
        height: 50 + Math.random() * 50,
      }))
    )
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p + 1)
      setUptime(99.95 + Math.random() * 0.05)
    }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ padding: '12px 0 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
          30-day uptime
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: accent }}>
          {uptime.toFixed(2)}%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '36px' }}>
        {bars.map((b, i) => (
          <div key={i} style={{
            flex:            1,
            height:          `${b.height}%`,
            backgroundColor: b.up ? accent : '#FF5F57',
            borderRadius:    '2px 2px 0 0',
            opacity:         0.8,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
        <div style={{
          width:           '6px',
          height:          '6px',
          borderRadius:    '50%',
          backgroundColor: '#28C840',
          boxShadow:       `0 0 ${tick % 2 === 0 ? 4 : 7}px #28C840`,
          transition:      'box-shadow 0.6s ease',
        }} />
        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
          All systems operational — support active
        </span>
      </div>
    </div>
  )
}

/* ---- 4. No Jargon: Plain language translator ---- */
const translations = [
  { tech: 'API Integration',          plain: 'Connects your tools together'     },
  { tech: 'Responsive Design',        plain: 'Works on phone and desktop'        },
  { tech: 'CI/CD Pipeline',           plain: 'Updates happen automatically'      },
  { tech: 'Cloud Infrastructure',     plain: 'Your site never goes down'         },
  { tech: 'SEO Optimisation',         plain: 'Customers find you on Google'      },
  { tech: 'Database Normalisation',   plain: 'Your data stays clean & fast'      },
]

function TranslatorVisual({ accent }: { accent: string }) {
  const [index, setIndex]   = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIndex(p => (p + 1) % translations.length)
        setFading(false)
      }, 350)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const item = translations[index]

  return (
    <div style={{ padding: '12px 0 4px' }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius:    '8px',
        padding:         '12px',
        border:          '1px solid rgba(255,255,255,0.07)',
        opacity:         fading ? 0 : 1,
        transition:      'opacity 0.35s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '4px' }}>
            TECH
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            {item.tech}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: accent, backgroundColor: `${accent}18`, padding: '2px 7px', borderRadius: '4px' }}>
            PLAIN
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
            {item.plain}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---- Reason card ---- */
function ReasonCard({ reason, index }: { reason: typeof reasons[0]; index: number }) {
  const [inView,   setInView]   = useState(false)
  const [isMobile, setIsMobile] = useState(false)
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
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const visuals = [
    <PipelineVisual   key="pipeline"   accent={reason.accent} />,
    <RegionsVisual    key="regions"    accent={reason.accent} />,
    <SupportVisual    key="support"    accent={reason.accent} />,
    <TranslatorVisual key="translator" accent={reason.accent} />,
  ]

  return (
    <div className="card-animated" ref={ref} style={{
      backgroundColor: '#0D1B3E',
      borderRadius:    '12px',
      padding:         isMobile ? '24px' : '32px',
      border:          '1px solid rgba(255,255,255,0.06)',
      display:         'flex',
      flexDirection:   'column',
      gap:             '16px',
      opacity:         inView ? 1 : 0,
      transform:       inView ? 'translateY(0)' : 'translateY(20px)',
      transition:      `opacity 0.5s ease ${index * 0.12}s, transform 0.5s ease ${index * 0.12}s`,
    }}>

      {/* Accent line */}
      <div style={{ width: '28px', height: '3px', backgroundColor: reason.accent, borderRadius: '2px' }} />

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize:   isMobile ? '18px' : '20px',
        fontWeight: 700,
        color:      '#ffffff',
        lineHeight: 1.3,
      }}>
        {reason.title}
      </h3>

      {/* Animated visual */}
      {inView && visuals[index]}

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize:   '14px',
        color:      'rgba(255,255,255,0.6)',
        lineHeight: 1.7,
      }}>
        {reason.body}
      </p>
    </div>
  )
}

export default function WhyStackwork() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="section-overlay" style={{ backgroundColor: 'transparent', padding: isMobile ? '60px 24px' : '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '56px', maxWidth: '560px' }}>
          <span className="section-label" style={{
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
            color: '#FF6B35', textTransform: 'uppercase',
          }}>
            Why Choose Us
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   isMobile ? '28px' : '42px',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.2,
          }}>
            A Digital Partner That Actually Delivers
          </h2>
        </div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap:                 '24px',
        }}>
          {reasons.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}