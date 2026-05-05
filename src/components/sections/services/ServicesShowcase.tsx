/* ============================================
   SERVICES SHOWCASE
   - Sticky scroll — each service pins while
     content and mockup animate in
   - Left: text content
   - Right: animated mockup
   ============================================ */
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Globe, Smartphone, BarChart2,
  Building2, Wrench, MessageSquare, ArrowRight,
} from 'lucide-react'

/* ============================================
   MOCKUP COMPONENTS (reused from home)
   ============================================ */

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
    <div style={{ width: '100%' }}>
      <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
            stackworkhq.com/projects
          </div>
        </div>
        <div style={{ height: '220px', backgroundColor: slide.color, padding: '20px', opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '8px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              {[40,40,40].map((w,i) => <div key={i} style={{ width: w, height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px' }} />)}
            </div>
          </div>
          <div style={{ width: '65%', height: '14px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '6px', marginBottom: '10px' }} />
          <div style={{ width: '45%', height: '10px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '4px', marginBottom: '20px' }} />
          <div style={{ width: '100px', height: '32px', backgroundColor: slide.accent, borderRadius: '6px', opacity: 0.9 }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '14px', fontSize: '10px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.25)' }}>{slide.label}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
        {webSlides.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: active === i ? '20px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: active === i ? '#FF6B35' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

function AppMockup() {
  const [active, setActive] = useState(0)
  const slides = [
    { bars: [60,80,45,90,55], color: '#FF6B35' },
    { bars: [75,50,85,40,70], color: '#3A5F8A' },
    { bars: [40,90,60,75,50], color: '#C9A84C' },
  ]

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 2800)
    return () => clearInterval(t)
  }, [])

  const slide = slides[active]

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>App Preview</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
      </div>
      <div style={{ height: '220px', backgroundColor: '#0d1117', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ width: '80px', height: '8px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px' }} />
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: slide.color, opacity: 0.8, transition: 'background-color 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px', border: `1px solid ${slide.color}30` }}>
              <div style={{ width: '100%', height: '6px', backgroundColor: slide.color, borderRadius: '3px', opacity: 0.6, marginBottom: '5px', transition: 'background-color 0.4s ease' }} />
              <div style={{ width: '60%', height: '5px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '3px' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '60px' }}>
          {slide.bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: slide.color, borderRadius: '4px 4px 0 0', opacity: 0.7, transition: 'all 0.4s ease' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsMockup() {
  const [active, setActive] = useState(0)
  const slides = [
    { label: 'Sales Dashboard',   line: [30,45,35,60,50,75,65,80], color: '#2C6E49' },
    { label: 'Operations Report', line: [50,40,65,45,70,55,80,60], color: '#3A5F8A' },
    { label: 'BI Dashboard',      line: [20,55,40,70,45,85,60,90], color: '#C9A84C' },
  ]

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 3000)
    return () => clearInterval(t)
  }, [])

  const slide = slides[active]
  const max   = Math.max(...slide.line)
  const points = slide.line.map((v, i) => `${(i / (slide.line.length - 1)) * 260},${70 - (v / max) * 60}`).join(' ')

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>
          {slide.label}
        </div>
      </div>
      <div style={{ height: '220px', backgroundColor: '#0d1117', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {['Revenue','Users','Orders'].map(k => (
            <div key={k} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px', borderLeft: `2px solid ${slide.color}` }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>{k}</div>
              <div style={{ width: '70%', height: '7px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }} />
            </div>
          ))}
        </div>
        <svg viewBox="0 0 260 74" style={{ width: '100%', height: '90px' }}>
          <defs>
            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={slide.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={slide.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={points} fill="none" stroke={slide.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points={`0,70 ${points} 260,70`} fill="url(#ag)" />
        </svg>
      </div>
    </div>
  )
}

function SetupMockup() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep(p => (p + 1) % 3), 2000)
    return () => clearInterval(t)
  }, [])

  const steps = [
    { label: 'Domain Registered',     done: true      },
    { label: 'Hosting Configured',    done: step >= 1  },
    { label: 'Google Workspace Live', done: step >= 2  },
  ]

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>Business Setup Progress</div>
      </div>
      <div style={{ height: '220px', backgroundColor: '#0d1117', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px' }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: s.done ? '#2C6E49' : 'rgba(255,255,255,0.08)',
              border: s.done ? 'none' : '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s ease',
            }}>
              {s.done && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />}
            </div>
            <div style={{ flex: 1, height: '7px', backgroundColor: s.done ? 'rgba(44,110,73,0.5)' : 'rgba(255,255,255,0.08)', borderRadius: '4px', transition: 'all 0.4s ease' }} />
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: s.done ? '#2C6E49' : 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', transition: 'color 0.4s ease' }}>
              {s.done ? '✓ Done' : '...'}
            </div>
          </div>
        ))}
        <div style={{ marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((step + 1) / 3) * 100}%`, backgroundColor: '#2C6E49', borderRadius: '4px', transition: 'width 0.5s ease' }} />
        </div>
      </div>
    </div>
  )
}

function MaintenanceMockup() {
  const [tick, setTick]   = useState(0)
  const [bars, setBars]   = useState<{up:boolean;height:number}[]>([])
  const [uptime, setUptime] = useState(99.98)

  useEffect(() => {
    setBars(Array.from({ length: 28 }, () => ({ up: Math.random() > 0.04, height: 50 + Math.random() * 50 })))
  }, [])

  useEffect(() => {
    const t = setInterval(() => { setTick(p => p + 1); setUptime(99.95 + Math.random() * 0.05) }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ flex: 1, fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>System Status</div>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#28C840', boxShadow: `0 0 ${tick % 2 === 0 ? 4 : 8}px #28C840`, transition: 'box-shadow 0.5s ease' }} />
      </div>
      <div style={{ height: '220px', backgroundColor: '#0d1117', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>30-day uptime</span>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#FF6B35' }}>{uptime.toFixed(2)}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px', marginBottom: '14px' }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, height: `${b.height}%`, backgroundColor: b.up ? '#2C6E49' : '#FF5F57', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
          ))}
        </div>
        {['Website','SSL Cert','Backups'].map(s => (
          <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>{s}</span>
            <span style={{ fontSize: '10px', color: '#2C6E49', fontFamily: 'var(--font-body)' }}>Operational</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConsultationMockup() {
  const [active, setActive] = useState(0)
  const phases = [
    { label: 'Tech Audit',   color: '#FF6B35' },
    { label: 'Gap Analysis', color: '#C9A84C' },
    { label: 'Roadmap',      color: '#3A5F8A' },
    { label: 'Execution',    color: '#2C6E49' },
  ]

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % 4), 1600)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>Digital Roadmap</div>
      </div>
      <div style={{ height: '220px', backgroundColor: '#0d1117', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
        {phases.map((phase, i) => (
          <div key={phase.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: i <= active ? phase.color : 'rgba(255,255,255,0.06)',
              border: `1px solid ${i <= active ? phase.color : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s ease',
            }}>
              <span style={{ fontSize: '9px', color: i <= active ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{i + 1}</span>
            </div>
            <div style={{ flex: 1, height: '5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: i <= active ? '100%' : '0%', backgroundColor: phase.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: i <= active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', transition: 'color 0.4s ease', minWidth: '80px' }}>
              {phase.label}
            </span>
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
  {
    icon:     Globe,
    title:    'Web Design & Development',
    tagline:  'Your digital storefront, built to convert',
    color:    '#FF6B35',
    includes: ['Business websites & landing pages', 'E-commerce stores', 'Portfolio sites', 'Mobile-responsive design', 'SEO foundation built-in', 'CMS integration'],
    ideal:    'Restaurants, retail brands, clinics, coaches, real estate agencies',
    mockup:   <WebMockup />,
  },
  {
    icon:     Smartphone,
    title:    'Mobile & Web App Development',
    tagline:  'Custom tools that run your operations',
    color:    '#00D4FF',
    includes: ['Custom web applications', 'Booking & appointment systems', 'CRM & client portals', 'Internal business tools', 'API integrations', 'Admin dashboards'],
    ideal:    'Service businesses, logistics companies, healthcare providers',
    mockup:   <AppMockup />,
  },
  {
    icon:     BarChart2,
    title:    'Data Analytics & BI Dashboards',
    tagline:  'Turn your data into decisions',
    color:    '#2C6E49',
    includes: ['Power BI & custom dashboards', 'Automated reporting', 'Sales & operations analytics', 'KPI tracking systems', 'Data cleaning & structuring', 'Daily business intelligence'],
    ideal:    'SMBs wanting visibility into sales, operations, or customer behavior',
    mockup:   <AnalyticsMockup />,
  },
  {
    icon:     Building2,
    title:    'Business Setup',
    tagline:  'Get your digital foundation right',
    color:    '#C9A84C',
    includes: ['Domain registration & DNS', 'Web hosting configuration', 'Google Workspace email setup', 'SSL certificates', 'Business profile setup', 'Basic security hardening'],
    ideal:    'New businesses or existing ones that need their digital base properly set up',
    mockup:   <SetupMockup />,
  },
  {
    icon:     Wrench,
    title:    'Maintenance & Retainer Plans',
    tagline:  'We stay after everyone else leaves',
    color:    '#8B5CF6',
    includes: ['Monthly updates & backups', 'Security monitoring', 'Performance optimization', 'Content updates', 'Bug fixes & patches', 'Priority support'],
    ideal:    'Businesses that want a long-term digital partner, not a one-time vendor',
    mockup:   <MaintenanceMockup />,
  },
  {
    icon:     MessageSquare,
    title:    'Digital Consultation',
    tagline:  'Clarity before commitment',
    color:    '#FF6B35',
    includes: ['Tech stack audit', 'Digital presence review', 'Competitor analysis', 'Roadmap planning', 'Vendor evaluation', 'Strategic recommendations'],
    ideal:    'Business owners unsure where to start or how to fix what is not working',
    mockup:   <ConsultationMockup />,
  },
]

/* ============================================
   SINGLE SERVICE PANEL
   ============================================ */
function ServicePanel({ service, index }: { service: typeof services[0]; index: number }) {
  const [inView,   setInView]   = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ref                     = useRef<HTMLDivElement>(null)
  const Icon                    = service.icon

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); else setInView(false) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        padding:   isMobile ? '60px 24px' : '80px 60px',
        display:   'grid',
        gridTemplateColumns: isMobile ? '1fr' : index % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
        gap:       isMobile ? '40px' : '80px',
        alignItems: 'center',
        opacity:   inView ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* ---- Text side ---- */}
      <div
        style={{
          order:     isMobile ? 1 : index % 2 === 0 ? 1 : 2,
          transform: inView ? 'translateX(0)' : index % 2 === 0 ? 'translateX(-40px)' : 'translateX(40px)',
          transition: 'transform 0.6s ease, opacity 0.6s ease',
          opacity:   inView ? 1 : 0,
        }}
      >
        {/* Icon + number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width:           '52px',
            height:          '52px',
            borderRadius:    '12px',
            backgroundColor: `${service.color}15`,
            border:          `1px solid ${service.color}30`,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}>
            <Icon size={24} color={service.color} />
          </div>
          <span style={{
            fontFamily:      'var(--font-heading)',
            fontSize:        '13px',
            color:           service.color,
            backgroundColor: `${service.color}10`,
            border:          `1px solid ${service.color}25`,
            borderRadius:    '100px',
            padding:         '3px 12px',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h2 style={{
          fontFamily:   'var(--font-heading)',
          fontSize:     isMobile ? '28px' : '40px',
          fontWeight:   700,
          color:        '#ffffff',
          lineHeight:   1.15,
          marginBottom: '10px',
        }}>
          {service.title}
        </h2>

        <p style={{
          fontFamily:   'var(--font-body)',
          fontSize:     '17px',
          color:        service.color,
          marginBottom: '28px',
          fontWeight:   500,
        }}>
          {service.tagline}
        </p>

        {/* What's included */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
            What's Included
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {service.includes.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: service.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal for */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius:    '8px',
          padding:         '12px 16px',
          border:          '1px solid rgba(255,255,255,0.07)',
          marginBottom:    '28px',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Ideal For —{' '}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            {service.ideal}
          </span>
        </div>

        <Link href="/contact" className="cta-pulse" style={{
          display:         'inline-flex',
          alignItems:      'center',
          gap:             '8px',
          backgroundColor: service.color,
          color:           '#ffffff',
          fontFamily:      'var(--font-body)',
          fontWeight:      500,
          fontSize:        '15px',
          padding:         '12px 28px',
          borderRadius:    '6px',
          textDecoration:  'none',
        }}>
          Get a Quote <ArrowRight size={15} />
        </Link>
      </div>

      {/* ---- Mockup side ---- */}
      <div
        style={{
          order:     isMobile ? 2 : index % 2 === 0 ? 2 : 1,
          transform: inView ? 'translateX(0)' : index % 2 === 0 ? 'translateX(40px)' : 'translateX(-40px)',
          transition: 'transform 0.6s ease 0.1s, opacity 0.6s ease 0.1s',
          opacity:   inView ? 1 : 0,
        }}
      >
        {/* Glow border frame */}
        <div style={{
          borderRadius: '16px',
          padding:      '2px',
          background:   `linear-gradient(135deg, ${service.color}40, transparent, ${service.color}20)`,
        }}>
          <div style={{
            backgroundColor: 'rgba(8,11,20,0.8)',
            borderRadius:    '14px',
            padding:         '20px',
          }}>
            {service.mockup}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   MAIN SECTION
   ============================================ */
export default function ServicesShowcase() {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {services.map((service, i) => (
        <div key={service.title}>
          <ServicePanel service={service} index={i} />
          {i < services.length - 1 && <hr className="section-glow-line" />}
        </div>
      ))}
    </section>
  )
}