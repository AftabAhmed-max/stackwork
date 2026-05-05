/* ============================================
   PROBLEM SECTION
   - Desktop: 3 column grid
   - Mobile: accordion
   - Each card has a live animated metric
     visual — always moving
   ============================================ */
'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const problems = [
  {
    number:  '01',
    heading: 'No In-House Tech Team',
    body:    'You know your business needs a stronger digital presence but you have no developer, no designer, and no time to manage freelancers who disappear mid-project.',
    metric: {
      label:  'Team Availability',
      target: 0,
      unit:   '%',
      color:  '#FF5F57',
      status: 'CRITICAL',
    },
  },
  {
    number:  '02',
    heading: 'Wasted Money on Bad Vendors',
    body:    'You have paid for a website or app before and got something unusable, outdated, or abandoned. The result never matched what was promised.',
    metric: {
      label:  'Budget Recovered',
      target: 0,
      unit:   '%',
      color:  '#FEBC2E',
      status: 'WARNING',
    },
  },
  {
    number:  '03',
    heading: 'No Visibility Into Your Data',
    body:    'Your business generates data every day but you have no idea what is working, what is not, or where the money is going. Decisions are made on gut feel alone.',
    metric: {
      label:  'Data Clarity Score',
      target: 12,
      unit:   '%',
      color:  '#FF5F57',
      status: 'CRITICAL',
    },
  },
]

/* ---- Flatline / pulse chart ---- */
function PulseChart({ color, flatline }: { color: string; flatline: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef<number>(0)
  const tRef      = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.shadowColor = color
      ctx.shadowBlur = 4

      for (let x = 0; x < canvas.width; x++) {
        const t = tRef.current
        let y: number

        if (flatline) {
          /* flatline with occasional micro blip */
          const blip = Math.sin(t * 0.05) * 0.5
          y = canvas.height / 2 + blip
        } else {
          /* ECG-style pulse */
          const phase = ((x + t * 2) % canvas.width) / canvas.width
          if (phase > 0.45 && phase < 0.5) {
            y = canvas.height / 2 - Math.sin((phase - 0.45) / 0.05 * Math.PI) * 28
          } else if (phase > 0.5 && phase < 0.53) {
            y = canvas.height / 2 + Math.sin((phase - 0.5) / 0.03 * Math.PI) * 14
          } else {
            y = canvas.height / 2 + Math.sin(x * 0.08 + t * 0.03) * 1.5
          }
        }

        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      tRef.current++
      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [color, flatline])

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={56}
      style={{ width: '100%', height: '56px', display: 'block' }}
    />
  )
}

/* ---- Metric card visual ---- */
function MetricVisual({ metric, inView }: { metric: typeof problems[0]['metric']; inView: boolean }) {
  const [value, setValue]     = useState(metric.target)
  const [blink, setBlink]     = useState(false)

  /* Fluctuate value slightly to show "live" feel */
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      setValue(metric.target + Math.floor(Math.random() * 8))
      setBlink(p => !p)
    }, 1400)
    return () => clearInterval(t)
  }, [inView, metric.target])

  return (
    <div style={{
      backgroundColor: '#050a0f',
      borderRadius:    '8px',
      border:          '1px solid rgba(255,255,255,0.07)',
      overflow:        'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        backgroundColor: '#0a0f14',
        padding:         '6px 10px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        borderBottom:    '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: '17px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.5px' }}>
          {metric.label}
        </span>
        <span style={{
          fontFamily:      'monospace',
          fontSize:        '9px',
          color:           metric.color,
          backgroundColor: `${metric.color}18`,
          padding:         '1px 6px',
          borderRadius:    '3px',
          opacity:         blink ? 1 : 0.5,
          transition:      'opacity 0.4s ease',
        }}>
          ● {metric.status}
        </span>
      </div>

      {/* Value */}
      <div style={{ padding: '10px 12px 4px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        <span style={{
          fontFamily:  'monospace',
          fontSize:    '32px',
          fontWeight:  700,
          color:       metric.color,
          lineHeight:  1,
          transition:  'all 0.3s ease',
        }}>
          {value}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
          {metric.unit}
        </span>
      </div>

      {/* Pulse chart */}
      <div style={{ padding: '0 12px 10px' }}>
        <PulseChart color={metric.color} flatline={metric.target === 0} />
      </div>
    </div>
  )
}

/* ---- Individual problem card ---- */
function ProblemCard({ problem, index }: { problem: typeof problems[0]; index: number }) {
  const [isMobile, setIsMobile] = useState(false)
  const [opened,   setOpened]   = useState(false)
  const [inView,   setInView]   = useState(false)
  const ref                     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
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

  /* ---- Desktop ---- */
  if (!isMobile) return (
    <div className="card-animated" ref={ref} style={{
      backgroundColor: '#0D1B3E',
      borderRadius:    '12px',
      padding:         '32px 28px',
      border:          '1px solid rgba(255,255,255,0.06)',
      position:        'relative',
      overflow:        'hidden',
      display:         'flex',
      flexDirection:   'column',
      gap:             '20px',
      opacity:         inView ? 1 : 0,
      transform:       inView ? 'translateY(0)' : 'translateY(20px)',
      transition:      `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`,
    }}>
      <span style={{
        position: 'absolute', top: '16px', right: '20px',
        fontFamily: 'var(--font-heading)', fontSize: '56px', fontWeight: 700,
        color: 'rgba(255,107,53,0.06)', lineHeight: 1, userSelect: 'none',
      }}>
        {problem.number}
      </span>

      <div style={{ width: '28px', height: '3px', backgroundColor: '#FF6B35', borderRadius: '2px' }} />

      <h3 style={{
        fontFamily:  'var(--font-heading)',
        fontSize:    '17px',
        fontWeight:  700,
        color:       '#ffffff',
        lineHeight:  1.3,
        whiteSpace:  'nowrap',
      }}>
        {problem.heading}
      </h3>

      {inView && <MetricVisual metric={problem.metric} inView={inView} />}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
        {problem.body}
      </p>
    </div>
  )

  /* ---- Mobile accordion ---- */
  return (
    <div className="card-animated" ref={ref} style={{
      backgroundColor: '#0D1B3E',
      borderRadius:    '12px',
      border:          '1px solid rgba(255,255,255,0.06)',
      overflow:        'hidden',
    }}>
      <button onClick={() => setOpened(p => !p)} style={{
        width: '100%', background: 'none', border: 'none',
        padding: '18px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', cursor: 'pointer', gap: '12px',
        touchAction: 'manipulation',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#ffffff', textAlign: 'left' }}>
            {problem.heading}
          </span>
        </div>
        <ChevronDown size={16} color="#FF6B35" style={{ flexShrink: 0, transform: opened ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
      </button>

      {opened && (
        <div style={{ padding: '0 20px 20px' }}>
          <MetricVisual metric={problem.metric} inView={true} />
          <p style={{ marginTop: '14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            {problem.body}
          </p>
        </div>
      )}
    </div>
  )
}

export default function ProblemSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="section-overlay" style={{ backgroundColor: 'transparent', padding: isMobile ? '60px 24px' : '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px', maxWidth: '560px' }}>
          <span className="section-label" style={{
            fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500,
            color: '#FF6B35', textTransform: 'uppercase',
          }}>
            Sound Familiar?
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   isMobile ? '28px' : '42px',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.2,
          }}>
            Running a Business is Hard Enough Without Digital Problems
          </h2>
        </div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap:                 '24px',
        }}>
          {problems.map((p, i) => (
            <ProblemCard key={p.number} problem={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}