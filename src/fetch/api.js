// src/fetch/api.js

// Determine if we're in production on Vercel immediately
const isVercelProduction = typeof window !== "undefined" && 
  window.location.hostname.includes('vercel.app');

// Use environment variables for API URLs with fallbacks for production
const API_URL = typeof window === "undefined"
  ? (process.env.NEXT_SERVER_API_URL || 
     (process.env.NODE_ENV === 'production' 
       ? (process.env.BACKEND_API_URL || 'https://iqtest-server-tkhl.onrender.com') 
       : 'http://backend:5164'))  // Server-side from env
  : (process.env.NEXT_PUBLIC_API_URL || "/api"); // Client-side from env

// Get the direct backend URL for fallback in production
const DIRECT_BACKEND_URL = process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL || 'https://iqtest-server-tkhl.onrender.com';

// Log API configuration for debugging
console.log('API_URL configured as:', API_URL);
console.log('Direct backend URL configured as:', DIRECT_BACKEND_URL);
console.log('Environment:', process.env.NODE_ENV || 'development');
if (isVercelProduction) {
  console.log('Running in Vercel production environment');
}

// Create headers with auth token if available
export const createHeaders = (additionalHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  // Only import getCookie on client-side
  if (typeof window !== "undefined") {
    const { getCookie } = require("@/utils/cookies");
    const token = getCookie("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Backend status tracking
let backendStatusListeners = [];
let isBackendActive = false;
let spinUpInProgress = false;
let lastCheckTime = 0;
const CHECK_INTERVAL = 5000; // 5 seconds

// Function to check if backend is active
export const checkBackendStatus = async () => {
  // Don't check too frequently
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL) {
    return isBackendActive;
  }
  
  lastCheckTime = now;
  
  // Only mark as in progress if we haven't started yet
  if (!spinUpInProgress && !isBackendActive) {
    spinUpInProgress = true;
    notifyBackendStatusListeners();
  }
  
  // Determine if we're in production on Vercel
  const isVercelProduction = typeof window !== "undefined" && 
    window.location.hostname.includes('vercel.app');
  
  // First check our frontend health endpoint - this should always work
  try {
    // Always check the frontend health first to determine if frontend is running
    const frontendHealthUrl = '/api/health';
    
    console.log('Checking frontend health at:', frontendHealthUrl);
    const frontendResponse = await fetch(frontendHealthUrl, {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 0 },
      timeout: 5000, // Longer timeout for Vercel cold starts
    });
    
    if (!frontendResponse.ok) {
      console.warn('Frontend health check failed');
      // Don't immediately fail - we'll try the backend check
    } else {
      console.log('Frontend health check succeeded');
      
      // Try to parse the health response to get backend status
      try {
        const healthData = await frontendResponse.json();
        console.log('Health check data:', healthData);
        
        // If the health endpoint reports backend status, use that
        if (healthData && healthData.backend && healthData.backend.status === 'up') {
          console.log('Backend reported as up by health check');
          isBackendActive = true;
          spinUpInProgress = false;
          notifyBackendStatusListeners();
          return true;
        }
      } catch (parseError) {
        console.warn('Could not parse health check response', parseError);
      }
    }
    
    // If we're in client-side rendering, try direct backend access
    if (typeof window !== "undefined") {
      // If in production, try fetching directly from the backend for diagnostic purposes
      if (isVercelProduction) {
        console.log('Running in Vercel production environment, attempting direct backend access');
        
        try {
          // In production, continue with fallback for diagnosis
          // Use the environment variable for the backend URL
          const directBackendUrl = `${DIRECT_BACKEND_URL}/api/health`;
          console.log('Checking direct backend access at:', directBackendUrl);
          
          const directResponse = await fetch(directBackendUrl, {
            method: 'GET',
            cache: 'no-store',
            mode: 'cors', // Allow CORS for direct backend access
            credentials: 'omit', // Don't send cookies for this diagnostic check
            timeout: 5000,
          });
          
          if (directResponse.ok) {
            console.log('Direct backend access successful');
            // If direct access works, the issue is likely with the Vercel rewrites
            // We'll still continue normally using the proxied endpoints
          } else {
            console.warn('Direct backend access failed:', directResponse.status, directResponse.statusText);
          }
        } catch (directError) {
          console.warn('Direct backend access error:', directError);
        }
      }
      
      // Client-side: try to contact backend through a lightweight API
      try {
        // Construct the URL carefully to avoid double api issue
        const testTypesUrl = API_URL === '/api' ? '/api/test/types' : `${API_URL}/test/types`;
        
        console.log('Checking backend API at:', testTypesUrl);
        const testResponse = await fetch(testTypesUrl, {
          method: 'GET',
          headers: createHeaders(),
          cache: 'no-store',
          credentials: 'same-origin',
          next: { revalidate: 0 },
          timeout: 8000, // Longer timeout for Render cold starts
        });
        
        if (testResponse.ok) {
          console.log('Backend API check successful');
          isBackendActive = true;
          spinUpInProgress = false;
          notifyBackendStatusListeners();
          return true;
        } else {
          console.warn('Backend API check failed:', testResponse.status, testResponse.statusText);
        }
      } catch (error) {
        // Backend API is not reachable, but frontend is working
        console.warn('Backend API check failed:', error);
        // We'll continue with the app since the frontend is working
      }
    }
    
    // If we have a browser environment and frontend is working,
    // consider the app active even if backend isn't yet
    if (typeof window !== "undefined" && frontendResponse.ok) {
      console.log('Frontend is active, proceeding with limited functionality');
      isBackendActive = true; // Mark as active so UI shows
      spinUpInProgress = false; 
      notifyBackendStatusListeners();
      return true;
    }
    
  } catch (error) {
    // All health checks failed
    console.error('All health checks failed', error);
    isBackendActive = false;
  }
  
  return isBackendActive;
};

// Add a status change listener
export const addBackendStatusListener = (callback) => {
  backendStatusListeners.push(callback);
  // Immediately notify with current status
  callback({ isActive: isBackendActive, spinUpInProgress });
  return () => {
    backendStatusListeners = backendStatusListeners.filter(cb => cb !== callback);
  };
};

// Notify all listeners of status change
const notifyBackendStatusListeners = () => {
  backendStatusListeners.forEach(callback => {
    callback({ isActive: isBackendActive, spinUpInProgress });
  });
};

// Client-side fetch function with backend status check and improved URL construction
export const clientFetch = async (endpoint, options = {}, retryCount = 0) => {
  // Determine if we're in production on Vercel
  const isVercelProduction = typeof window !== "undefined" && 
    window.location.hostname.includes('vercel.app');
  const MAX_RETRIES = 2;

  // Vercel environment gets special handling for API calls that might be failing
  if (isVercelProduction && retryCount === 0) {
    console.log('Running in Vercel production environment');
  }
  
  // Improved URL construction to prevent double 'api' paths
  let url;
  
  // First, clean the endpoint by removing any leading slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Handle different API_URL configurations consistently
  if (API_URL === '/api') {
    // If API_URL is the relative '/api' path (typical in browser)
    if (cleanEndpoint.startsWith('api/')) {
      // Avoid /api/api/ by removing the api/ prefix from the endpoint
      url = `${API_URL}/${cleanEndpoint.substring(4)}`;
    } else {
      // Normal case for relative path - just append
      url = `${API_URL}/${cleanEndpoint}`;
    }
  } else if (API_URL.endsWith('/api')) {
    // If API_URL ends with /api (could be a full URL)
    if (cleanEndpoint.startsWith('api/')) {
      // Avoid duplicating /api by removing api/ from the endpoint
      url = `${API_URL}/${cleanEndpoint.substring(4)}`;
    } else {
      // Normal case - just append
      url = `${API_URL}/${cleanEndpoint}`;
    }
  } else if (API_URL.endsWith('/')) {
    // If API_URL ends with a slash but doesn't end with /api
    if (cleanEndpoint.startsWith('api/')) {
      // Keep the api/ prefix since it's not in the base URL
      url = `${API_URL}${cleanEndpoint}`;
    } else {
      // Add the api/ prefix since it's not in either part
      url = `${API_URL}api/${cleanEndpoint}`;
    }
  } else {
    // If API_URL doesn't end with a slash and doesn't end with /api
    if (cleanEndpoint.startsWith('api/')) {
      // Keep the api/ prefix since it's not in the base URL
      url = `${API_URL}/${cleanEndpoint}`;
    } else {
      // Add the api/ prefix since it's not in either part
      url = `${API_URL}/api/${cleanEndpoint}`;
    }
  }

  console.log('Client-side API request to URL:', url);

  const fetchOptions = {
    ...options,
    headers: createHeaders(options.headers),
    credentials: "include", // Include cookies
  };

  // Check backend status and wait if necessary
  await checkBackendStatus();
  
  try {
    // Regular fetch attempt through the API proxy
    const response = await fetch(url, fetchOptions);

    // If the response is OK, return it
    if (response.ok) {
      return await handleResponse(response);
    }
    
    console.warn(`Client-side API request failed: ${response.status} ${response.statusText} for URL: ${url}`);
    
    // Handle authentication errors
    if (response.status === 401) {
      // Immediately redirect to home for auth errors
      if (window.location.pathname !== "/" && window.location.pathname !== "/auth") {
        window.location.href = "/";
      }
      throw new Error("Authentication required");
    }
    
    // If we're in Vercel production and the proxy API request failed with 404,
    // try a direct backend request as a fallback
    if (isVercelProduction && response.status === 404 && retryCount < MAX_RETRIES) {
      console.log('Attempting direct backend access as fallback (retry attempt: ' + (retryCount + 1) + ')');
      
      // For endpoints like /api/auth/check-username, we need to extract the real endpoint path
      let directEndpoint = cleanEndpoint;
      
      // If the direct endpoint starts with 'api/', remove it to avoid double api/
      if (directEndpoint.startsWith('api/')) {
        directEndpoint = directEndpoint.substring(4);
      }
      
      // Construct direct URL to backend using the environment variable
      const directBackendUrl = `${DIRECT_BACKEND_URL}/api/${directEndpoint}`;
      
      console.log('Trying direct backend URL:', directBackendUrl);
      
      try {
        // Create new options for direct backend access
        const directOptions = {
          ...options,
          headers: createHeaders(options.headers),
          mode: 'cors', // Allow CORS for direct backend access
          credentials: "include", // Include cookies
        };
        
        const directResponse = await fetch(directBackendUrl, directOptions);
        
        if (directResponse.ok) {
          console.log('Direct backend access successful!');
          return await handleResponse(directResponse);
        } else {
          console.warn('Direct backend access failed:', directResponse.status, directResponse.statusText);
        }
      } catch (directError) {
        console.error('Direct backend access error:', directError);
      }
      
      // If we're still here, try a slightly different approach for the fallback
      if (retryCount === 0) {
        console.log('First retry failed, trying alternative approach...');
        return clientFetch(endpoint, options, retryCount + 1);
      }
    }
    
    // Handle other error responses
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Error: ${response.statusText}`;
    
    // Create an error object with status code
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
  // IMPORTANT: Import cookies dynamically for server-side use
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Simplified URL construction with a more robust approach
  let url;
  
  // First, clean the endpoint by removing any leading slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Server-side should use NEXT_SERVER_API_URL, which should point directly to the backend
  // Example: http://backend:5164
  if (API_URL.includes('http')) {
    // For full URLs (server-side), use a simpler approach to avoid path issues
    // Make sure the URL has a trailing slash for proper path joining
    const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
    
    // If endpoint starts with 'api/' and we're adding it to a URL that already has an API path,
    // extract just the part after 'api/'
    if (cleanEndpoint.startsWith('api/') && 
        (baseUrl.endsWith('/api/') || baseUrl.includes('/api/'))) {
      url = `${baseUrl}${cleanEndpoint.substring(4)}`;
    } else if (!cleanEndpoint.startsWith('api/') && 
               !baseUrl.endsWith('/api/') && 
               !baseUrl.endsWith('/api')) {
      // If neither the baseUrl ends with /api nor the endpoint starts with api/,
      // we need to add the /api prefix
      url = `${baseUrl}api/${cleanEndpoint}`;
    } else {
      // In all other cases, just join them
      url = `${baseUrl}${cleanEndpoint}`;
    }
  } else {
    // For relative URLs (should not happen server-side but just in case)
    // Prefer a predictable API path construction
    const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
    
    if (cleanEndpoint.startsWith('api/') && baseUrl === '/api/') {
      url = `${baseUrl}${cleanEndpoint.substring(4)}`;
    } else {
      url = `${baseUrl}${cleanEndpoint}`;
    }
  }

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

    if (!response.ok) {
      console.error(`Server-side API request failed: ${response.status} ${response.statusText}`);
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Server error: ${response.statusText}`
      );
    }

    return await handleResponse(response);
  } catch (error) {
    console.error('Server-side API request error:', error);
    throw error;
  }
};

