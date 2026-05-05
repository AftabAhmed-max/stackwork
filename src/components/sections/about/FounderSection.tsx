/* ============================================
   FOUNDER SECTION
   - Left: hologram animated figure
   - Right: founder story + credentials
   ============================================ */
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'


/* ---- Credential badge ---- */
function Badge({ text, color = '#FF6B35' }: { text: string; color?: string }) {
  return (
    <span style={{
      display:         'inline-flex',
      alignItems:      'center',
      gap:             '6px',
      backgroundColor: `${color}12`,
      border:          `1px solid ${color}30`,
      borderRadius:    '100px',
      padding:         '4px 14px',
      fontFamily:      'var(--font-body)',
      fontSize:        '12px',
      color:           color,
      whiteSpace:      'nowrap' as const,
    }}>
      {text}
    </span>
  )
}

export default function FounderSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{ padding: isMobile ? '60px 24px' : '80px 60px' }}>
      <div style={{
        maxWidth:            '1200px',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
        gap:                 isMobile ? '48px' : '80px',
        alignItems:          'center',
      }}>

        {/* ---- Left: Hologram figure ---- */}
        <div style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '16px',
        }}>
          {/* Founder illustration */}
          <div style={{
            position:     'relative',
            borderRadius: '16px',
            padding:      '2px',
            background:   'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(255,107,53,0.3), rgba(139,92,246,0.3))',
          }}>
            <div style={{
              backgroundColor: 'rgba(8,11,20,0.6)',
              borderRadius:    '14px',
              overflow:        'hidden',
              display:         'flex',
              alignItems:      'flex-end',
              justifyContent:  'center',
              minHeight:       '380px',
            }}>
              <Image
                src="/images/founder-avatar.png"
                alt="Aftab Ahmed — Founder, Stackwork"
                width={320}
                height={400}
                style={{
                  objectFit:     'contain',
                  objectPosition: 'bottom',
                  filter:        'drop-shadow(0 0 20px rgba(0,212,255,0.2))',
                }}
                priority
              />
            </div>
          </div>

          {/* Name tag */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily:  'var(--font-heading)',
              fontSize:    '20px',
              fontWeight:  700,
              color:       '#ffffff',
              marginBottom: '4px',
            }}>
              Aftab Ahmed
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '13px',
              color:      '#00D4FF',
              letterSpacing: '1px',
            }}>
              Founder — Stackwork
            </div>
          </div>
        </div>

        {/* ---- Right: Story ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          <div>
            <span className="section-label" style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              fontWeight: 500, color: '#FF6B35', textTransform: 'uppercase',
            }}>
              The Story
            </span>
            <h2 style={{
              fontFamily:   'var(--font-heading)',
              fontSize:     isMobile ? '28px' : '40px',
              fontWeight:   700,
              color:        '#ffffff',
              lineHeight:   1.2,
              marginBottom: '20px',
            }}>
              From Enterprise to{' '}
              <span style={{ color: '#FF6B35' }}>Empowering SMBs</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '16px',
              color:      'rgba(255,255,255,0.65)',
              lineHeight: 1.8,
              marginBottom: '16px',
            }}>
              I am a Data & Reporting Professional and Full-Stack Developer with a BSc from the University of Mumbai. My career has taken me from Talent500 in Bengaluru to Kuwait Oil Company — working with enterprise-grade systems and understanding what real business data looks like at scale.
            </p>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '16px',
              color:      'rgba(255,255,255,0.65)',
              lineHeight: 1.8,
            }}>
              Stackwork was born from a simple observation — small and medium businesses across India and the Gulf have the same ambitions as large enterprises, but rarely get the same quality of digital work. I started Stackwork to change that. Every project we take on is treated with the same rigour I applied at the enterprise level, delivered at a scale that makes sense for growing businesses.
            </p>
          </div>

          {/* Credentials */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '10px' }}>
            <Badge text="BSc — University of Mumbai"   color="#FF6B35" />
            <Badge text="Talent500, Bengaluru"          color="#00D4FF" />
            <Badge text="Kuwait Oil Company"            color="#C9A84C" />
            <Badge text="Data & Reporting Professional" color="#8B5CF6" />
            <Badge text="Full-Stack Developer"          color="#FF6B35" />
            <Badge text="India & Gulf Markets"          color="#00D4FF" />
          </div>

          {/* Quick stats */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '16px',
            paddingTop:          '8px',
          }}>
            {[
              { value: '6+',   label: 'Years Experience' },
              { value: '6',    label: 'Services Offered'  },
              { value: '2',    label: 'Countries Worked'  },
            ].map((stat) => (
              <div key={stat.label} className="card-animated" style={{
                backgroundColor: 'rgba(13,27,62,0.6)',
                borderRadius:    '10px',
                padding:         '16px',
                border:          '1px solid rgba(255,255,255,0.06)',
                textAlign:       'center',
              }}>
                <div style={{
                  fontFamily:   'var(--font-heading)',
                  fontSize:     '28px',
                  fontWeight:   700,
                  color:        '#FF6B35',
                  lineHeight:   1,
                  marginBottom: '6px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   '12px',
                  color:      'rgba(255,255,255,0.45)',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}