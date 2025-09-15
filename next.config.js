/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Tắt ESLint trong quá trình build production
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-backend-domain.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  // Allow all origins for Replit proxy (dev only)
  allowedDevOrigins: ['*'],
  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          ...(isDev ? [] : [{
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.replit.com https://*.replit.dev",
          }]),
          ...(isDev ? [] : [{
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          }])
        ],
      },
    ];
  },
};

module.exports = nextConfig;
