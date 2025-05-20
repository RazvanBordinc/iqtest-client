/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_SERVER_API_URL: process.env.NEXT_SERVER_API_URL || 'http://backend:5164'
  },
  // Enable production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    // Optimize for Vercel
    unoptimized: false
  },
  
  // Ensure favicon and static files are handled correctly
  webpack(config) {
    return config;
  },
  
  // Static asset configuration
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Set production settings
  productionBrowserSourceMaps: false,
  swcMinify: true,
  
  // Vercel specific optimizations
  experimental: {
    // Use Vercel's Edge Runtime (better performance)
    runtime: 'edge',
    // Enable better code splitting
    optimizeCss: true,
    // Optimize server-side rendering
    serverComponents: true,
  },
  
  // Vercel Analytics - will use Vercel's analytics if available
  analyticsId: process.env.VERCEL_ANALYTICS_ID
};

export default nextConfig;