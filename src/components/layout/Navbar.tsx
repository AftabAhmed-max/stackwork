'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Services',  href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
]

export default function Navbar() {
  const pathname                = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      {/* ---- Responsive styles ---- */}
      <style>{`
        .sw-nav-desktop { display: flex !important; }
        .sw-nav-mobile  { display: none !important; }
        @media (max-width: 900px) {
          .sw-nav-desktop { display: none !important; }
          .sw-nav-mobile  { display: flex !important; }
          .sw-nav-padding { padding: 0 16px !important; }
        }
      `}</style>

      {/* ---- Header ---- */}
      <header style={{
        position:             'fixed',
        top:                  0, left: 0, right: 0,
        zIndex:               1000,
        height:               '88px',
        backgroundColor: scrolled ? 'rgba(8,11,20,0.85)' : 'transparent',
        backdropFilter:  'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom:    scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition:           'all 0.3s ease',
      }}>
        <div style={{
          height:         '88px',
          padding:        '0 60px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
        }}
        className="sw-nav-padding">

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect x="4"  y="8"  width="24" height="7" rx="3" fill="#FF6B35" />
              <rect x="8"  y="19" width="18" height="7" rx="3" fill="#FF6B35" fillOpacity="0.75" />
              <rect x="12" y="30" width="12" height="7" rx="3" fill="#ffffff"  fillOpacity="0.50" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '24px', lineHeight: '1' }}>
                <span style={{ color: '#ffffff' }}>Stack</span>
                <span style={{ color: '#FF6B35' }}>work</span>
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '8px', letterSpacing: '3px', color: '#6B7280', textTransform: 'uppercase' }}>
                Digital Solutions
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="sw-nav-desktop" style={{ gap: '40px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={pathname === link.href ? 'nav-active' : ''} style={{
                  fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 500,
                  textDecoration: 'none',
                  color:        pathname === link.href ? '#FF6B35' : '#ffffff',
                  borderBottom: pathname === link.href ? '2px solid #FF6B35' : '2px solid transparent',
                  paddingBottom: '3px',
                }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link href="/contact" className="sw-nav-desktop cta-pulse" style={{
            backgroundColor: '#FF6B35', color: '#ffffff',
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '15px',
            padding: '11px 26px', borderRadius: '6px', textDecoration: 'none',
            alignItems: 'center',
          }}>
            Start a Project
          </Link>

          {/* Mobile hamburger */}
          <button
            className="sw-nav-mobile"
            onClick={() => setMenuOpen(prev => !prev)}
            style={{
              background:     'none',
              border:         '1px solid rgba(255,255,255,0.25)',
              borderRadius:   '8px',
              color:          '#ffffff',
              cursor:         'pointer',
              padding:        '8px 10px',
              alignItems:     'center',
              justifyContent: 'center',
              WebkitAppearance: 'none',
              touchAction:    'manipulation',
              zIndex:         1001,
              position:       'relative',
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </header>

      {/* ---- Mobile menu overlay ---- */}
      {menuOpen && (
        <div style={{
          position:        'fixed',
          top:             '88px', left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(8,11,20,0.75)',
          backdropFilter:  'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex:          999,
          padding:         '24px 28px 40px',
          display:         'flex',
          flexDirection:   'column',
          overflowY:       'auto',
          borderTop:       '1px solid rgba(255,255,255,0.08)',
        }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{
              display: 'block', padding: '16px 0',
              fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700,
              textDecoration: 'none',
              color:        pathname === link.href ? '#FF6B35' : '#ffffff',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              {link.label}
            </Link>
          ))}

          <Link href="/contact" className="cta-pulse" style={{
            display: 'block', marginTop: '28px',
            backgroundColor: '#FF6B35', color: '#ffffff',
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '16px',
            padding: '15px 24px', borderRadius: '6px',
            textDecoration: 'none', textAlign: 'center',
          }}>
            Start a Project
          </Link>

          <p style={{ marginTop: 'auto', paddingTop: '32px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888888', textAlign: 'center' }}>
            hello@stackworkhq.com
          </p>
        </div>
      )}
    </>
  )
}