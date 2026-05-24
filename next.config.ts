import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.0.113',
    '192.168.0.102',
    '192.168.0.110',
    'nodical-frowstily-jacques.ngrok-free.dev',
  ],
}

export default nextConfig