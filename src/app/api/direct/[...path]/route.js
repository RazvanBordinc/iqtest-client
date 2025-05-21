// src/app/api/direct/[...path]/route.js
// A direct API connector that uses a hardcoded backend URL

import { NextResponse } from 'next/server';

// CRITICAL ENDPOINTS: These endpoints will have hardcoded implementations
// This provides a last resort fallback independent of rewrites and proxies
const CRITICAL_ENDPOINTS = {
  'auth/check-username': true,
  'test/types': true,
  'health': true
};

// Hardcode the backend URL directly in this file as a last resort
const BACKEND_URL = 'https://iqtest-server-tkhl.onrender.com';

export async function GET(request, { params }) {
  // Get the path from the URL parameters
  const path = params.path || [];
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  // Only handle critical endpoints, return 404 for others
  if (!CRITICAL_ENDPOINTS[pathString]) {
    return NextResponse.json(
      { error: 'Endpoint not supported by direct API' },
      { status: 404 }
    );
  }
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const queryPart = queryString ? `?${queryString}` : '';
  
  // Construct the backend URL
  const targetUrl = `${BACKEND_URL}/api/${pathString}${queryPart}`;
  
  console.log(`Direct API GET request to: ${targetUrl}`);
  
  try {
    // Forward the request to the backend with retry logic
    let response = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!response && attempts < maxAttempts) {
      try {
        attempts++;
        response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Direct-API': 'true'
          },
          cache: 'no-store',
          next: { revalidate: 0 },
        });
      } catch (fetchError) {
        console.error(`Attempt ${attempts} failed:`, fetchError);
        if (attempts >= maxAttempts) throw fetchError;
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000 * attempts));
      }
    }
    
    // If we got a response, return it
    if (response) {
      const data = await response.text();
      
      // Create response headers
      const headers = new Headers();
      headers.set('Content-Type', response.headers.get('Content-Type') || 'application/json');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return new NextResponse(data, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    
    // If we get here, all retries failed
    return NextResponse.json(
      { error: 'All backend connection attempts failed' },
      { status: 502 }
    );
  } catch (error) {
    console.error('Direct API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', message: error.message },
      { status: 502 }
    );
  }
}

export async function POST(request, { params }) {
  // Get the path from the URL parameters
  const path = params.path || [];
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  // Only handle critical endpoints, return 404 for others
  if (!CRITICAL_ENDPOINTS[pathString]) {
    return NextResponse.json(
      { error: 'Endpoint not supported by direct API' },
      { status: 404 }
    );
  }
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const queryPart = queryString ? `?${queryString}` : '';
  
  // Construct the backend URL
  const targetUrl = `${BACKEND_URL}/api/${pathString}${queryPart}`;
  
  console.log(`Direct API POST request to: ${targetUrl}`);
  
  try {
    // Get request body
    let body;
    const contentType = request.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      body = await request.json();
    } else {
      body = await request.text();
    }
    
    // Forward the request to the backend with retry logic
    let response = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!response && attempts < maxAttempts) {
      try {
        attempts++;
        response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': contentType || 'application/json',
            'X-Direct-API': 'true'
          },
          body: contentType && contentType.includes('application/json') 
            ? JSON.stringify(body) 
            : body,
          cache: 'no-store',
          next: { revalidate: 0 },
        });
      } catch (fetchError) {
        console.error(`Attempt ${attempts} failed:`, fetchError);
        if (attempts >= maxAttempts) throw fetchError;
        // Wait before retrying
        await new Promise(r => setTimeout(r, 1000 * attempts));
      }
    }
    
    // If we got a response, return it
    if (response) {
      const data = await response.text();
      
      // Create response headers
      const headers = new Headers();
      headers.set('Content-Type', response.headers.get('Content-Type') || 'application/json');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return new NextResponse(data, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    
    // If we get here, all retries failed
    return NextResponse.json(
      { error: 'All backend connection attempts failed' },
      { status: 502 }
    );
  } catch (error) {
    console.error('Direct API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', message: error.message },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  // Handle OPTIONS requests for CORS preflight
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}