'use client'

/* ============================================
   FOOTER COMPONENT
   - Logo + tagline left
   - Nav links, services links, contact info
   - Bottom bar with copyright
   ============================================ */
import Link from 'next/link'
import { Mail, MapPin, ArrowUpRight } from 'lucide-react'

/* ---- Footer Nav Links ---- */
const footerNav = [
  { label: 'Home',      href: '/' },
  { label: 'Services',  href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
]

/* ---- Services List ---- */
const footerServices = [
  'Web Design & Development',
  'Mobile & Web App Development',
  'Data Analytics & BI Dashboards',
  'Business Setup',
  'Maintenance & Retainer Plans',
  'Digital Consultation',
]

/* ---- Reusable link style ---- */
const linkStyle: React.CSSProperties = {
  fontFamily:     'var(--font-body)',
  fontSize:       '14px',
  color:          '#888888',
  textDecoration: 'none',
  lineHeight:     '2',
  transition:     'color 0.2s ease',
  display:        'block',
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: 'rgba(8,11,20,0.75)',
        backdropFilter:  'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop:       '1px solid rgba(255,255,255,0.07)',
        paddingTop:      '72px',
        paddingBottom:   '0', 
      }}
    >
      <div
        style={{
          maxWidth:             '100%',
          padding:              '0 60px',
          display:              'grid',
          gridTemplateColumns:  '2fr 1fr 1.5fr 1.5fr',
          gap:                  '48px',
          paddingBottom:        '64px',
        }}
        className="footer-grid"
      >

        {/* ---- COLUMN 1: LOGO + DESCRIPTION ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4"  y="8"  width="24" height="7" rx="3" fill="#FF6B35" fillOpacity="1" />
              <rect x="8"  y="19" width="18" height="7" rx="3" fill="#FF6B35" fillOpacity="0.75" />
              <rect x="12" y="30" width="12" height="7" rx="3" fill="#ffffff"  fillOpacity="0.50" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '22px', lineHeight: 1 }}>
                <span style={{ color: '#ffffff' }}>Stack</span>
                <span style={{ color: '#FF6B35' }}>work</span>
              </span>
              <span style={{
                fontFamily:    'var(--font-heading)',
                fontSize:      '8px',
                fontWeight:    700,
                letterSpacing: '3px',
                color:         '#6B7280',
                textTransform: 'uppercase' as const,
                lineHeight:    1,
              }}>
                Digital Solutions
              </span>
            </div>
          </Link>

          {/* Description */}
          <p style={{
            fontFamily:  'var(--font-body)',
            fontSize:    '14px',
            color:       '#888888',
            lineHeight:  '1.7',
            maxWidth:    '280px',
          }}>
            End-to-end digital solutions for small businesses and startups across India and the Gulf. No in-house tech team needed.
          </p>

          {/* Region tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
            {['India', 'UAE', 'Qatar', 'Bahrain', 'Kuwait', 'Saudi Arabia'].map((region) => (
              <span key={region} style={{
                fontFamily:      'var(--font-body)',
                fontSize:        '11px',
                color:           '#888888',
                border:          '1px solid rgba(255,255,255,0.1)',
                borderRadius:    '4px',
                padding:         '3px 8px',
                letterSpacing:   '0.5px',
              }}>
                {region}
              </span>
            ))}
          </div>
        </div>

        {/* ---- COLUMN 2: NAVIGATION ---- */}
        <div>
          <h4 style={{
            fontFamily:    'var(--font-heading)',
            fontSize:      '13px',
            fontWeight:    700,
            color:         '#ffffff',
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
            marginBottom:  '20px',
          }}>
            Navigation
          </h4>
          <nav>
            {footerNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF6B35')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888888')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ---- COLUMN 3: SERVICES ---- */}
        <div>
          <h4 style={{
            fontFamily:    'var(--font-heading)',
            fontSize:      '13px',
            fontWeight:    700,
            color:         '#ffffff',
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
            marginBottom:  '20px',
          }}>
            Services
          </h4>
          {footerServices.map((service) => (
            <Link
              key={service}
              href="/services"
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#FF6B35')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888888')}
            >
              {service}
            </Link>
          ))}
        </div>

        {/* ---- COLUMN 4: CONTACT ---- */}
        <div>
          <h4 style={{
            fontFamily:    'var(--font-heading)',
            fontSize:      '13px',
            fontWeight:    700,
            color:         '#ffffff',
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
            marginBottom:  '20px',
          }}>
            Get In Touch
          </h4>

          {/* Email */}
          <a
            href="mailto:hello@stackworkhq.com"
            style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FF6B35')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888888')}
          >
            <Mail size={14} />
            hello@stackworkhq.com
          </a>

          {/* Locations */}
          <div style={{ ...linkStyle, display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'default' }}>
            <MapPin size={14} style={{ marginTop: '3px', flexShrink: 0 }} />
            <span>India & Gulf Region</span>
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="cta-pulse"
            style={{
              display:         'inline-flex',
              alignItems:      'center',
              gap:             '6px',
              marginTop:       '20px',
              backgroundColor: '#FF6B35',
              color:           '#ffffff',
              fontFamily:      'var(--font-body)',
              fontWeight:      500,
              fontSize:        '14px',
              padding:         '10px 20px',
              borderRadius:    '6px',
              textDecoration:  'none',
              transition:      'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e55a28')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6B35')}
          >
            Start a Project <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>

      {/* ---- BOTTOM BAR ---- */}
      <div
        style={{
          borderTop:      '1px solid rgba(255,255,255,0.07)',
          padding:        '20px 60px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(8,11,20,0.3)',
        }}
        className="footer-bottom"
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888888' }}>
          © {currentYear} Stackwork. All rights reserved.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888888' }}>
          stackworkhq.com
        </p>
      </div>
    </footer>
  )
}