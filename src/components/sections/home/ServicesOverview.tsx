/* ============================================
   SERVICES OVERVIEW SECTION
   - All 6 cards have unique animated mockups
   - Each mockup style matches the service type
   - Real project screenshots can replace later
   ============================================ */
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Globe, Smartphone, BarChart2,
  Building2, Wrench, MessageSquare, ArrowRight,
} from 'lucide-react'

/* ============================================
   MOCKUP COMPONENTS — one per service
   ============================================ */

/* ---- 1. Web Design: Browser carousel ---- */
const webSlides = [
  { label: 'Restaurant Website',  color: '#1a1a2e', accent: '#FF6B35' },
  { label: 'Real Estate Portal',  color: '#0d2137', accent: '#3A5F8A' },
  { label: 'E-Commerce Store',    color: '#1a0d2e', accent: '#C9A84C' },
]

function WebMockup() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setFading(true)
      setTimeout(() => { setActive(p => (p + 1) % webSlides.length); setFading(false) }, 300)
    }, 2800)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])

  const slide = webSlides[active]

  return (
    <div>
      <div style={{ backgroundColor: '#0f0f1a', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Browser bar */}
        <div style={{ backgroundColor: '#0a0a14', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', padding: '2px 8px', fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
            stackworkhq.com/projects
          </div>
        </div>
        {/* Screen */}
        <div style={{ height: '150px', backgroundColor: slide.color, padding: '16px', opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease', position: 'relative' }}>
          {/* Nav bar sim */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ width: '50px', height: '7px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '3px' }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              {[40,40,40].map((w,i) => <div key={i} style={{ width: w, height: '7px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '3px' }} />)}
            </div>
          </div>
          {/* Hero sim */}
          <div style={{ width: '65%', height: '10px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '4px', marginBottom: '8px' }} />
          <div style={{ width: '45%', height: '7px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '4px', marginBottom: '14px' }} />
          <div style={{ width: '80px', height: '22px', backgroundColor: slide.accent, borderRadius: '4px', opacity: 0.9 }} />
          <div style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '9px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px' }}>{slide.label}</div>
        </div>
      </div>
      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
        {webSlides.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: active === i ? '18px' : '5px', height: '5px', borderRadius: '3px', backgroundColor: active === i ? '#FF6B35' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

/* ---- 2. Mobile App: Phone frame ---- */
const appSlides = [
  { label: 'Booking App',    bars: [60, 80, 45, 90, 55], color: '#FF6B35' },
  { label: 'CRM Dashboard',  bars: [75, 50, 85, 40, 70], color: '#3A5F8A' },
  { label: 'Custom Tool',    bars: [40, 90, 60, 75, 50], color: '#C9A84C' },
]

function AppMockup() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setFading(true)
      setTimeout(() => { setActive(p => (p + 1) % appSlides.length); setFading(false) }, 300)
    }, 3000)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])

  const slide = appSlides[active]

  return (
    <div>
      <div style={{ backgroundColor: '#0f0f1a', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Phone top bar */}
        <div style={{ backgroundColor: '#0a0a14', padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>App Preview</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
          </div>
        </div>
        {/* App screen */}
        <div style={{ height: '150px', backgroundColor: '#0d1117', padding: '12px', opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          {/* App header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '60px', height: '7px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '3px' }} />
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: slide.color, opacity: 0.8 }} />
          </div>
          {/* Stat row */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '6px', border: `1px solid ${slide.color}30` }}>
                <div style={{ width: '100%', height: '5px', backgroundColor: slide.color, borderRadius: '2px', opacity: 0.6, marginBottom: '4px' }} />
                <div style={{ width: '60%', height: '4px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
              </div>
            ))}
          </div>
          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
            {slide.bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: slide.color, borderRadius: '3px 3px 0 0', opacity: 0.7 }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
        {appSlides.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: active === i ? '18px' : '5px', height: '5px', borderRadius: '3px', backgroundColor: active === i ? '#FF6B35' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

/* ---- 3. Analytics: Dashboard mockup ---- */
const analyticsSlides = [
  { label: 'Sales Dashboard',   line: [30,45,35,60,50,75,65,80], color: '#2C6E49' },
  { label: 'Operations Report', line: [50,40,65,45,70,55,80,60], color: '#3A5F8A' },
  { label: 'BI Dashboard',      line: [20,55,40,70,45,85,60,90], color: '#C9A84C' },
]

function AnalyticsMockup() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setFading(true)
      setTimeout(() => { setActive(p => (p + 1) % analyticsSlides.length); setFading(false) }, 300)
    }, 3200)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])

  const slide = analyticsSlides[active]
  const max = Math.max(...slide.line)
  const points = slide.line.map((v, i) => `${(i / (slide.line.length - 1)) * 180},${50 - (v / max) * 44}`).join(' ')

  return (
    <div>
      <div style={{ backgroundColor: '#0f0f1a', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ backgroundColor: '#0a0a14', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', padding: '2px 8px', fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
            {slide.label}
          </div>
        </div>
        <div style={{ height: '150px', backgroundColor: '#0d1117', padding: '12px', opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          {/* KPI row */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            {['Revenue', 'Users', 'Orders'].map((k, i) => (
              <div key={k} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '5px 7px', borderLeft: `2px solid ${slide.color}` }}>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', marginBottom: '3px' }}>{k}</div>
                <div style={{ width: '70%', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
              </div>
            ))}
          </div>
          {/* Line chart */}
          <svg viewBox="0 0 180 54" style={{ width: '100%', height: '70px' }}>
            <defs>
              <linearGradient id={`grad-${active}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={slide.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={slide.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points={points} fill="none" stroke={slide.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points={`0,50 ${points} 180,50`} fill={`url(#grad-${active})`} />
          </svg>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
        {analyticsSlides.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: active === i ? '18px' : '5px', height: '5px', borderRadius: '3px', backgroundColor: active === i ? '#FF6B35' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

/* ---- 4. Business Setup: Config UI ---- */
function SetupMockup() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep(p => (p + 1) % 3), 2500)
    return () => clearInterval(t)
  }, [])

  const steps = [
    { label: 'Domain Registered',     done: true  },
    { label: 'Hosting Configured',    done: step >= 1 },
    { label: 'Google Workspace Live', done: step >= 2 },
  ]

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>Business Setup Progress</div>
      </div>
      <div style={{ height: '150px', backgroundColor: '#0d1117', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: s.done ? '#2C6E49' : 'rgba(255,255,255,0.08)',
              border: s.done ? 'none' : '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.4s ease',
            }}>
              {s.done && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: '6px', width: s.done ? '100%' : '60%', backgroundColor: s.done ? 'rgba(44,110,73,0.6)' : 'rgba(255,255,255,0.1)', borderRadius: '3px', transition: 'all 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '9px', fontFamily: 'var(--font-body)', color: s.done ? '#2C6E49' : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', transition: 'color 0.4s ease' }}>
              {s.done ? '✓' : '...'}
            </div>
          </div>
        ))}
        {/* Progress bar */}
        <div style={{ marginTop: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((step + 1) / 3) * 100}%`, backgroundColor: '#2C6E49', borderRadius: '4px', transition: 'width 0.5s ease' }} />
        </div>
      </div>
    </div>
  )
}

/* ---- 5. Maintenance: Uptime monitor ---- */
function MaintenanceMockup() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const bars = Array.from({ length: 24 }, (_, i) => ({
    up: Math.random() > 0.08,
    height: 60 + Math.random() * 40,
  }))

  const services = [
    { name: 'Website',    status: 'Operational', ms: '142ms' },
    { name: 'SSL Cert',   status: 'Valid',        ms: '—'     },
    { name: 'Backups',    status: 'Up to date',   ms: '—'     },
  ]

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>System Status — All Operational</div>
        <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C840', boxShadow: `0 0 ${tick % 2 === 0 ? 4 : 6}px #28C840`, transition: 'box-shadow 0.5s ease' }} />
      </div>
      <div style={{ height: '150px', backgroundColor: '#0d1117', padding: '12px' }}>
        {/* Uptime bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '40px', marginBottom: '10px' }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, height: `${b.height}%`, backgroundColor: b.up ? '#2C6E49' : '#FF5F57', borderRadius: '1px', opacity: 0.8 }} />
          ))}
        </div>
        {/* Service rows */}
        {services.map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>{s.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>{s.ms}</div>
              <div style={{ fontSize: '9px', color: '#2C6E49', fontFamily: 'var(--font-body)' }}>{s.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---- 6. Consultation: Roadmap ---- */
function ConsultationMockup() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % 4), 1800)
    return () => clearInterval(t)
  }, [])

  const phases = [
    { label: 'Tech Audit',    color: '#FF6B35' },
    { label: 'Gap Analysis',  color: '#C9A84C' },
    { label: 'Roadmap',       color: '#3A5F8A' },
    { label: 'Execution',     color: '#2C6E49' },
  ]

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>Digital Roadmap</div>
      </div>
      <div style={{ height: '150px', backgroundColor: '#0d1117', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
        {phases.map((phase, i) => (
          <div key={phase.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Step circle */}
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: i <= active ? phase.color : 'rgba(255,255,255,0.06)',
              border: `1px solid ${i <= active ? phase.color : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.4s ease',
            }}>
              <span style={{ fontSize: '8px', color: i <= active ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>{i + 1}</span>
            </div>
            {/* Bar */}
            <div style={{ flex: 1, height: '5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: i <= active ? '100%' : '0%', backgroundColor: phase.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '9px', fontFamily: 'var(--font-body)', color: i <= active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', transition: 'color 0.4s ease' }}>
              {phase.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   SERVICE DATA
   ============================================ */
const services = [
  { icon: Globe,         title: 'Web Design & Development',       description: 'Business websites, landing pages, portfolios, and e-commerce stores built to convert.',                          mockup: <WebMockup /> },
  { icon: Smartphone,    title: 'Mobile & Web App Development',   description: 'Custom tools, booking systems, CRMs, and web apps tailored to your workflow.',                                   mockup: <AppMockup /> },
  { icon: BarChart2,     title: 'Data Analytics & BI Dashboards', description: 'Automated reports and live dashboards that turn your business data into clear decisions.',                       mockup: <AnalyticsMockup /> },
  { icon: Building2,     title: 'Business Setup',                 description: 'Domain, hosting, and Google Workspace email — everything configured and ready to go.',                           mockup: <SetupMockup /> },
  { icon: Wrench,        title: 'Maintenance & Retainer Plans',   description: 'Monthly support so your digital products stay fast, secure, and up to date.',                                    mockup: <MaintenanceMockup /> },
  { icon: MessageSquare, title: 'Digital Consultation',           description: 'Tech audits and digital roadmaps to help you make the right decisions from the start.',                          mockup: <ConsultationMockup /> },
]

/* ============================================
   SERVICE CARD
   ============================================ */
function ServiceCard({ service }: { service: typeof services[0] }) {
  const [hovered, setHovered] = useState(false)
  const Icon = service.icon

  return (
    <div
      className="card-animated"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#1C1C2E',
        borderRadius:    '12px',
        padding:         '24px',
        border:          hovered ? '1px solid rgba(255,107,53,0.4)' : '1px solid rgba(255,255,255,0.06)',
        transition:      'border-color 0.25s ease, transform 0.25s ease',
        transform:       hovered ? 'translateY(-4px)' : 'translateY(0)',
        display:         'flex',
        flexDirection:   'column',
        gap:             '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '9px', flexShrink: 0,
          backgroundColor: hovered ? 'rgba(255,107,53,0.15)' : 'rgba(255,107,53,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.25s ease',
        }}>
          <Icon size={18} color="#FF6B35" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
          {service.title}
        </h3>
      </div>

      {/* Mockup */}
      {service.mockup}

      {/* Description */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, flexGrow: 1 }}>
        {service.description}
      </p>

      {/* Link */}
      <Link href="/services" style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
        color: hovered ? '#FF6B35' : 'rgba(255,255,255,0.3)',
        textDecoration: 'none', transition: 'color 0.25s ease',
      }}>
        Learn More <ArrowRight size={12} />
      </Link>
    </div>
  )
}

/* ============================================
   SECTION
   ============================================ */
export default function ServicesOverview() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="section-overlay" style={{ backgroundColor: '#0D1B3E', padding: isMobile ? '60px 24px' : '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <span className="section-label" style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '12px',
              fontWeight:    500,
              color:         '#FF6B35',
              textTransform: 'uppercase',
            }}>
              What We Do
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: isMobile ? '28px' : '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, maxWidth: '480px' }}>
              Everything Your Business Needs, Under One Roof
            </h2>
          </div>
          {!isMobile && (
            <Link className="cta-pulse" href="/services" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500,
              color: '#ffffff', textDecoration: 'none',
              backgroundColor: '#FF6B35', border: 'none', padding: '10px 20px', borderRadius: '6px',
              whiteSpace: 'nowrap', transition: 'border-color 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A5F8A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(58,95,138,0.6)')}
            >
              View All Services <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
          {services.map((service) => <ServiceCard key={service.title} service={service} />)}
        </div>

        {/* Mobile CTA */}
        {isMobile && (
          <div style={{ marginTop: '36px', textAlign: 'center' }}>
            <Link className="cta-pulse" href="/services" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#FF6B35', color: '#ffffff',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '15px',
              padding: '13px 28px', borderRadius: '6px', textDecoration: 'none',
            }}>
              View All Services <ArrowRight size={15} />
            </Link>
          </div>
        )}

      </div>
    </section>
  )
}