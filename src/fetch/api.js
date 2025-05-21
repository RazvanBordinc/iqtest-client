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

  // Process request body if present for .NET model binding (additional safety check)
  if (fetchOptions.body && typeof fetchOptions.body === 'string') {
    try {
      const bodyStr = fetchOptions.body;
      // Only process if it's JSON
      if (bodyStr.startsWith('{') || bodyStr.startsWith('[')) {
        const parsedBody = JSON.parse(bodyStr);
        const processedBody = prepareRequestBody(parsedBody);
        fetchOptions.body = JSON.stringify(processedBody);
      }
    } catch (e) {
      // If parsing fails, leave body as is
      console.error('Error processing client-side request body:', e);
    }
  }

  try {
    // Add timeout to avoid hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    fetchOptions.signal = controller.signal;
    
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

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
    
    // Handle rate limiting errors (429 Too Many Requests)
    if (response.status === 429) {
      const error = new Error("Rate limit exceeded. Please try again later.");
      error.status = 429;
      error.isRateLimit = true;
      
      // Try to extract the retry-after header if present
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        error.retryAfter = parseInt(retryAfter, 10);
      }
      
      throw error;
    }
    
    // Handle other error responses
    let errorMessage;
    let errorData;
    try {
      errorData = await response.json();
      errorMessage = errorData?.message || `Error: ${response.statusText}`;
      
      // For 400 Bad Request errors, provide more detailed information
      if (response.status === 400) {
        console.warn('Bad Request details:', errorData);
        
        // If we have model validation errors, format them nicely
        if (errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          
          errorMessage = `Validation failed: ${validationErrors}`;
        }
      }
    } catch (e) {
      errorMessage = `Error: ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData; // Attach the complete error data for more context
    throw error;
  } catch (error) {
    // Handle abort errors
    if (error.name === 'AbortError') {
      console.error('Request timed out after 10 seconds');
      const timeoutError = new Error('Request timed out. Please try again later.');
      timeoutError.status = 408; // Request Timeout
      throw timeoutError;
    }
    
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

  // Process request body if present for .NET model binding
  if (options.body && typeof options.body === 'string') {
    try {
      const parsedBody = JSON.parse(options.body);
      const processedBody = prepareRequestBody(parsedBody);
      options.body = JSON.stringify(processedBody);
    } catch (e) {
      // If JSON parsing fails, leave body as is
      console.error('Error processing server-side request body:', e);
    }
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
    let errorData;
    try {
      errorData = await response.json();
      errorMessage = errorData?.message || `Server error: ${response.statusText}`;
      
      // For 400 Bad Request errors, provide more detailed information
      if (response.status === 400 && errorData.errors) {
        console.warn('Bad Request details (server):', errorData);
      }
    } catch (e) {
      errorMessage = `Server error: ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    throw error;
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

// Prepare data for model binding in .NET
function prepareRequestBody(body) {
  // If body is null or undefined, return it as is
  if (body == null) return body;
  
  // Log the original request body for debugging
  console.log('Original request body:', JSON.stringify(body));
  
  // Simple types don't need processing
  if (typeof body !== 'object' || Array.isArray(body)) return body;
  
  // For objects, check if it might be a DTO that needs proper casing for .NET model binding
  const processedBody = {};
  
  // Keep original properties untouched
  // The specific API functions should provide property names with correct casing
  // This preserves any already-correctly-cased properties sent from the auth.js methods
  for (const [key, value] of Object.entries(body)) {
    processedBody[key] = value;
  }
  
  // Log the processed request body for debugging
  console.log('Processed request body:', JSON.stringify(processedBody));
  return processedBody;
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
    
    // Process the body for proper .NET model binding
    const processedBody = prepareRequestBody(body);
    
    return fetchFunction(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(processedBody),
    });
  },

  put: (endpoint, body, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    
    // Process the body for proper .NET model binding
    const processedBody = prepareRequestBody(body);
    
    return fetchFunction(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(processedBody),
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