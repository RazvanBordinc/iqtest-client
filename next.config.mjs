/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // For client-side: default to relative path for API proxy
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    
    // For server-side: default to Docker service for local dev, or API URL for prod
    NEXT_SERVER_API_URL: process.env.NEXT_SERVER_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? process.env.BACKEND_API_URL  // Use a production fallback if available
        : 'http://backend:5164')       // Use Docker service name for local dev
  },
  
  // Configure API routes to be proxied to the backend
  async rewrites() {
    // Get the backend URL for proxying API requests
    const backendUrl = process.env.NEXT_SERVER_API_URL || 
      (process.env.NODE_ENV === 'production'
        ? process.env.BACKEND_API_URL
        : 'http://backend:5164');
        
    return [
      // Special rule to exclude /api/health - keep local implementation
      {
        source: '/api/health',
        destination: '/api/health',
      },
      
      // Proxy all API requests to the backend, ensuring we don't double up on /api
      {
        source: '/api/:path*',
        // Avoid duplicating the /api prefix when the backend URL already contains it
        destination: `${backendUrl}${backendUrl.endsWith('/api') ? '/' : '/api/'}:path*`,
      },
    ];
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