// src/fetch/api.js
import logger from '@/utils/logger';

// DIRECT BACKEND ACCESS CONFIGURATION
// Always use the direct backend URL instead of proxying through Next.js
const BACKEND_URL = typeof window === "undefined"
  // Server side - use server environment variable
  ? (process.env.NEXT_SERVER_API_URL || 'http://backend:5164')
  // Client side - use client environment variable with fallback
  : (process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL || 'https://iqtest-server-tkhl.onrender.com');

// Log configuration for debugging
logger.info('Backend configuration initialized', {
  backendUrl: BACKEND_URL,
  environment: process.env.NODE_ENV || 'development',
  isServer: typeof window === "undefined" 
});

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
        // Check if it's a valid JWT format (3 parts separated by dots)
        if (token.split('.').length === 3) {
          headers["Authorization"] = `Bearer ${token}`;
        } 
        // Invalid token format - don't set the header
        else {
          console.warn("Found invalid token format in cookie, not sending Authorization header");
        }
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

  // For health/wake endpoints, don't include credentials to avoid CORS issues
  const isHealthEndpoint = endpoint.includes('/health') || endpoint.includes('/wake');
  
  const fetchOptions = {
    ...options,
    headers: createHeaders(options.headers),
    credentials: isHealthEndpoint ? "omit" : "include", // Omit credentials for health checks
    mode: 'cors', // Enable CORS for cross-origin requests
  };

  // Special handling for auth endpoints
  const isAuthEndpoint = endpoint.includes('/auth/') || endpoint.includes('auth/');
  
  // Determine if this is a critical endpoint (moved outside try block)
  const isTestEndpoint = endpoint.includes('/test/') || endpoint.includes('test/');
  const isCriticalEndpoint = isAuthEndpoint || isTestEndpoint || endpoint.includes('/health') || endpoint.includes('health') || endpoint.includes('/wake') || endpoint.includes('wake');
  
  // Process request body if present for .NET model binding (additional safety check)
  if (fetchOptions.body && typeof fetchOptions.body === 'string') {
    try {
      const bodyStr = fetchOptions.body;
      // Only process if it's JSON
      if (bodyStr.startsWith('{') || bodyStr.startsWith('[')) {
        const parsedBody = JSON.parse(bodyStr);
        // For auth endpoints, ensure proper casing based on endpoint type
        const processedBody = isAuthEndpoint 
          ? formatDataForEndpoint(endpoint, parsedBody)
          : prepareRequestBody(parsedBody);
        fetchOptions.body = JSON.stringify(processedBody);
      }
    } catch (e) {
      // If parsing fails, leave body as is
      console.error('Error processing client-side request body:', e);
    }
  }

  try {
    // Enhanced timeout handling for Render free tier cold starts
    const controller = new AbortController();
    
    // Increased timeouts for Render free tier (can take up to 60s to wake)
    const timeoutDuration = isCriticalEndpoint ? 60000 : 30000; // 60s for critical, 30s for others
    
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    fetchOptions.signal = controller.signal;
    
    // Log the API request
    logger.api(endpoint, 0, {
      method: fetchOptions.method || 'GET',
      url,
      event: 'api_request_start',
      headers: { 
        // Only log non-sensitive headers
        ...(fetchOptions.headers?.['Content-Type'] && { 'Content-Type': fetchOptions.headers['Content-Type'] }),
      },
      // Don't log body for privacy
      hasBody: !!fetchOptions.body,
      credentials: fetchOptions.credentials,
      mode: fetchOptions.mode
    });
    
    // Perform the actual fetch
    const startTime = performance.now();
    const response = await fetch(url, fetchOptions);
    const duration = performance.now() - startTime;
    clearTimeout(timeoutId);
    
    // Log response details
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      // Only collect non-sensitive headers
      if (['content-type', 'cache-control', 'date'].includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });
    
    // Log the successful response
    logger.api(endpoint, response.status, {
      method: fetchOptions.method || 'GET',
      event: 'api_response_received',
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      duration: `${Math.round(duration)}ms`
    });

    if (response.ok) {
      return await handleResponse(response);
    }
    
    // Log error response
    logger.api(endpoint, response.status, {
      method: fetchOptions.method || 'GET',
      event: 'api_request_error',
      status: response.status,
      statusText: response.statusText,
      url: url.split('?')[0] // Exclude query params for privacy
    });
    
    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to auth page for auth errors
      if (typeof window !== 'undefined' && 
          window.location.pathname !== "/" && 
          window.location.pathname !== "/auth") {
        logger.info('Authentication required, redirecting to auth page', {
          event: 'auth_redirect',
          from: window.location.pathname,
          status: 401
        });
        window.location.href = "/auth";
      }
      throw new Error("Authentication required");
    }
    
    // Handle rate limiting errors (429 Too Many Requests)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      
      logger.warn('Rate limit exceeded', {
        event: 'rate_limit',
        endpoint,
        retryAfter: retryAfter || 'unknown'
      });
      
      const error = new Error("Rate limit exceeded. Please try again later.");
      error.status = 429;
      error.isRateLimit = true;
      
      // Try to extract the retry-after header if present
      if (retryAfter) {
        error.retryAfter = parseInt(retryAfter, 10);
      }
      
      throw error;
    }
    
    // Get entire response text first for debugging
    const responseText = await response.text();
    
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
            
            // Log validation errors more cleanly
            logger.exception(errorMessage, {
              event: 'api_validation_error',
              endpoint,
              status: 400,
              errors: errorData.errors
            });
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
    // Handle abort errors with server wake-up logic
    if (error.name === 'AbortError') {
      logger.warn('Request timed out', {
        event: 'api_timeout',
        endpoint,
        method: fetchOptions.method || 'GET',
        timeout: `${timeoutDuration}ms`
      });
      
      // Try server wake-up for critical endpoints that timeout
      if (isCriticalEndpoint && !endpoint.includes('/wake')) {
        try {
          logger.info('Attempting server wake-up after timeout', {
            event: 'wake_up_attempt',
            endpoint,
            reason: 'timeout'
          });
          
          const { wakeUpServer } = await import('@/utils/serverWakeup');
          const wakeResult = await wakeUpServer();
          
          if (wakeResult.success) {
            // Retry the original request once
            logger.info('Retrying request after successful wake-up', {
              event: 'retry_after_wake',
              endpoint
            });
            
            const retryController = new AbortController();
            const retryTimeoutId = setTimeout(() => retryController.abort(), 60000); // 60s for retry
            
            const retryResponse = await fetch(url, {
              ...fetchOptions,
              signal: retryController.signal
            });
            
            clearTimeout(retryTimeoutId);
            
            if (retryResponse.ok) {
              return await handleResponse(retryResponse);
            }
          }
        } catch (wakeError) {
          logger.warn('Server wake-up failed', {
            event: 'wake_up_failed',
            endpoint,
            error: wakeError.message
          });
        }
      }
      
      const timeoutError = new Error('Server is starting up. This may take up to 60 seconds on first visit.');
      timeoutError.status = 408; // Request Timeout
      timeoutError.isServerSleep = true;
      throw timeoutError;
    }
    
    // For network errors (like CORS), provide more context
    if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
      logger.error('Network error detected', {
        event: 'network_error',
        endpoint,
        method: fetchOptions.method || 'GET',
        message: error.message,
        possibleCause: 'CORS or backend unavailable'
      });
      
      
      const networkError = new Error('Network error. This might be due to CORS restrictions or the backend being unavailable.');
      networkError.status = 0;
      networkError.isCorsError = true;
      throw networkError;
    }
    
    // Generic error handling
    logger.exception(error, {
      event: 'api_request_exception',
      endpoint,
      method: fetchOptions.method || 'GET'
    });
    
    
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

  // Add a special header for direct backend access to help with rate limiting
  headers["X-Direct-Backend-Fallback"] = "true";

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
    // Log the server-side API request
    logger.api(endpoint, 0, {
      method: options.method || 'GET',
      url: url.split('?')[0], // Exclude query params for privacy
      event: 'server_api_request_start',
      isServer: true
    });
    
    const startTime = Date.now(); // Use Date.now() on server-side
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || "no-store",
    });
    const duration = Date.now() - startTime;

    // Log the response
    logger.api(endpoint, response.status, {
      method: options.method || 'GET',
      event: 'server_api_response',
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      isServer: true
    });

    if (response.ok) {
      return await handleResponse(response);
    }

    // Log the error response
    logger.error(`Server API error: ${response.status}`, {
      event: 'server_api_error',
      endpoint,
      status: response.status,
      statusText: response.statusText
    });
    
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
    // Log the server-side API error
    logger.exception(error, {
      event: 'server_api_exception',
      endpoint,
      method: options.method || 'GET',
      isServer: true
    });
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

