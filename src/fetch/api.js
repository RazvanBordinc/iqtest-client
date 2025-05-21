// src/fetch/api.js

// DIRECT BACKEND ACCESS CONFIGURATION
// Always use the direct backend URL instead of proxying through Next.js
const BACKEND_URL = typeof window === "undefined"
  // Server side - use server environment variable
  ? (process.env.NEXT_SERVER_API_URL || 'http://backend:5164')
  // Client side - use client environment variable with fallback
  : (process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL || 'https://iqtest-server-tkhl.onrender.com');

// Log configuration for debugging
console.log('Backend URL configured as:', BACKEND_URL);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Backend status tracking (simplified implementation to maintain compatibility)
let backendStatusListeners = [];
let isBackendActive = true; // Assume backend is always active with direct access

// Create headers with auth token if available
export const createHeaders = (additionalHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  // Only import getCookie on client-side
  if (typeof window !== "undefined") {
    try {
      const { getCookie } = require("@/utils/cookies");
      const token = getCookie("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token from cookies:', error);
    }
  }

  return headers;
};

// Client-side fetch function with direct backend access
export const clientFetch = async (endpoint, options = {}) => {
  // Construct the complete URL to the backend API
  const url = constructUrl(endpoint);
  console.log('Client-side API request to URL:', url);

  const fetchOptions = {
    ...options,
    headers: createHeaders(options.headers),
    credentials: "include", // Include cookies
    mode: 'cors', // Enable CORS for cross-origin requests
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.ok) {
      return await handleResponse(response);
    }
    
    console.warn(`Client-side API request failed: ${response.status} ${response.statusText} for URL: ${url}`);
    
    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to auth page for auth errors
      if (typeof window !== 'undefined' && 
          window.location.pathname !== "/" && 
          window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
      throw new Error("Authentication required");
    }
    
    // Handle other error responses
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || `Error: ${response.statusText}`;
    } catch (e) {
      errorMessage = `Error: ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  } catch (error) {
    console.error('Client-side API request error:', error);
    throw error;
  }
};

// Server-side fetch function
export const serverFetch = async (endpoint, options = {}) => {
  // Import cookies dynamically for server-side use
  let token = null;
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  } catch (error) {
    console.error('Error accessing cookies on server:', error);
  }

  // Construct the complete URL to the backend API
  const url = constructUrl(endpoint);
  console.log('Server-side API request to URL:', url);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || "no-store",
    });

    if (response.ok) {
      return await handleResponse(response);
    }

    console.error(`Server-side API request failed: ${response.status} ${response.statusText}`);
    
    // Try to get error details from response
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || `Server error: ${response.statusText}`;
    } catch (e) {
      errorMessage = `Server error: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  } catch (error) {
    console.error('Server-side API request error:', error);
    throw error;
  }
};

// Helper function to normalize API paths (exported for backward compatibility)
export const normalizeEndpoint = (endpoint) => {
  // Ensure endpoint starts without a slash for consistent handling
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If endpoint starts with 'api/', keep it as is
  if (cleanEndpoint.startsWith('api/')) {
    return cleanEndpoint;
  }
  
  // Otherwise, return the endpoint as is
  return cleanEndpoint;
};

// Constructs a complete URL to the backend API
function constructUrl(endpoint) {
  // First, clean the endpoint by removing any leading slash
  const cleanEndpoint = normalizeEndpoint(endpoint);
  
  // Ensure the backend URL has a trailing slash
  const baseUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL : `${BACKEND_URL}/`;
  
  // Ensure endpoint has api/ prefix if needed
  if (cleanEndpoint.startsWith('api/')) {
    // Endpoint already has api/ prefix
    return `${baseUrl}${cleanEndpoint}`;
  } else {
    // Need to add api/ prefix
    return `${baseUrl}api/${cleanEndpoint}`;
  }
}

// Handle response parsing
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return null;
    }
  }

  return await response.text();
}

// Add a status change listener (compatibility function)
export const addBackendStatusListener = (callback) => {
  backendStatusListeners.push(callback);
  // Immediately notify with current status (always active with direct backend)
  callback({ isActive: true, spinUpInProgress: false });
  return () => {
    backendStatusListeners = backendStatusListeners.filter(cb => cb !== callback);
  };
};

// Check backend status (compatibility function - always returns true with direct access)
export const checkBackendStatus = async () => {
  return true; // Backend is always considered active with direct access
};

// Main API object
const api = {
  get: (endpoint, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(endpoint, { ...options, method: "GET" });
  },

  post: (endpoint, body, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: (endpoint, body, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete: (endpoint, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(endpoint, { ...options, method: "DELETE" });
  },
  
  // Export the normalizeEndpoint function for backward compatibility
  normalizeEndpoint,
  
  // Add back the status functions for backwards compatibility
  addBackendStatusListener,
  checkBackendStatus,
  baseUrl: BACKEND_URL
};

export default api;