import type { NextConfig } from 'next'
import { SECURITY_HEADERS } from './src/lib/security-headers'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.0.113',
    '192.168.0.102',
    '192.168.0.110',
    'nodical-frowstily-jacques.ngrok-free.dev',
  ],
  // Apply the shared security headers to MARKETING + all non-portal
  // routes. Portal routes (/portal/*, /api/portal/*) get the identical
  // suite from src/proxy.ts, so this source pattern excludes them to
  // avoid duplicate headers. (L-04)
  async headers() {
    return [
      {
        source: '/((?!portal|api/portal).*)',
        headers: SECURITY_HEADERS,
      },
    ]
  },
}

export default nextConfig