// src/app/api/proxy/[...path]/route.js
// A more reliable proxy API route that forwards requests to the backend

import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // Get the path from the URL parameters (everything after /api/proxy/)
  const path = params.path || [];
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const queryPart = queryString ? `?${queryString}` : '';
  
  // Get backend URL from environment variable or fallback
  const backendUrl = process.env.NEXT_SERVER_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com')
      : 'http://backend:5164');
  
  // Construct the backend URL
  const targetUrl = `${backendUrl}/api/${pathString}${queryPart}`;
  
  console.log(`Proxying GET request to: ${targetUrl}`);
  
  try {
    // Create headers to forward
    const headers = new Headers();
    
    // Forward most request headers, except host
    for (const [key, value] of request.headers.entries()) {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    }
    
    // Add proxy identification header
    headers.set('X-Forwarded-By', 'Next.js Proxy API');
    
    // Forward the request to the backend
    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
    
    // Create a response object with the same status and headers
    const responseHeaders = new Headers();
    
    // Forward CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    
    // Forward content type
    if (backendResponse.headers.get('Content-Type')) {
      responseHeaders.set('Content-Type', backendResponse.headers.get('Content-Type'));
    }
    
    // Get response body
    const data = await backendResponse.text();
    
    // Return the response
    return new NextResponse(data, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', message: error.message },
      { status: 502 }
    );
  }
}

export async function POST(request, { params }) {
  // Get the path from the URL parameters (everything after /api/proxy/)
  const path = params.path || [];
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const queryPart = queryString ? `?${queryString}` : '';
  
  // Get backend URL from environment variable or fallback
  const backendUrl = process.env.NEXT_SERVER_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com')
      : 'http://backend:5164');
  
  // Construct the backend URL
  const targetUrl = `${backendUrl}/api/${pathString}${queryPart}`;
  
  console.log(`Proxying POST request to: ${targetUrl}`);
  
  try {
    // Get the request body
    let body;
    const contentType = request.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      body = await request.json();
    } else {
      body = await request.text();
    }
    
    // Create headers to forward
    const headers = new Headers();
    
    // Forward most request headers, except host
    for (const [key, value] of request.headers.entries()) {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    }
    
    // Add proxy identification header
    headers.set('X-Forwarded-By', 'Next.js Proxy API');
    
    // Forward the request to the backend
    const backendResponse = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: contentType && contentType.includes('application/json') ? JSON.stringify(body) : body,
      credentials: 'include',
      cache: 'no-store',
    });
    
    // Create a response object with the same status and headers
    const responseHeaders = new Headers();
    
    // Forward CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    
    // Forward content type
    if (backendResponse.headers.get('Content-Type')) {
      responseHeaders.set('Content-Type', backendResponse.headers.get('Content-Type'));
    }
    
    // Get response body
    const data = await backendResponse.text();
    
    // Return the response
    return new NextResponse(data, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', message: error.message },
      { status: 502 }
    );
  }
}

export async function PUT(request, { params }) {
  // Get the path from the URL parameters (everything after /api/proxy/)
  const path = params.path || [];
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const queryPart = queryString ? `?${queryString}` : '';
  
  // Get backend URL from environment variable or fallback
  const backendUrl = process.env.NEXT_SERVER_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com')
      : 'http://backend:5164');
  
  // Construct the backend URL
  const targetUrl = `${backendUrl}/api/${pathString}${queryPart}`;
  
  console.log(`Proxying PUT request to: ${targetUrl}`);
  
  try {
    // Get the request body
    let body;
    const contentType = request.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      body = await request.json();
    } else {
      body = await request.text();
    }
    
    // Create headers to forward
    const headers = new Headers();
    
    // Forward most request headers, except host
    for (const [key, value] of request.headers.entries()) {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    }
    
    // Add proxy identification header
    headers.set('X-Forwarded-By', 'Next.js Proxy API');
    
    // Forward the request to the backend
    const backendResponse = await fetch(targetUrl, {
      method: 'PUT',
      headers,
      body: contentType && contentType.includes('application/json') ? JSON.stringify(body) : body,
      credentials: 'include',
      cache: 'no-store',
    });
    
    // Create a response object with the same status and headers
    const responseHeaders = new Headers();
    
    // Forward CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    
    // Forward content type
    if (backendResponse.headers.get('Content-Type')) {
      responseHeaders.set('Content-Type', backendResponse.headers.get('Content-Type'));
    }
    
    // Get response body
    const data = await backendResponse.text();
    
    // Return the response
    return new NextResponse(data, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', message: error.message },
      { status: 502 }
    );
  }
}

export async function OPTIONS(request) {
  // Handle OPTIONS requests for CORS preflight
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}