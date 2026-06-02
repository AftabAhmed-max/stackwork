/* ============================================
   PROOF SECTION
   - Two sample deliverables with view / download
   - Block 1: Free wireframe (hero proof, larger)
   - Block 2: Brand Starter Kit (paid add-on, secondary)
   ============================================ */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ExternalLink, Download } from 'lucide-react'

const ORANGE = '#FF6B35'

/* ---- Reusable browser-bar frame (mirrors ServicesShowcase project cards) ---- */
function BrowserFrame({ url, accent, children }: { url: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      borderRadius:  '12px',
      overflow:      'hidden',
      border:        '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Browser bar */}
      <div style={{
        flexShrink:      0,
        backgroundColor: 'rgba(8,11,20,0.9)',
        padding:         '8px 12px',
        display:         'flex',
        alignItems:      'center',
        gap:             '8px',
        borderBottom:    '1px solid rgba(255,255,255,0.06)',
        zIndex:          3,
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex:            1,
          backgroundColor: 'rgba(255,255,255,0.07)',
          borderRadius:    '4px',
          padding:         '3px 10px',
          fontSize:        '11px',
          fontFamily:      'var(--font-body)',
          color:           'rgba(255,255,255,0.45)',
        }}>
          {url}
        </div>
        <ArrowRight size={12} color={`${accent}99`} />
      </div>

      {/* Content area */}
      <div style={{ position: 'relative', backgroundColor: '#ffffff' }}>
        {children}
      </div>
    </div>
  )
}

