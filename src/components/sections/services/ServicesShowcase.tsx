/* ============================================
   SERVICES SHOWCASE
   - Vertically stacked, text top mockup below
   - Each service centered
   - Alternating accent colors
   - Real content per service
   ============================================ */
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Globe, Monitor, BarChart2,
  Wrench, ArrowRight,
} from 'lucide-react'

/* ============================================
   MOCKUP COMPONENTS
   ============================================ */

function WebMockup() {
  const [isMobile, setIsMobile] = useState(false)

  const sites = [
    {
      label:    'Ember & Ash',
      subtitle: 'Restaurant Website',
      url:      'https://ember-ash-zeta.vercel.app/',
      image:    '/images/projects/ember-ash.png',
      tag:      'Web Design',
      info:     { label: 'Restaurant Website', color: '#FF6B35', desc: 'Table reservations, menu showcase & brand identity' },
    },
    {
      label:    'Meridian Properties',
      subtitle: 'Real Estate Portal',
      url:      'https://meridian-properties-eta.vercel.app/',
      image:    '/images/projects/meridian.png',
      tag:      'Web Design',
      info:     { label: 'Real Estate Portal', color: '#C9A84C', desc: 'Property listings, search filters & lead capture' },
    },
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
      gap:                 '16px',
      width:               '100%',
    }}>
      {[...sites.map((site) => (
        <div key={site.url} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ProjectCard site={site} />
          <div style={{
            backgroundColor: 'rgba(13,27,62,0.5)',
            borderRadius:    '10px',
            padding:         '12px 14px',
            border:          `1px solid ${site.info.color}20`,
          }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', color: site.info.color, fontWeight: 700, marginBottom: '5px' }}>
              {site.info.label}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              {site.info.desc}
            </div>
          </div>
        </div>
      )), (
        <div key="dummy" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <DummyWebCard />
          <div style={{
            backgroundColor: 'rgba(13,27,62,0.5)',
            borderRadius:    '10px',
            padding:         '12px 14px',
            border:          '1px solid rgba(255,107,53,0.1)',
          }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', color: 'rgba(255,107,53,0.4)', fontWeight: 700, marginBottom: '5px' }}>
              New Website
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
              Next project coming soon
            </div>
          </div>
        </div>
      )]}
    </div>
  )
}

function DummyWebCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        flexDirection:   'column',
        borderRadius:    '12px',
        overflow:        'hidden',
        aspectRatio:     '16/10',
        border:          hovered ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(13,17,28,0.7)',
        transition:      'border-color 0.3s ease',
        cursor:          'default',
      }}
    >
      {/* Browser bar */}
      <div style={{
        flexShrink:      0,
        backgroundColor: 'rgba(8,11,20,0.6)',
        padding:         '7px 10px',
        display:         'flex',
        alignItems:      'center',
        gap:             '7px',
        borderBottom:    '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['rgba(255,95,87,0.3)','rgba(254,188,46,0.3)','rgba(40,200,64,0.3)'].map((c, i) => (
            <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex:            1,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius:    '3px',
          padding:         '2px 8px',
          fontSize:        '10px',
          fontFamily:      'var(--font-body)',
          color:           'rgba(255,255,255,0.18)',
        }}>
          coming soon...
        </div>
      </div>

      {/* Content area */}
      <div style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '12px',
        position:       'relative',
      }}>
        <div style={{
          width:           '40px',
          height:          '40px',
          borderRadius:    '10px',
          backgroundColor: 'rgba(255,107,53,0.08)',
          border:          '1px solid rgba(255,107,53,0.15)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          fontSize:        '18px',
          opacity:         0.5,
        }}>🌐</div>
        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          <div style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     '13px',
            color:        'rgba(255,107,53,0.5)',
            fontWeight:   700,
            marginBottom: '5px',
          }}>New Project</div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize:   '11px',
            color:      'rgba(255,255,255,0.2)',
            lineHeight: 1.5,
          }}>Next website coming soon</div>
        </div>
        <div style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '9px',
          color:         'rgba(255,255,255,0.2)',
          border:        '1px solid rgba(255,255,255,0.08)',
          borderRadius:  '100px',
          padding:       '3px 12px',
          letterSpacing: '1px',
          textTransform: 'uppercase' as const,
        }}>Coming Soon</div>
      </div>
    </div>
  )
}


