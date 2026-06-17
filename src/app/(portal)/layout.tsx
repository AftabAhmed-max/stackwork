/* ============================================
   PORTAL ROOT LAYOUT
   The SECOND root layout in this app. It is a
   sibling of the marketing root layout and is
   completely independent: it renders its own
   <html>/<body> and deliberately does NOT mount
   the marketing PlexusBackground / Navbar / Footer.
   Because Next.js does not let a child opt out of
   a root layout, splitting the app into two route
   groups — each with its own root layout — is the
   only correct way to give the portal its own
   chrome while leaving the marketing pages
   visually untouched.
   ============================================ */
import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import '../globals.css'
import './portal.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Stackwork Portal',
  description: 'Secure client portal.',
  // Keep the portal out of search engines.
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D1B3E',
}

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="portal-body">{children}</body>
    </html>
  )
}
