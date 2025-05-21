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
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for deployed environment
    
    fetchOptions.signal = controller.signal;
    
    // Detailed logging for debugging network issues
    console.log('Fetch request options:', JSON.stringify({
      method: fetchOptions.method,
      headers: fetchOptions.headers,
      body: fetchOptions.body,
      credentials: fetchOptions.credentials,
      mode: fetchOptions.mode
    }));
    
    // Perform the actual fetch
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    
    // Log response headers for debugging
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', responseHeaders);

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
    
    // Get entire response text first for debugging
    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    // Try to parse as JSON
    let errorMessage;
    let errorData;
    try {
      // Parse the response text if it looks like JSON
      if (responseText && (responseText.startsWith('{') || responseText.startsWith('['))) {
        errorData = JSON.parse(responseText);
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
      } else {
        // If it's not JSON, use the response text as the error message
        errorMessage = responseText || `Error: ${response.statusText}`;
      }
    } catch (e) {
      console.error('Error parsing response JSON:', e);
      errorMessage = responseText || `Error: ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData; // Attach the complete error data for more context
    error.responseText = responseText; // Include the raw response for debugging
    throw error;
  } catch (error) {
    // Handle abort errors
    if (error.name === 'AbortError') {
      console.error('Request timed out after 15 seconds');
      const timeoutError = new Error('Request timed out. Please try again later.');
      timeoutError.status = 408; // Request Timeout
      throw timeoutError;
    }
    
    // For network errors (like CORS), provide more context
    if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
      console.error('Network error, possibly CORS related:', error);
      const networkError = new Error('Network error. This might be due to CORS restrictions or the backend being unavailable.');
      networkError.status = 0;
      networkError.isCorsError = true;
      throw networkError;
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

// Universal request function that tries multiple formats and approaches
export const universalRequest = async (endpoint, data, options = {}) => {
  const url = constructUrl(endpoint);
  const method = options.method || 'POST';
  
  console.log(`Starting universal request to ${url} with method ${method}`);
  
  // Create PascalCase version (first letter uppercase)
  const pascalCaseData = {};
  Object.entries(data).forEach(([key, value]) => {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    pascalCaseData[pascalKey] = value;
  });
  
  // Try multiple approaches in sequence
  
  // Approach 1: Standard JSON with PascalCase
  try {
    console.log('Trying PascalCase JSON approach');
    const pascalResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(pascalCaseData),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('PascalCase JSON status:', pascalResponse.status);
    
    if (pascalResponse.ok) {
      try {
        const responseData = await pascalResponse.json();
        console.log('PascalCase JSON response:', responseData);
        return responseData;
      } catch (parseError) {
        const text = await pascalResponse.text();
        console.log('PascalCase response (text):', text);
        return { message: text, success: true };
      }
    } else {
      const errorText = await pascalResponse.text();
      console.log('PascalCase JSON error text:', errorText);
    }
  } catch (pascalError) {
    console.error('PascalCase JSON error:', pascalError);
  }
  
  // Approach 2: Standard JSON with camelCase
  try {
    console.log('Trying camelCase JSON approach');
    const camelResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('camelCase JSON status:', camelResponse.status);
    
    if (camelResponse.ok) {
      try {
        const responseData = await camelResponse.json();
        console.log('camelCase JSON response:', responseData);
        return responseData;
      } catch (parseError) {
        const text = await camelResponse.text();
        console.log('camelCase response (text):', text);
        return { message: text, success: true };
      }
    } else {
      const errorText = await camelResponse.text();
      console.log('camelCase JSON error text:', errorText);
    }
  } catch (camelError) {
    console.error('camelCase JSON error:', camelError);
  }
  
  // Approach 3: Form URL encoded
  try {
    console.log('Trying form URL encoded approach');
    const formData = new URLSearchParams();
    
    // Add all fields to form data (PascalCase)
    Object.entries(pascalCaseData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    const formResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        ...options.headers
      },
      body: formData.toString(),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('Form URL encoded status:', formResponse.status);
    
    if (formResponse.ok) {
      try {
        const responseData = await formResponse.json();
        console.log('Form URL encoded response:', responseData);
        return responseData;
      } catch (parseError) {
        const text = await formResponse.text();
        console.log('Form URL encoded response (text):', text);
        return { message: text, success: true };
      }
    } else {
      const errorText = await formResponse.text();
      console.log('Form URL encoded error text:', errorText);
    }
  } catch (formError) {
    console.error('Form URL encoded error:', formError);
  }
  
  // Approach 4: Query string (GET only)
  if (method === 'GET') {
    try {
      console.log('Trying query string approach');
      
      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryUrl = `${url}?${queryParams.toString()}`;
      const queryResponse = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...options.headers
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      console.log('Query approach status:', queryResponse.status);
      
      if (queryResponse.ok) {
        try {
          const responseData = await queryResponse.json();
          console.log('Query approach response:', responseData);
          return responseData;
        } catch (parseError) {
          const text = await queryResponse.text();
          console.log('Query approach response (text):', text);
          return { message: text, success: true };
        }
      } else {
        const errorText = await queryResponse.text();
        console.log('Query approach error text:', errorText);
      }
    } catch (queryError) {
      console.error('Query approach error:', queryError);
    }
  }
  
  // If all approaches fail, throw an error
  throw new Error(`All request approaches failed for endpoint: ${endpoint}`);
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
    
    // For auth-related endpoints, use the universal request function to try multiple approaches
    if (endpoint.includes('/auth/')) {
      return universalRequest(endpoint, body, { method: 'POST', ...options });
    }
    
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
  
  // Direct access to the universal request function
  universal: universalRequest,
  
  // Export the normalizeEndpoint function for backward compatibility
  normalizeEndpoint,
  
  // Add back the status functions for backwards compatibility
  addBackendStatusListener,
  checkBackendStatus,
  baseUrl: BACKEND_URL
};

export default api;