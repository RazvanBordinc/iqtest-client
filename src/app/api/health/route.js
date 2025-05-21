// src/app/api/health/route.js
import { NextResponse } from 'next/server';

// This endpoint is used as a fallback health check when the backend is not available
// It's accessed directly by the frontend health check logic
export async function GET() {
  // Add CORS headers to ensure the response can be accessed from any origin
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  });

  // Get the backend URL from environment variables
  const backendUrl = process.env.NEXT_SERVER_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_API_URL || 'https://iqtest-server.onrender.com')
      : 'http://backend:5164');

  console.log('Health check using backend URL:', backendUrl);

  // Try to connect to the backend health endpoint
  let backendStatus = 'unknown';
  let backendError = null;
  try {
    // Make a request to the backend health endpoint with a short timeout
    const backendHealthUrl = `${backendUrl}/api/health`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const backendResponse = await fetch(backendHealthUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      next: { revalidate: 0 },
    });
    
    clearTimeout(timeoutId);
    
    if (backendResponse.ok) {
      backendStatus = 'up';
      
      try {
        const backendData = await backendResponse.json();
        backendStatus = backendData?.status === 'ok' ? 'up' : 'degraded';
      } catch (jsonError) {
        backendStatus = 'degraded';
      }
    } else {
      backendStatus = 'down';
      backendError = `HTTP ${backendResponse.status}: ${backendResponse.statusText}`;
    }
  } catch (error) {
    backendStatus = 'down';
    backendError = error.message || 'Unable to reach backend';
    console.error('Backend health check failed:', error);
  }

  return NextResponse.json(
    { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'frontend', // Indicate this is the frontend health check
      environment: process.env.NODE_ENV || 'development',
      backend: {
        status: backendStatus,
        url: backendUrl,
        error: backendError
      }
    },
    { 
      status: 200,
      headers: headers
    }
  );
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  });

  return new NextResponse(null, { status: 204, headers });
}