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
  Globe, ShoppingCart, CalendarCheck,
  LayoutGrid, ArrowRight,
} from 'lucide-react'

function MobileCardScroller({ items, accentColor }: { items: React.ReactNode[], accentColor: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isPausedRef  = useRef(false)
  const touchStartX  = useRef(0)
  const count        = items.length

  const goTo = (i: number) => {
    setActiveIndex(Math.max(0, Math.min(i, count - 1)))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setActiveIndex(prev => (prev + 1) % count)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [count])

  return (
    <div style={{ marginLeft: '-10px', marginRight: '-10px', overflow: 'hidden' }}>

      {/* Sliding track */}
      <div
        style={{
          display:    'flex',
          transform:  `translateX(-${activeIndex * 100}%)`,
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX
          isPausedRef.current = true
        }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX
          if (Math.abs(diff) > 50) {
            diff > 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1)
          }
          setTimeout(() => { isPausedRef.current = false }, 1500)
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ flexShrink: 0, width: '100%' }}>
            {item}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
        {items.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              width:           activeIndex === i ? '20px' : '6px',
              height:          '6px',
              borderRadius:    '3px',
              backgroundColor: activeIndex === i ? accentColor : 'rgba(255,255,255,0.2)',
              transition:      'all 0.3s ease',
              cursor:          'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ============================================
   MOCKUP COMPONENTS
   ============================================ */

/* ---- Shared 3-up card grid (desktop) / scroller (mobile) ---- */
function MockupGrid({ items, accentColor }: {
  items: { card: React.ReactNode; info?: { label: string; desc: string; color: string } }[]
  accentColor: string
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const cardItems = items.map((it) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {it.card}
      {it.info && (
        <div style={{
          backgroundColor: 'rgba(13,27,62,0.5)',
          borderRadius:    '10px',
          padding:         '12px 14px',
          border:          `1px solid ${it.info.color}20`,
        }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', color: it.info.color, fontWeight: 700, marginBottom: '5px' }}>
            {it.info.label}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            {it.info.desc}
          </div>
        </div>
      )}
    </div>
  ))

  if (isMobile) {
    return <MobileCardScroller items={cardItems} accentColor={accentColor} />
  }

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap:                 '16px',
      width:               '100%',
    }}>
      {cardItems.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </div>
  )
}

function WebMockup() {
  const sites = [
    {
      label:    'Meridian Properties',
      subtitle: 'Real Estate Portal',
      url:      'https://meridian-properties-eta.vercel.app/',
      image:    '/images/projects/meridian.png',
      tag:      'Live ↗',
      info:     { label: 'Real Estate Portal', color: '#C9A84C', desc: 'Property listings, search filters & lead capture' },
    },
    {
      label:    'Oliver Wren',
      subtitle: 'Luxury Fashion Atelier',
      url:      'https://wren-seven-flax.vercel.app/',
      image:    '/images/projects/wren.png',
      tag:      'Live ↗',
      info:     { label: 'Luxury Fashion Brand', color: '#8B5CF6', desc: 'Bespoke atelier site with collections & appointment booking' },
    },
    {
      label:    'Atelier Noir',
      subtitle: 'Interior & Furniture Studio',
      url:      'https://atelier-noir-pi.vercel.app/',
      image:    '/images/projects/atelier-noir.png',
      tag:      'Live ↗',
      info:     { label: 'Business Website', color: '#FF6B35', desc: 'Interior & furniture studio site with portfolio & enquiries' },
    },
  ]

  return (
    <MockupGrid
      accentColor="#FF6B35"
      items={[
        ...sites.map((site) => ({ card: <ProjectCard site={site} />, info: site.info })),
      ]}
    />
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

function ComingSoonCard({ label, desc, color, emoji }: { label: string; desc: string; color: string; emoji: string }) {
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
          backgroundColor: `${color}12`,
          border:          `1px solid ${color}25`,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          fontSize:        '18px',
          opacity:         0.4,
        }}>{emoji}</div>

        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', color: `${color}80`, fontWeight: 700, marginBottom: '5px' }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
            {desc}
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

function DealwiseCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="https://dealwise-beta.vercel.app/"
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
        border:         hovered ? '1px solid rgba(139,92,246,0.45)' : '1px solid rgba(255,255,255,0.08)',
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
          dealwise-beta.vercel.app
        </div>
        <ArrowRight size={11} color="rgba(139,92,246,0.6)" />
      </div>

      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/projects/dealwise.png"
          alt="Dealwise"
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{
            objectFit:      'cover',
            objectPosition: 'top left',
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
              backgroundColor: '#8B5CF6',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '20px',
              color:           '#ffffff',
              boxShadow:       '0 8px 24px rgba(139,92,246,0.4)',
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
                Dealwise
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>
                Sales CRM & Pipeline Management Tool
              </div>
            </div>
            <div style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: '#8B5CF6',
              border: '1px solid rgba(139,92,246,0.35)', borderRadius: '100px',
              padding: '3px 10px', backgroundColor: 'rgba(139,92,246,0.08)',
              whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}>Live ↗</div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
            {['CRM', 'Pipeline Tracking', 'Multi-role Access', 'Sales Dashboard'].map(tag => (
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

/* ---- Cozy Crochets — live e-commerce store ---- */
function CrochetCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="https://cozycrochets.site"
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
        border:         hovered ? '1px solid rgba(44,110,73,0.45)' : '1px solid rgba(255,255,255,0.08)',
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
          cozycrochets.site
        </div>
        <ArrowRight size={11} color="rgba(44,110,73,0.6)" />
      </div>

      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/projects/cozycrochets.png"
          alt="Cozy Crochets"
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
              backgroundColor: '#2C6E49',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '20px',
              color:           '#ffffff',
              boxShadow:       '0 8px 24px rgba(44,110,73,0.4)',
            }}>↗</div>
            <span style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '13px',
              fontWeight:    500,
              color:         '#ffffff',
              letterSpacing: '0.5px',
            }}>Visit Store</span>
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
                Cozy Crochets
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>
                Handmade Crochet E-commerce Store
              </div>
            </div>
            <div style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: '#2C6E49',
              border: '1px solid rgba(44,110,73,0.35)', borderRadius: '100px',
              padding: '3px 10px', backgroundColor: 'rgba(44,110,73,0.08)',
              whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}>Live ↗</div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
            {['Product Catalogue', 'Cart & Checkout', 'Razorpay', 'Order Emails'].map(tag => (
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

/* ---- DailyBasket — online supermarket ---- */
function DailyBasketCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="https://daily-basket-pi.vercel.app"
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
        border:         hovered ? '1px solid rgba(44,110,73,0.45)' : '1px solid rgba(255,255,255,0.08)',
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
          daily-basket-pi.vercel.app
        </div>
        <ArrowRight size={11} color="rgba(44,110,73,0.6)" />
      </div>

      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/projects/daily-basket.png"
          alt="DailyBasket"
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
              backgroundColor: '#2C6E49',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '20px',
              color:           '#ffffff',
              boxShadow:       '0 8px 24px rgba(44,110,73,0.4)',
            }}>↗</div>
            <span style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '13px',
              fontWeight:    500,
              color:         '#ffffff',
              letterSpacing: '0.5px',
            }}>Visit Store</span>
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
                DailyBasket
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>
                Online Supermarket
              </div>
            </div>
            <div style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: '#2C6E49',
              border: '1px solid rgba(44,110,73,0.35)', borderRadius: '100px',
              padding: '3px 10px', backgroundColor: 'rgba(44,110,73,0.08)',
              whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}>Live ↗</div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
            {['Product Catalogue', 'Cart & Checkout', 'Categories', 'Order Tracking'].map(tag => (
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

/* ---- Ember & Ash — restaurant reservations ---- */
function EmberAshCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="https://ember-ash-zeta.vercel.app/"
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
          ember-ash-zeta.vercel.app
        </div>
        <ArrowRight size={11} color="rgba(255,107,53,0.6)" />
      </div>

      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/projects/ember-ash.png"
          alt="Ember & Ash"
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
                Ember &amp; Ash
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>
                Restaurant Reservation Site
              </div>
            </div>
            <div style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: '#FF6B35',
              border: '1px solid rgba(255,107,53,0.35)', borderRadius: '100px',
              padding: '3px 10px', backgroundColor: 'rgba(255,107,53,0.08)',
              whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}>Live ↗</div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
            {['Table Reservations', 'Menu Showcase', 'Time Slots', 'Brand Identity'].map(tag => (
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

/* ---- E-commerce: Crochet store + coming soon ---- */
function EcommerceMockup() {
  return (
    <MockupGrid
      accentColor="#2C6E49"
      items={[
        { card: <CrochetCard />, info: { label: 'Crochet E-commerce Store', color: '#2C6E49', desc: 'Product catalogue, cart, secure checkout & order management' } },
        { card: <DailyBasketCard />, info: { label: 'Online Supermarket', color: '#2C6E49', desc: 'Grocery catalogue, cart, secure checkout & order tracking' } },
        { card: <ComingSoonCard label="Online Store" desc="Product management & order tracking" color="#2C6E49" emoji="🛒" /> },
      ]}
    />
  )
}

/* ---- Booking: Sèvres + Maison + Ember & Ash ---- */
function BookingMockup() {
  return (
    <MockupGrid
      accentColor="#00D4FF"
      items={[
        { card: <SevresCard />, info: { label: 'Salon Booking App', color: '#00D4FF', desc: 'Full booking flow, service selection & auth system' } },
        { card: <MaisonCard />, info: { label: 'Hotel Reservation System', color: '#C9A84C', desc: 'Room booking, availability & guest portal' } },
        { card: <EmberAshCard />, info: { label: 'Restaurant Reservations', color: '#FF6B35', desc: 'Table reservations, time slots & menu showcase' } },
      ]}
    />
  )
}

/* ---- Business Systems: Dealwise CRM + coming soon ---- */
function BusinessMockup() {
  return (
    <MockupGrid
      accentColor="#8B5CF6"
      items={[
        { card: <DealwiseCard />, info: { label: 'Sales CRM', color: '#8B5CF6', desc: 'Pipeline tracking, multi-role access & sales dashboard' } },
        { card: <ComingSoonCard label="Client Portal" desc="Each client logs in to see their own data" color="#8B5CF6" emoji="🔐" /> },
        { card: <ComingSoonCard label="Internal Tool" desc="Custom dashboards built around your workflow" color="#8B5CF6" emoji="🗂️" /> },
      ]}
    />
  )
}

/* ============================================
   SERVICE DATA — 4 services
   ============================================ */
const services = [
  {
    icon:     Globe,
    title:    'Websites & Landing Pages',
    tagline:  'Your online presence, built to convert',
    price:    'Starting at ₹10,000',
    color:    '#FF6B35',
    number:   '01',
    includes: [
      'Custom Next.js, fully mobile responsive',
      'Content writing included',
      'Content management — Sanity or custom dashboard, whichever is easier to operate',
      'Free clickable wireframe before we build',
      'Basic on-page SEO (meta tags, sitemap, clean structure — all in code)',
      'Contact form with email integration',
      'Up to 5 AI-generated images included',
      'Two revision rounds',
      'Loom walkthrough on delivery',
      '30 days free bug fixes',
      'Full source code ownership after payment',
    ],
    ideal: 'Lawyers, restaurants, property agents, clinics, coaches, portfolios — any business needing a professional online presence. No payments or user logins.',
    mockup: <WebMockup />,
  },
  {
    icon:     ShoppingCart,
    title:    'E-commerce Stores',
    tagline:  'Sell your products online, beautifully',
    price:    'Starting at ₹50,000',
    color:    '#2C6E49',
    number:   '02',
    includes: [
      'Built on Next.js + Supabase',
      'Full product catalogue with cart and secure checkout',
      'Razorpay payment integration (client\'s own account)',
      'Admin dashboard to manage orders',
      'Product management — Sanity or custom dashboard, whichever is easier',
      'Order confirmation emails',
      'Free clickable wireframe before we build',
      'Three revision rounds',
      'Loom walkthrough on delivery',
      '30 days free bug fixes',
      'Full source code and database ownership after payment',
    ],
    ideal: 'Any business selling products online — boutiques, supermarkets, specialty stores, supplement brands.',
    mockup: <EcommerceMockup />,
  },
  {
    icon:     CalendarCheck,
    title:    'Booking & Appointment Systems',
    tagline:  'Let customers book you directly',
    price:    'Starting at ₹40,000',
    color:    '#00D4FF',
    number:   '03',
    includes: [
      'Built on Next.js + Supabase',
      'Full authentication (register, login, password reset)',
      'Availability logic — slots, double-booking prevention',
      'Admin dashboard — calendar, approve/reject bookings',
      'Booking confirmation and reminder emails',
      'Razorpay where payments are needed',
      'Free clickable wireframe before we build',
      'Three revision rounds',
      'Loom walkthrough on delivery',
      '30 days free bug fixes',
      'Full source code and database ownership after payment',
    ],
    ideal: 'Salons, clinics, restaurants, gyms — any business where customers reserve time or a slot.',
    mockup: <BookingMockup />,
  },
  {
    icon:     LayoutGrid,
    title:    'Business Systems & Portals',
    tagline:  'Custom tools that run your operations',
    price:    'Starting at ₹60,000',
    color:    '#8B5CF6',
    number:   '04',
    includes: [
      'Built on Next.js + Supabase',
      'Full authentication and role-based access',
      'Custom dashboards built around your workflow',
      'CRM, client portals, or internal business tools',
      'Real-time data and live status tracking',
      'Free clickable wireframe before we build',
      'Three revision rounds',
      'Loom walkthrough on delivery',
      'Full documentation and source code ownership after payment',
    ],
    ideal: 'Businesses needing a CRM, a client portal where each user logs in to see their own data, or a custom internal tool.',
    mockup: <BusinessMockup />,
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
        padding:    isMobile ? '60px 0px' : '80px 60px',
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

        <div style={{
          display:         'inline-block',
          marginTop:       '16px',
          fontFamily:      'var(--font-heading)',
          fontSize:        '14px',
          fontWeight:      700,
          color:           service.color,
          backgroundColor: `${service.color}12`,
          border:          `1px solid ${service.color}30`,
          borderRadius:    '100px',
          padding:         '6px 18px',
          letterSpacing:   '0.5px',
        }}>
          {service.price}
        </div>
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
            padding:         '14px 32px',
            alignSelf:       'center',
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