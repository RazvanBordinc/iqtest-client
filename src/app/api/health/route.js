// src/app/api/health/route.js
import { NextResponse } from 'next/server';

// This endpoint provides health status for the frontend and checks backend connectivity
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
      ? (process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com')
      : 'http://backend:5164');

  console.log('Health check using backend URL:', backendUrl);

  // Try to connect to the backend
  let backendStatus = 'unknown';
  let backendError = null;
  
  try {
    console.log('Attempting direct health check to:', `${backendUrl}/api/health`);
    
    // Make a request to the backend health endpoint with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const backendResponse = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Content-Type': 'application/json',
        'X-Health-Check': 'true'
      },
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
      console.warn(`Direct health check failed with status ${backendResponse.status}. Trying alternative method...`);
      backendStatus = 'potentially-down';
      backendError = `HTTP ${backendResponse.status}: ${backendResponse.statusText}`;
      
      // Try with test types as a fallback
      try {
        const testTypesResponse = await fetch(`${backendUrl}/api/test/types`, {
          method: 'GET',
          cache: 'no-store',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        
        if (testTypesResponse.ok) {
          backendStatus = 'up';
          backendError = null;
        } else {
          backendStatus = 'down';
          backendError = `Test types check failed: ${testTypesResponse.status}`;
        }
      } catch (fallbackError) {
        // Keep the status from the first attempt
        console.error('Fallback health check failed:', fallbackError);
      }
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