// Retry wrapper for API calls with exponential backoff
export const withRetry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 5000,
    retryCondition = (error) => error.isServerSleep || error.status === 408 || error.status === 503 || error.name === 'AbortError'
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if this is the last attempt or error doesn't meet retry condition
      if (attempt === maxRetries || !retryCondition(error)) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      logger.info('Retrying API call after error', {
        event: 'api_retry',
        attempt: attempt + 1,
        maxRetries,
        delay: `${delay}ms`,
        error: error.message,
        status: error.status
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
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
  // Log the health check
  logger.info('Backend health check', {
    event: 'backend_health_check',
    assumeActive: true,
    directBackendAccess: true
  });
  return true; // Backend is always considered active with direct access
};

// Helper function to format data based on the endpoint
function formatDataForEndpoint(endpoint, data) {
  // Handle null or undefined data
  if (!data) return {};
  
  // Create a deep copy to avoid modifying the original
  const formattedData = JSON.parse(JSON.stringify(data));
  
  // Check endpoint type
  if (endpoint.includes('check-username')) {
    // Username check requires a specific format with PascalCase property names
    // This matches the C# DTO: public class CheckUsernameDto { public string Username { get; set; } }
    return { Username: data.username || data.Username };
  }
  
  if (endpoint.includes('create-user') || endpoint.includes('register')) {
    // User creation/registration endpoints
    return {
      Username: data.username || data.Username,
      Password: data.password || data.Password,
      Country: data.country || data.Country,
      Age: data.age || data.Age
    };
  }
  
  if (endpoint.includes('login')) {
    // Login endpoints
    return {
      Username: data.username || data.Username,
      Password: data.password || data.Password
    };
  }
  
  // For other endpoints, convert all keys to PascalCase
  const pascalCaseData = {};
  Object.entries(data).forEach(([key, value]) => {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    pascalCaseData[pascalKey] = value;
  });
  
  return pascalCaseData;
}

// Main API object
const api = {
  get: (endpoint, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    
    // Use retry wrapper for client-side requests
    if (!isServer && options.retry !== false) {
      return withRetry(() => fetchFunction(endpoint, { ...options, method: "GET" }));
    }
    
    return fetchFunction(endpoint, { ...options, method: "GET" });
  },

  post: (endpoint, body, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    
    // Process the body for proper .NET model binding
    // For auth endpoints, ensure proper casing
    const isAuthEndpoint = endpoint.includes('/auth/');
    const processedBody = isAuthEndpoint 
      ? formatDataForEndpoint(endpoint, body)
      : prepareRequestBody(body);
    
    const fetchOptions = {
      ...options,
      method: "POST",
      body: JSON.stringify(processedBody),
    };
    
    // Use retry wrapper for client-side requests
    if (!isServer && options.retry !== false) {
      return withRetry(() => fetchFunction(endpoint, fetchOptions));
    }
    
    return fetchFunction(endpoint, fetchOptions);
  },

  put: (endpoint, body, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    
    // Process the body for proper .NET model binding
    const processedBody = prepareRequestBody(body);
    
    const fetchOptions = {
      ...options,
      method: "PUT",
      body: JSON.stringify(processedBody),
    };
    
    // Use retry wrapper for client-side requests
    if (!isServer && options.retry !== false) {
      return withRetry(() => fetchFunction(endpoint, fetchOptions));
    }
    
    return fetchFunction(endpoint, fetchOptions);
  },

  delete: (endpoint, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    
    // Use retry wrapper for client-side requests
    if (!isServer && options.retry !== false) {
      return withRetry(() => fetchFunction(endpoint, { ...options, method: "DELETE" }));
    }
    
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