export default function ProofSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const kitImages = [
    { src: '/samples/preview/forge_logo_kit1.png',        alt: 'Forge logo — direction one' },
    { src: '/samples/preview/forge_card_front_kit1.png',  alt: 'Forge business card — direction one' },
    { src: '/samples/preview/forge_social_post_kit1.png', alt: 'Forge social post — direction one' },
    { src: '/samples/preview/forge_logo_kit2.png',        alt: 'Forge logo — direction two' },
    { src: '/samples/preview/forge_social_post_kit2.png', alt: 'Forge social post — direction two' },
  ]

  const kitIncludes = [
    'Brand guide', 'Logo (PNG)', 'Favicon',
    'Social media kit (profile, banner, post)',
    'Business cards (front & back)', 'Multiple design directions',
  ]

  return (
    <section style={{ padding: isMobile ? '60px 24px' : '80px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ---- Section header ---- */}
        <div style={{ marginBottom: '56px', maxWidth: '620px' }}>
          <span className="section-label" style={{
            fontFamily: 'var(--font-body)', fontSize: '13px',
            fontWeight: 500, color: ORANGE, textTransform: 'uppercase',
          }}>
            Proof, Not Promises
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   isMobile ? '28px' : '42px',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.2,
          }}>
            Real Samples You Can Open Right Now
          </h2>
        </div>

        {/* ============================================================
            BLOCK 1 — FREE WIREFRAME (hero proof)
            ============================================================ */}
        <div style={{
          borderRadius: '16px',
          padding:      '2px',
          background:   `linear-gradient(135deg, ${ORANGE}40, transparent, ${ORANGE}20)`,
          marginBottom: '40px',
        }}>
          <div style={{
            backgroundColor: 'rgba(13,27,62,0.5)',
            borderRadius:    '14px',
            border:          '1px solid rgba(255,255,255,0.06)',
            padding:         isMobile ? '24px' : '40px',
            display:         'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap:             isMobile ? '28px' : '44px',
            alignItems:      'center',
          }}>
            {/* Left — copy + buttons */}
            <div>
              <span style={{
                display:         'inline-block',
                fontFamily:      'var(--font-heading)',
                fontSize:        '12px',
                fontWeight:      700,
                color:           ORANGE,
                backgroundColor: `${ORANGE}12`,
                border:          `1px solid ${ORANGE}30`,
                borderRadius:    '100px',
                padding:         '5px 14px',
                letterSpacing:   '1px',
                marginBottom:    '18px',
              }}>
                FREE ON EVERY PROJECT
              </span>

              <h3 style={{
                fontFamily:   'var(--font-heading)',
                fontSize:     isMobile ? '26px' : '34px',
                fontWeight:   700,
                color:        '#ffffff',
                lineHeight:   1.2,
                marginBottom: '16px',
              }}>
                See it before we build it
              </h3>

              <p style={{
                fontFamily:   'var(--font-body)',
                fontSize:     '15px',
                color:        'rgba(255,255,255,0.65)',
                lineHeight:   1.7,
                marginBottom: '28px',
              }}>
                Every project starts with a free, clickable wireframe — a working preview of
                your site&apos;s structure and flow. You approve it before we write a single line
                of code. No surprises, no guesswork.
              </p>

              <div style={{
                display:       'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap:           '12px',
              }}>
                <a
                  href="/samples/lumiere-salon-wireframe.html"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-pulse"
                  style={{
                    display:         'inline-flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    gap:             '8px',
                    backgroundColor: ORANGE,
                    color:           '#ffffff',
                    fontFamily:      'var(--font-body)',
                    fontWeight:      500,
                    fontSize:        '14px',
                    padding:         '13px 24px',
                    borderRadius:    '6px',
                    textDecoration:  'none',
                    width:           isMobile ? '100%' : 'auto',
                  }}
                >
                  View Live Wireframe <ExternalLink size={14} />
                </a>

                <a
                  href="/samples/lumiere-salon-wireframe.html"
                  download
                  style={{
                    display:         'inline-flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    gap:             '8px',
                    backgroundColor: 'transparent',
                    color:           '#ffffff',
                    fontFamily:      'var(--font-body)',
                    fontWeight:      500,
                    fontSize:        '14px',
                    padding:         '13px 24px',
                    borderRadius:    '6px',
                    textDecoration:  'none',
                    border:          '1px solid rgba(255,255,255,0.2)',
                    width:           isMobile ? '100%' : 'auto',
                  }}
                >
                  Download HTML <Download size={14} />
                </a>
              </div>
            </div>

            {/* Right — live wireframe in browser frame */}
            <BrowserFrame url="lumiere-salon-wireframe.html" accent={ORANGE}>
              <div style={{ position: 'relative', width: '100%', height: isMobile ? '320px' : '420px', overflow: 'hidden' }}>
                <iframe
                  src="/samples/lumiere-salon-wireframe.html"
                  title="Lumière Salon — sample wireframe"
                  loading="lazy"
                  style={{
                    border:    'none',
                    width:     '200%',
                    height:    '200%',
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                  }}
                />
                {/* Click-through cover so the whole frame opens the live page */}
                <a
                  href="/samples/lumiere-salon-wireframe.html"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open live wireframe"
                  style={{ position: 'absolute', inset: 0, zIndex: 2 }}
                />
              </div>
            </BrowserFrame>
          </div>
        </div>

        {/* ============================================================
            BLOCK 2 — BRAND STARTER KIT (paid add-on, secondary)
            ============================================================ */}
        <div className="card-animated" style={{
          backgroundColor: 'rgba(13,27,62,0.5)',
          borderRadius:    '12px',
          border:          '1px solid rgba(255,255,255,0.06)',
          padding:         isMobile ? '24px' : '36px',
          display:         'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
          gap:             isMobile ? '28px' : '40px',
          alignItems:      'center',
        }}>
          {/* Left — copy + includes + button */}
          <div>
            <span style={{
              display:         'inline-block',
              fontFamily:      'var(--font-heading)',
              fontSize:        '12px',
              fontWeight:      700,
              color:           ORANGE,
              backgroundColor: `${ORANGE}12`,
              border:          `1px solid ${ORANGE}30`,
              borderRadius:    '100px',
              padding:         '5px 14px',
              letterSpacing:   '1px',
              marginBottom:    '16px',
            }}>
              OPTIONAL ADD-ON — ₹3,500
            </span>

            <h3 style={{
              fontFamily:   'var(--font-heading)',
              fontSize:     isMobile ? '24px' : '28px',
              fontWeight:   700,
              color:        '#ffffff',
              lineHeight:   1.2,
              marginBottom: '14px',
            }}>
              Need branding first?
            </h3>

            <p style={{
              fontFamily:   'var(--font-body)',
              fontSize:     '14px',
              color:        'rgba(255,255,255,0.6)',
              lineHeight:   1.7,
              marginBottom: '20px',
            }}>
              Don&apos;t have a logo and brand identity yet? Our Brand Starter Kit gives you
              everything to launch: a brand guide, logo, favicon, social media kit, and business
              cards — delivered in multiple design directions to choose from. Optional, only if
              you need it.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '26px' }}>
              {kitIncludes.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ORANGE, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{item}</span>
                </div>
              ))}
            </div>

            <a
              href="/samples/forge-brand-kit-sample.zip"
              download
              className="cta-pulse"
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '8px',
                backgroundColor: ORANGE,
                color:           '#ffffff',
                fontFamily:      'var(--font-body)',
                fontWeight:      500,
                fontSize:        '14px',
                padding:         '12px 24px',
                borderRadius:    '6px',
                textDecoration:  'none',
                width:           isMobile ? '100%' : 'auto',
              }}
            >
              Download Sample Kit <Download size={14} />
            </a>
          </div>

          {/* Right — preview gallery */}
          <div>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '11px',
              color:         'rgba(255,255,255,0.4)',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              marginBottom:  '14px',
            }}>
              Two of the directions we delivered for a sample brand, Forge
            </p>
            <div style={{
              display:             'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap:                 '10px',
            }}>
              {kitImages.map((img) => (
                <div key={img.src} style={{
                  position:        'relative',
                  aspectRatio:     '1 / 1',
                  borderRadius:    '10px',
                  overflow:        'hidden',
                  border:          '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(8,11,20,0.6)',
                }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 900px) 50vw, 200px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
