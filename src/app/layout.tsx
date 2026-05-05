/* ============================================
   ROOT LAYOUT
   Wraps all pages. Loads fonts, sets metadata.
   ============================================ */
import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import PlexusBackground from '@/components/ui/PlexusBackground'

/* ---- Font Definitions ---- */
const syne = Syne({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

/* ---- Site Metadata ---- */
export const metadata: Metadata = {
  title: 'Stackwork — Digital Solutions',
  description: 'Web design, app development, analytics and more for businesses across India and the Gulf.',
}

/* ---- Viewport — fixes real mobile rendering ---- */
export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <PlexusBackground />
        <CustomCursor />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}