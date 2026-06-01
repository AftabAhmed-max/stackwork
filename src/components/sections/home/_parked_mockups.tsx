/* ============================================
   PARKED MOCKUPS — Home page
   Preserved for later use. Not imported anywhere
   yet (intentionally), so they no longer trigger
   "defined but never used" warnings in their
   original files.
   ============================================ */
'use client'

import { useState, useEffect, useRef } from 'react'

/* ---- Analytics: Dashboard mockup ---- */
const analyticsSlides = [
  { label: 'Sales Dashboard',   line: [30,45,35,60,50,75,65,80], color: '#2C6E49' },
  { label: 'Operations Report', line: [50,40,65,45,70,55,80,60], color: '#3A5F8A' },
  { label: 'BI Dashboard',      line: [20,55,40,70,45,85,60,90], color: '#C9A84C' },
]

export function AnalyticsMockup() {
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
            {['Revenue', 'Users', 'Orders'].map((k) => (
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

/* ---- Maintenance: Uptime monitor ---- */
export function MaintenanceMockup() {
  const [tick, setTick] = useState(0)
  const [bars, setBars] = useState<{ up: boolean; height: number }[]>([])

  useEffect(() => {
    setBars(Array.from({ length: 24 }, () => ({
      up:     Math.random() > 0.08,
      height: 60 + Math.random() * 40,
    })))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1000)
    return () => clearInterval(t)
  }, [])

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
