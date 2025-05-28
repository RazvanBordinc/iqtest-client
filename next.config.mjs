/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // For server-side: default to Docker service for local dev, or API URL for prod
    NEXT_SERVER_API_URL: process.env.NEXT_SERVER_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? (process.env.BACKEND_API_URL || 'https://iqtest-server-project.onrender.com')
        : 'http://backend:5164'),
    
    // Direct backend URL for client-side direct access
    NEXT_PUBLIC_DIRECT_BACKEND_URL: process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL || 'https://iqtest-server-project.onrender.com',
    
    // Add deployment info for debugging
    NEXT_PUBLIC_DEPLOYMENT_INFO: JSON.stringify({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      backend: process.env.BACKEND_API_URL || 'https://iqtest-server-project.onrender.com',
      frontend: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    })
  },
  
  // Note: No rewrites - using direct backend access instead
  
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