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

  return NextResponse.json(
    { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'frontend', // Indicate this is the frontend health check
      environment: process.env.NODE_ENV || 'development'
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