/* ============================================
   SERVICES SHOWCASE
   - Vertically stacked, text top mockup below
   - Each service centered
   - Alternating accent colors
   - Real content per service
   ============================================ */
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Globe, Smartphone, BarChart2,
  Building2, Wrench, ArrowRight,
} from 'lucide-react'

/* ============================================
   MOCKUP COMPONENTS
   ============================================ */

const webSlides = [
  { label: 'Restaurant Website',  color: '#1a1a2e', accent: '#FF6B35' },
  { label: 'Real Estate Portal',  color: '#0d2137', accent: '#3A5F8A' },
  { label: 'E-Commerce Store',    color: '#1a0d2e', accent: '#C9A84C' },
]

function WebMockup() {
  const [loaded, setLoaded]     = useState([false, false, false])
  const [isMobile, setIsMobile] = useState(false)

  const sites = [
    { label: 'Ember & Ash',         subtitle: 'Restaurant',   url: 'https://ember-ash-zeta.vercel.app/' },
    { label: 'Meridian Properties', subtitle: 'Real Estate',  url: 'https://meridian-properties-eta.vercel.app/' },
    { label: 'Maison Céleste',      subtitle: 'Luxury Brand', url: 'https://maison-celeste.vercel.app/' },
  ]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap:                 '12px',
      width:               '100%',
    }}>
      {sites.map((site, i) => (
        <div key={site.url} style={{
          backgroundColor: '#0f0f1a',
          borderRadius:    '10px',
          overflow:        'hidden',
          border:          '1px solid rgba(255,255,255,0.08)',
          display:         'flex',
          flexDirection:   'column',
        }}>
          {/* Browser bar */}
          <div style={{
            backgroundColor: '#0a0a14',
            padding:         '7px 10px',
            display:         'flex',
            alignItems:      'center',
            gap:             '7px',
            borderBottom:    '1px solid rgba(255,255,255,0.06)',
            flexShrink:      0,
          }}>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
              ))}
            </div>
            <div style={{
              flex:            1,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius:    '3px',
              padding:         '2px 6px',
              fontSize:        '9px',
              fontFamily:      'var(--font-body)',
              color:           'rgba(255,255,255,0.3)',
              overflow:        'hidden',
              textOverflow:    'ellipsis',
              whiteSpace:      'nowrap',
            }}>
              {site.url.replace('https://', '')}
            </div>
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily:     'var(--font-body)',
                fontSize:       '9px',
                color:          '#FF6B35',
                textDecoration: 'none',
                border:         '1px solid rgba(255,107,53,0.3)',
                borderRadius:   '3px',
                padding:        '2px 7px',
                whiteSpace:     'nowrap',
                flexShrink:     0,
              }}
            >
              Visit ↗
            </a>
          </div>

          {/* Wide landscape iframe */}
          <div style={{
            position:        'relative',
            width:           '100%',
            height:          '180px',
            overflow:        'hidden',
            backgroundColor: '#080b14',
            flexShrink:      0,
          }}>
            {!loaded[i] && (
              <div style={{
                position:        'absolute',
                inset:           0,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                backgroundColor: '#080b14',
                zIndex:          2,
              }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  Loading preview...
                </span>
              </div>
            )}
            <iframe
              src={site.url}
              style={{
                width:           '167%',
                height:          '167%',
                border:          'none',
                transform:       'scale(0.6)',
                transformOrigin: 'top left',
                pointerEvents:   'none',
                opacity:         loaded[i] ? 1 : 0,
                transition:      'opacity 0.5s ease',
              }}
              onLoad={() => {
                const updated = [...loaded]
                updated[i]   = true
                setLoaded(updated)
              }}
              title={site.label}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          {/* Label */}
          <div style={{
            padding:        '8px 12px',
            borderTop:      '1px solid rgba(255,255,255,0.06)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: '#ffffff' }}>
                {site.label}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                {site.subtitle}
              </div>
            </div>
            <span style={{
              fontFamily:      'var(--font-body)',
              fontSize:        '9px',
              color:           '#28C840',
              backgroundColor: 'rgba(40,200,64,0.08)',
              border:          '1px solid rgba(40,200,64,0.2)',
              borderRadius:    '100px',
              padding:         '2px 8px',
            }}>
              ● Live
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function AppMockup() {
  const [active, setActive] = useState(0)
  const slides = [
    { label: 'Booking System',  bars: [60,80,45,90,55], color: '#FF6B35' },
    { label: 'Client Portal',   bars: [75,50,85,40,70], color: '#3A5F8A' },
    { label: 'Custom Web Tool', bars: [40,90,60,75,50], color: '#C9A84C' },
  ]

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 2800)
    return () => clearInterval(t)
  }, [])

  const slide = slides[active]

  return (
    <div>
      <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)' }}>{slide.label}</div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
          </div>
        </div>
        <div style={{ height: '260px', backgroundColor: '#0d1117', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ width: '90px', height: '9px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px' }} />
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: slide.color, opacity: 0.8, transition: 'background-color 0.4s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px', border: `1px solid ${slide.color}30` }}>
                <div style={{ width: '100%', height: '7px', backgroundColor: slide.color, borderRadius: '3px', opacity: 0.6, marginBottom: '6px', transition: 'background-color 0.4s ease' }} />
                <div style={{ width: '60%', height: '5px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '3px' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
            {slide.bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: slide.color, borderRadius: '4px 4px 0 0', opacity: 0.7, transition: 'all 0.4s ease' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: active === i ? '22px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: active === i ? '#FF6B35' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

function AnalyticsMockup() {
  const [active, setActive] = useState(0)
  const slides = [
    { label: 'Sales Dashboard',   line: [30,45,35,60,50,75,65,80], color: '#2C6E49' },
    { label: 'HR Analytics',      line: [50,40,65,45,70,55,80,60], color: '#3A5F8A' },
    { label: 'Operations BI',     line: [20,55,40,70,45,85,60,90], color: '#C9A84C' },
  ]

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 3000)
    return () => clearInterval(t)
  }, [])

  const slide = slides[active]
  const max   = Math.max(...slide.line)
  const points = slide.line.map((v, i) => `${(i / (slide.line.length - 1)) * 500},${120 - (v / max) * 100}`).join(' ')

  return (
    <div>
      <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>
            {slide.label}
          </div>
        </div>
        <div style={{ height: '260px', backgroundColor: '#0d1117', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            {['Revenue','Users','Growth'].map(k => (
              <div key={k} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px', borderLeft: `3px solid ${slide.color}` }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', marginBottom: '5px' }}>{k}</div>
                <div style={{ width: '70%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }} />
              </div>
            ))}
          </div>
          <svg viewBox="0 0 500 130" style={{ width: '100%', height: '130px' }}>
            <defs>
              <linearGradient id={`ag${active}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={slide.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={slide.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points={points} fill="none" stroke={slide.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points={`0,120 ${points} 500,120`} fill={`url(#ag${active})`} />
          </svg>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: active === i ? '22px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: active === i ? '#FF6B35' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

function SetupMockup() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep(p => p < 4 ? p + 1 : 0), 1800)
    return () => clearInterval(t)
  }, [])

  const steps = [
    { label: 'Domain Registered',      color: '#FF6B35' },
    { label: 'Hosting Configured',     color: '#00D4FF' },
    { label: 'SSL Certificate Active', color: '#2C6E49' },
    { label: 'Google Workspace Live',  color: '#C9A84C' },
    { label: 'Business Email Ready',   color: '#8B5CF6' },
  ]

  return (
    <div style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ backgroundColor: '#0a0a14', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>Business Setup Progress</div>
      </div>
      <div style={{ height: '260px', backgroundColor: '#0d1117', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: i <= step ? s.color : 'rgba(255,255,255,0.06)',
              border: `1px solid ${i <= step ? s.color : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.4s ease',
              boxShadow: i <= step ? `0 0 10px ${s.color}50` : 'none',
            }}>
              {i <= step && <span style={{ fontSize: '12px', color: '#fff' }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: i <= step ? '100%' : '0%', backgroundColor: s.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: i <= step ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', minWidth: '160px', transition: 'color 0.4s ease' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MaintenanceMockup() {
  const [tick, setTick]     = useState(0)
  const [bars, setBars]     = useState<{up:boolean;height:number}[]>([])
  const [uptime, setUptime] = useState(99.98)

  useEffect(() => {
    setBars(Array.from({ length: 30 }, () => ({ up: Math.random() > 0.04, height: 50 + Math.random() * 50 })))
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
        <div style={{ flex: 1, fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)' }}>System Status — All Operational</div>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#28C840', boxShadow: `0 0 ${tick % 2 === 0 ? 4 : 8}px #28C840`, transition: 'box-shadow 0.5s ease' }} />
      </div>
      <div style={{ height: '260px', backgroundColor: '#0d1117', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>30-day uptime</span>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#FF6B35', fontWeight: 700 }}>{uptime.toFixed(2)}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px', marginBottom: '20px' }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, height: `${b.height}%`, backgroundColor: b.up ? '#2C6E49' : '#FF5F57', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
          ))}
        </div>
        {['Website Performance','SSL Certificate','Daily Backups','Security Scan','Content Updates'].map((s, i) => (
          <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>{s}</span>
            <span style={{ fontSize: '10px', color: '#2C6E49', fontFamily: 'var(--font-body)' }}>✓ Active</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   SERVICE DATA — 5 services, no consultation
   ============================================ */
const services = [
  {
    icon:     Globe,
    title:    'Web Design & Development',
    tagline:  'Your digital storefront, built to convert',
    color:    '#FF6B35',
    number:   '01',
    includes: [
      'Business websites & landing pages',
      'E-commerce stores',
      'Portfolio & personal brand sites',
      'Mobile-responsive across all devices',
      'SEO foundation built-in',
      'Fast loading & performance optimised',
      'CMS integration for easy content updates',
      'Post-launch support included',
    ],
    ideal: 'Restaurants, retail brands, clinics, coaches, real estate agencies, logistics companies',
    mockup: <WebMockup />,
  },
  {
    icon:     Smartphone,
    title:    'Mobile & Web App Development',
    tagline:  'Custom tools that run your operations',
    color:    '#00D4FF',
    number:   '02',
    includes: [
      'Custom web applications',
      'Booking & appointment systems',
      'Client portals & CRM tools',
      'Internal business dashboards',
      'Native mobile apps (iOS & Android)',
      'API integrations with third-party tools',
      'Admin panels & management systems',
      'Scalable architecture from day one',
    ],
    ideal: 'Service businesses, healthcare providers, logistics, education, hospitality',
    mockup: <AppMockup />,
  },
  {
    icon:     BarChart2,
    title:    'Data Analytics & BI Dashboards',
    tagline:  'Turn your raw data into real decisions',
    color:    '#2C6E49',
    number:   '03',
    includes: [
      'End-to-end data pipeline setup',
      'Data cleaning & transformation (Python, Pandas)',
      'Power BI dashboard development',
      'Excel & Power Query automation',
      'SQL database querying & reporting',
      'Sales, HR & operations analytics',
      'Automated scheduled reports',
      'KPI tracking & business intelligence',
    ],
    ideal: 'SMBs wanting visibility into sales, operations, HR, or customer behaviour',
    mockup: <AnalyticsMockup />,
  },
  {
    icon:     Building2,
    title:    'Business Setup',
    tagline:  'Get your digital foundation right from day one',
    color:    '#C9A84C',
    number:   '04',
    includes: [
      'Domain registration & DNS configuration',
      'Web hosting setup & management',
      'SSL certificate installation',
      'Google Workspace email setup',
      'Business profile on Google',
      'Basic security hardening',
      'Everything handed over with documentation',
      'Guidance on managing it yourself going forward',
    ],
    ideal: 'New businesses or existing ones without a proper digital base',
    mockup: <SetupMockup />,
  },
  {
    icon:     Wrench,
    title:    'Maintenance & Retainer Plans',
    tagline:  'We stay long after everyone else has left',
    color:    '#8B5CF6',
    number:   '05',
    includes: [
      'Monthly website updates & content changes',
      'Security monitoring & patches',
      'Daily or weekly automated backups',
      'Performance monitoring & optimisation',
      'Bug fixes & technical support',
      'Priority response within 24 hours',
      'Monthly health report',
      'Available for new feature additions',
    ],
    ideal: 'Businesses that want a long-term digital partner, not a one-time vendor',
    mockup: <MaintenanceMockup />,
  },
]

/* ============================================
   SINGLE SERVICE PANEL — stacked layout
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
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        padding:    isMobile ? '60px 24px' : '80px 60px',
        maxWidth:   '100%',
        margin:     '0 auto',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* ---- Top: Icon + number + title ---- */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width:           '56px',
            height:          '56px',
            borderRadius:    '14px',
            backgroundColor: `${service.color}15`,
            border:          `1px solid ${service.color}30`,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}>
            <Icon size={26} color={service.color} />
          </div>
          <span style={{
            fontFamily:      'var(--font-heading)',
            fontSize:        '13px',
            color:           service.color,
            backgroundColor: `${service.color}10`,
            border:          `1px solid ${service.color}25`,
            borderRadius:    '100px',
            padding:         '4px 14px',
            letterSpacing:   '1px',
          }}>
            {service.number}
          </span>
        </div>

        <h2 style={{
          fontFamily:   'var(--font-heading)',
          fontSize:     isMobile ? '28px' : '44px',
          fontWeight:   700,
          color:        '#ffffff',
          lineHeight:   1.15,
          marginBottom: '12px',
        }}>
          {service.title}
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   '18px',
          color:      service.color,
          fontWeight: 500,
          marginBottom: '0',
        }}>
          {service.tagline}
        </p>
      </div>

      {/* ---- Middle: Mockup ---- */}
      <div style={{
        borderRadius: '16px',
        padding:      '2px',
        background:   `linear-gradient(135deg, ${service.color}40, transparent, ${service.color}20)`,
        marginBottom: '40px',
      }}>
        <div style={{
          backgroundColor: 'rgba(8,11,20,0.8)',
          borderRadius:    '14px',
          padding:         isMobile ? '16px' : '24px',
        }}>
          {service.mockup}
        </div>
      </div>

      {/* ---- Bottom: Two columns — includes + ideal ---- */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap:                 '32px',
      }}>
        {/* What's included */}
        <div className="card-animated" style={{
          backgroundColor: 'rgba(13,27,62,0.5)',
          borderRadius:    '12px',
          padding:         '24px',
          border:          '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '11px',
            color:         'rgba(255,255,255,0.4)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom:  '16px',
          }}>
            What's Included
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {service.includes.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: service.color, flexShrink: 0, marginTop: '6px' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal for + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-animated" style={{
            backgroundColor: 'rgba(13,27,62,0.5)',
            borderRadius:    '12px',
            padding:         '24px',
            border:          `1px solid ${service.color}20`,
          }}>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '11px',
              color:         'rgba(255,255,255,0.4)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom:  '12px',
            }}>
              Ideal For
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              {service.ideal}
            </p>
          </div>

          <Link href="/contact" className="cta-pulse" style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             '10px',
            backgroundColor: service.color,
            color:           '#ffffff',
            fontFamily:      'var(--font-body)',
            fontWeight:      500,
            fontSize:        '15px',
            padding:         '14px 28px',
            borderRadius:    '6px',
            textDecoration:  'none',
          }}>
            Get a Free Quote for This Service <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   MAIN EXPORT
   ============================================ */
export default function ServicesShowcase() {
  return (
    <section style={{ width: '100%' }}>
      {services.map((service, i) => (
        <div key={service.title}>
          <ServicePanel service={service} index={i} />
          {i < services.length - 1 && <hr className="section-glow-line" />}
        </div>
      ))}
    </section>
  )
}