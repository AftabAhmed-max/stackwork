/* ============================================
   PARKED MOCKUPS — Services page
   Preserved for later use. Not imported anywhere
   yet (intentionally), so they no longer trigger
   "defined but never used" warnings in their
   original files.
   ============================================ */
'use client'

import { useEffect, useState } from 'react'

export function AnalyticsMockup() {
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

export function SetupMockup() {
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

export function MaintenanceMockup() {
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
        {['Website Performance','SSL Certificate','Daily Backups','Security Scan','Content Updates'].map((s) => (
          <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>{s}</span>
            <span style={{ fontSize: '10px', color: '#2C6E49', fontFamily: 'var(--font-body)' }}>✓ Active</span>
          </div>
        ))}
      </div>
    </div>
  )
}