// Handle response parsing
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  return await response.text();
}

// Helper function to normalize API paths and prevent '/api/api/' issues
export const normalizeEndpoint = (endpoint) => {
  // First, ensure endpoint starts without a slash for consistent handling
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If API_URL is '/api' and endpoint starts with 'api/', remove the duplicate
  if (API_URL === '/api' && cleanEndpoint.startsWith('api/')) {
    return cleanEndpoint.substring(4); // Remove the 'api/' prefix
  }
  
  // If we have a full URL in API_URL that ends with /api
  if (API_URL.includes('http') && API_URL.endsWith('/api') && cleanEndpoint.startsWith('api/')) {
    return cleanEndpoint.substring(4); // Remove the 'api/' prefix
  }
  
  return cleanEndpoint;
};

// Main API object
const api = {
  get: (endpoint, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(normalizeEndpoint(endpoint), { ...options, method: "GET" });
  },

  post: (endpoint, body, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(normalizeEndpoint(endpoint), {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: (endpoint, body, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(normalizeEndpoint(endpoint), {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete: (endpoint, options = {}) => {
    const isServer = typeof window === "undefined";
    const fetchFunction = isServer ? serverFetch : clientFetch;
    return fetchFunction(normalizeEndpoint(endpoint), { ...options, method: "DELETE" });
  },
  
  checkBackendStatus,
  addBackendStatusListener,
  baseUrl: API_URL
};

export default api;