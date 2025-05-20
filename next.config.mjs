/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: '/api',
    NEXT_SERVER_API_URL: process.env.NEXT_SERVER_API_URL || 'http://backend:5164'
  },
  // Enable production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: []
  },
  // Set production settings
  productionBrowserSourceMaps: false,
  swcMinify: true
};

export default nextConfig;