/* ---- Hover card component ---- */
function ProjectCard({ site }: {
  site: {
    label:    string
    subtitle: string
    url:      string
    image:    string
    tag:      string
  }
}) {
  const [hovered, setHovered] = useState(false)
  const displayUrl = site.url.replace('https://', '').replace(/\/$/, '')

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'flex',
        flexDirection:  'column',
        textDecoration: 'none',
        borderRadius:   '12px',
        overflow:       'hidden',
        aspectRatio:    '16/10',
        cursor:         'pointer',
        border:         hovered ? '1px solid rgba(255,107,53,0.45)' : '1px solid rgba(255,255,255,0.08)',
        transition:     'border-color 0.3s ease',
      }}
    >
      {/* Browser bar */}
      <div style={{
        flexShrink:      0,
        backgroundColor: 'rgba(8,11,20,0.9)',
        padding:         '7px 10px',
        display:         'flex',
        alignItems:      'center',
        gap:             '7px',
        borderBottom:    '1px solid rgba(255,255,255,0.06)',
        zIndex:          3,
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => (
            <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex:            1,
          backgroundColor: 'rgba(255,255,255,0.07)',
          borderRadius:    '3px',
          padding:         '2px 8px',
          fontSize:        '10px',
          fontFamily:      'var(--font-body)',
          color:           'rgba(255,255,255,0.45)',
        }}>
          {displayUrl}
        </div>
        <ArrowRight size={11} color="rgba(255,107,53,0.6)" />
      </div>

      {/* Image area — starts below browser bar */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          src={site.image}
          alt={site.label}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{
            objectFit:      'cover',
            objectPosition: 'top',
            transform:      hovered ? 'scale(1.04)' : 'scale(1)',
            transition:     'transform 0.5s ease',
          }}
        />

        {/* Bottom gradient */}
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(to bottom, transparent 40%, rgba(8,11,20,0.88) 72%, rgba(8,11,20,1) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Hover overlay */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundColor: hovered ? 'rgba(8,11,20,0.75)' : 'transparent',
          transition:      'background-color 0.35s ease',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             '12px',
          zIndex:          2,
        }}>
          <div style={{
            opacity:       hovered ? 1 : 0,
            transform:     hovered ? 'translateY(0)' : 'translateY(10px)',
            transition:    'opacity 0.3s ease, transform 0.3s ease',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '10px',
          }}>
            <div style={{
              width:           '48px',
              height:          '48px',
              borderRadius:    '50%',
              backgroundColor: '#FF6B35',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '20px',
              color:           '#ffffff',
              boxShadow:       '0 8px 24px rgba(255,107,53,0.4)',
            }}>↗</div>
            <span style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '13px',
              fontWeight:    500,
              color:         '#ffffff',
              letterSpacing: '0.5px',
            }}>Visit Site</span>
          </div>
        </div>

        {/* Project info — bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding:  '12px 14px',
          zIndex:   3,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                fontFamily:   'var(--font-heading)',
                fontSize:     '15px',
                fontWeight:   700,
                color:        '#ffffff',
                lineHeight:   1.2,
                marginBottom: '3px',
              }}>
                {site.label}
              </div>
              <div style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '9px',
                color:         'rgba(255,255,255,0.45)',
                letterSpacing: '1.2px',
                textTransform: 'uppercase' as const,
              }}>
                {site.subtitle}
              </div>
            </div>
            <div style={{
              fontSize:        '10px',
              fontFamily:      'var(--font-body)',
              color:           '#FF6B35',
              border:          '1px solid rgba(255,107,53,0.35)',
              borderRadius:    '100px',
              padding:         '3px 10px',
              backgroundColor: 'rgba(255,107,53,0.08)',
              whiteSpace:      'nowrap' as const,
              flexShrink:      0,
            }}>
              {site.tag}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

function SevresCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="https://sevres.vercel.app"
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'flex',
        flexDirection:  'column',
        textDecoration: 'none',
        borderRadius:   '12px',
        overflow:       'hidden',
        aspectRatio:    '16/10',
        cursor:         'pointer',
        border:         hovered ? '1px solid rgba(0,212,255,0.45)' : '1px solid rgba(255,255,255,0.08)',
        transition:     'border-color 0.3s ease',
      }}
    >
      {/* Browser bar */}
      <div style={{
        flexShrink:      0,
        backgroundColor: 'rgba(8,11,20,0.9)',
        padding:         '7px 10px',
        display:         'flex',
        alignItems:      'center',
        gap:             '7px',
        borderBottom:    '1px solid rgba(255,255,255,0.06)',
        zIndex:          3,
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => (
            <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex:            1,
          backgroundColor: 'rgba(255,255,255,0.07)',
          borderRadius:    '3px',
          padding:         '2px 8px',
          fontSize:        '10px',
          fontFamily:      'var(--font-body)',
          color:           'rgba(255,255,255,0.45)',
        }}>
          sevres.vercel.app
        </div>
        <ArrowRight size={11} color="rgba(0,212,255,0.6)" />
      </div>

      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/projects/sevres.png"
          alt="Sèvres & Co."
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{
            objectFit:      'cover',
            objectPosition: 'top',
            transform:      hovered ? 'scale(1.04)' : 'scale(1)',
            transition:     'transform 0.5s ease',
          }}
        />

        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(to bottom, transparent 40%, rgba(8,11,20,0.88) 72%, rgba(8,11,20,1) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Hover overlay */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundColor: hovered ? 'rgba(8,11,20,0.75)' : 'transparent',
          transition:      'background-color 0.35s ease',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             '12px',
          zIndex:          2,
        }}>
          <div style={{
            opacity:       hovered ? 1 : 0,
            transform:     hovered ? 'translateY(0)' : 'translateY(10px)',
            transition:    'opacity 0.3s ease, transform 0.3s ease',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '10px',
          }}>
            <div style={{
              width:           '48px',
              height:          '48px',
              borderRadius:    '50%',
              backgroundColor: '#00D4FF',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '20px',
              color:           '#ffffff',
              boxShadow:       '0 8px 24px rgba(0,212,255,0.4)',
            }}>↗</div>
            <span style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '13px',
              fontWeight:    500,
              color:         '#ffffff',
              letterSpacing: '0.5px',
            }}>Visit App</span>
          </div>
        </div>

        {/* Bottom info */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding:  '12px 14px',
          zIndex:   3,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: '3px' }}>
                Sèvres <span style={{ color: '#C9A84C' }}>&</span> Co.
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>
                Luxury Salon Booking App · Bandra West, Mumbai
              </div>
            </div>
            <div style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: '#00D4FF',
              border: '1px solid rgba(0,212,255,0.35)', borderRadius: '100px',
              padding: '3px 10px', backgroundColor: 'rgba(0,212,255,0.08)',
              whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}>Live ↗</div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
            {['Service Browsing', 'Specialist Selection', 'Online Booking', 'Auth System'].map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
                padding: '2px 7px', backdropFilter: 'blur(4px)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}

function DummyAppCard({ index }: { index: number }) {
  const [hovered, setHovered] = useState(false)
  const labels  = ['Booking System', 'Internal Portal']
  const descs   = ['Appointment scheduling & reservations', 'Staff tools, admin panel & CRM']
  const colors  = ['#8B5CF6', '#C9A84C']
  const emojis  = ['📅', '🗂️']

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        flexDirection:   'column',
        borderRadius:    '12px',
        overflow:        'hidden',
        aspectRatio:     '16/10',
        border:          hovered ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(13,17,28,0.7)',
        transition:      'border-color 0.3s ease',
        cursor:          'default',
      }}
    >
      {/* Browser bar */}
      <div style={{
        flexShrink:      0,
        backgroundColor: 'rgba(8,11,20,0.6)',
        padding:         '7px 10px',
        display:         'flex',
        alignItems:      'center',
        gap:             '7px',
        borderBottom:    '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['rgba(255,95,87,0.3)','rgba(254,188,46,0.3)','rgba(40,200,64,0.3)'].map((c, i) => (
            <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex:            1,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius:    '3px',
          padding:         '2px 8px',
          fontSize:        '10px',
          fontFamily:      'var(--font-body)',
          color:           'rgba(255,255,255,0.18)',
        }}>
          coming soon...
        </div>
      </div>

      {/* Content area */}
      <div style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '12px',
        position:       'relative',
      }}>
        {/* Hover overlay */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundColor: hovered ? 'rgba(8,11,20,0.4)' : 'transparent',
          transition:      'background-color 0.35s ease',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          zIndex:          2,
          pointerEvents:   'none',
        }}>
          <div style={{
            opacity:       hovered ? 1 : 0,
            transform:     hovered ? 'translateY(0)' : 'translateY(10px)',
            transition:    'opacity 0.3s ease, transform 0.3s ease',
            fontFamily:    'var(--font-body)',
            fontSize:      '11px',
            color:         'rgba(255,255,255,0.35)',
            border:        '1px solid rgba(255,255,255,0.1)',
            borderRadius:  '100px',
            padding:       '5px 14px',
            letterSpacing: '1px',
            textTransform: 'uppercase' as const,
          }}>Coming Soon</div>
        </div>

        <div style={{
          width:           '40px',
          height:          '40px',
          borderRadius:    '10px',
          backgroundColor: `${colors[index]}12`,
          border:          `1px solid ${colors[index]}25`,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          fontSize:        '18px',
          opacity:         0.4,
        }}>{emojis[index]}</div>

        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', color: `${colors[index]}80`, fontWeight: 700, marginBottom: '5px' }}>
            {labels[index]}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
            {descs[index]}
          </div>
        </div>

        <div style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '9px',
          color:         'rgba(255,255,255,0.2)',
          border:        '1px solid rgba(255,255,255,0.08)',
          borderRadius:  '100px',
          padding:       '3px 12px',
          letterSpacing: '1px',
          textTransform: 'uppercase' as const,
        }}>Project Coming Soon</div>
      </div>
    </div>
  )
}

function MaisonCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="https://maison-celeste.vercel.app/"
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'flex',
        flexDirection:  'column',
        textDecoration: 'none',
        borderRadius:   '12px',
        overflow:       'hidden',
        aspectRatio:    '16/10',
        cursor:         'pointer',
        border:         hovered ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(255,255,255,0.08)',
        transition:     'border-color 0.3s ease',
      }}
    >
      {/* Browser bar */}
      <div style={{
        flexShrink:      0,
        backgroundColor: 'rgba(8,11,20,0.9)',
        padding:         '7px 10px',
        display:         'flex',
        alignItems:      'center',
        gap:             '7px',
        borderBottom:    '1px solid rgba(255,255,255,0.06)',
        zIndex:          3,
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => (
            <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex:            1,
          backgroundColor: 'rgba(255,255,255,0.07)',
          borderRadius:    '3px',
          padding:         '2px 8px',
          fontSize:        '10px',
          fontFamily:      'var(--font-body)',
          color:           'rgba(255,255,255,0.45)',
        }}>
          maison-celeste.vercel.app
        </div>
        <ArrowRight size={11} color="rgba(201,168,76,0.6)" />
      </div>

      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/projects/maison-celeste.png"
          alt="Maison Céleste"
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{
            objectFit:      'cover',
            objectPosition: 'top',
            transform:      hovered ? 'scale(1.04)' : 'scale(1)',
            transition:     'transform 0.5s ease',
          }}
        />

        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(to bottom, transparent 40%, rgba(8,11,20,0.88) 72%, rgba(8,11,20,1) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Hover overlay */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundColor: hovered ? 'rgba(8,11,20,0.75)' : 'transparent',
          transition:      'background-color 0.35s ease',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             '12px',
          zIndex:          2,
        }}>
          <div style={{
            opacity:       hovered ? 1 : 0,
            transform:     hovered ? 'translateY(0)' : 'translateY(10px)',
            transition:    'opacity 0.3s ease, transform 0.3s ease',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '10px',
          }}>
            <div style={{
              width:           '48px',
              height:          '48px',
              borderRadius:    '50%',
              backgroundColor: '#C9A84C',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '20px',
              color:           '#ffffff',
              boxShadow:       '0 8px 24px rgba(201,168,76,0.4)',
            }}>↗</div>
            <span style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '13px',
              fontWeight:    500,
              color:         '#ffffff',
              letterSpacing: '0.5px',
            }}>Visit App</span>
          </div>
        </div>

        {/* Bottom info */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding:  '12px 14px',
          zIndex:   3,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: '3px' }}>
                Maison Céleste
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>
                Boutique Hotel Reservation System
              </div>
            </div>
            <div style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: '#C9A84C',
              border: '1px solid rgba(201,168,76,0.35)', borderRadius: '100px',
              padding: '3px 10px', backgroundColor: 'rgba(201,168,76,0.08)',
              whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}>Live ↗</div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
            {['Room Booking', 'Availability', 'Reservations', 'Guest Portal'].map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
                padding: '2px 7px', backdropFilter: 'blur(4px)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}

function AppMockup() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const infos = [
    { label: 'Salon Booking App',          color: '#00D4FF', desc: 'Full booking flow, service selection & auth system' },
    { label: 'Hotel Reservation System',   color: '#C9A84C', desc: 'Room booking, availability & guest portal' },
    { label: 'Internal Portals',           color: '#8B5CF6', desc: 'Staff tools, admin panels, CRMs' },
  ]

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap:                 '16px',
      width:               '100%',
    }}>
      {/* Card + info strip as one unit per column */}
      {[<SevresCard key="sevres" />, <MaisonCard key="maison" />, <DummyAppCard key="d1" index={1} />].map((card, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {card}
          <div style={{
            backgroundColor: 'rgba(13,27,62,0.5)',
            borderRadius:    '10px',
            padding:         '12px 14px',
            border:          `1px solid ${infos[i].color}20`,
          }}>
            <div style={{
              fontFamily:   'var(--font-heading)',
              fontSize:     '12px',
              color:        infos[i].color,
              fontWeight:   700,
              marginBottom: '5px',
            }}>
              {infos[i].label}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '11px',
              color:      'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
            }}>
              {infos[i].desc}
            </div>
          </div>
        </div>
      ))}
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
    icon:     Monitor,
    title:    'Web Apps & Portals',
    tagline:  'Custom browser-based tools that run your operations',
    color:    '#00D4FF',
    number:   '02',
    includes: [
      'Booking & appointment systems',
      'Client portals & customer dashboards',
      'Internal business tools & admin panels',
      'CRM and lead management systems',
      'Multi-role access (staff, admin, customer)',
      'API integrations with third-party services',
      'Real-time data & live status tracking',
      'Scalable architecture from day one',
    ],
    ideal: 'Salons, clinics, hospitality, service businesses, companies needing internal tools',
    mockup: <AppMockup />,
  },
  {
    icon:     BarChart2,
    title:    'Data Analysis & Reporting',
    tagline:  'Numbers your team can actually act on',
    color:    '#2C6E49',
    number:   '03',
    includes: [
      'Excel reports with Power Pivot & Power Query',
      'Automated data cleaning & transformation',
      'Sales, operations, and financial reporting',
      'KPI tracking & monthly business reviews',
      'Custom dashboards in Excel or Google Sheets',
      'Data modelling for smarter decision-making',
      'Scheduled automated report delivery',
      'Power BI dashboards (on request)',
    ],
    ideal: 'SMB owners wanting clear visibility into sales, expenses, operations, or team performance',
    mockup: <AnalyticsMockup />,
  },
  {
    icon:     Wrench,
    title:    'Maintenance & Retainer Plans',
    tagline:  'We stay long after everyone else has left',
    color:    '#8B5CF6',
    number:   '04',
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