/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // For client-side: default to relative path for API proxy
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    
    // For server-side: default to Docker service for local dev, or API URL for prod
    NEXT_SERVER_API_URL: process.env.NEXT_SERVER_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? (process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com')  // Use production URL with fallback
        : 'http://backend:5164'),      // Use Docker service name for local dev
    
    // Add a direct backend URL for client-side fallback
    NEXT_PUBLIC_DIRECT_BACKEND_URL: process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL || 'https://iqtest-server-tkhl.onrender.com',
    
    // Add deployment info for debugging
    NEXT_PUBLIC_DEPLOYMENT_INFO: JSON.stringify({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      backend: process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com',
      frontend: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    })
  },
  
  // Configure API routes to be proxied to the backend
  async rewrites() {
    console.log('Environment:', process.env.NODE_ENV);
    
    // Get the backend URL for proxying API requests
    const backendUrl = process.env.NEXT_SERVER_API_URL || 
      (process.env.NODE_ENV === 'production'
        ? (process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com') // Updated default
        : 'http://backend:5164');
        
    console.log('Backend URL for rewrites:', backendUrl);
    
    // Simplify rewrite configuration to avoid Vercel edge cases
    return {
      // Fallback routes - only processed if none of the beforeFiles routes match
      fallback: [
        // Forward all API requests to the backend except health
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        }
      ],
      
      // beforeFiles routes - processed before Next.js routing
      beforeFiles: [
        // Local health endpoint always takes precedence
        {
          source: '/api/health',
          destination: '/api/health',
        }
      ]
    };
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