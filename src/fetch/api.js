// src/fetch/api.js

// Use environment variables for API URLs
const API_URL = typeof window === "undefined"
  ? process.env.NEXT_SERVER_API_URL || "http://backend:5164"  // Server-side from env
  : (process.env.NEXT_PUBLIC_API_URL || "/api"); // Client-side from env

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
  
  // First check our frontend health endpoint - this should always work
  try {
    // Always check the frontend health first to determine if frontend is running
    const frontendHealthUrl = '/api/health';
    
    const frontendResponse = await fetch(frontendHealthUrl, {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 0 },
      timeout: 2000, // Short timeout for frontend health check
    });
    
    if (!frontendResponse.ok) {
      console.warn('Frontend health check failed');
      // Don't immediately fail - we'll try the backend check
    }
    
    // If we're in server-side rendering, or if we want to check backend connectivity
    // Try a more reliable API endpoint like auth or test types that should always exist
    if (typeof window !== "undefined") {
      // Client-side: try to contact backend through a lightweight API
      try {
        const testResponse = await fetch('/api/test/types', {
          method: 'GET',
          headers: createHeaders(),
          cache: 'no-store',
          credentials: 'same-origin',
          next: { revalidate: 0 },
          timeout: 5000,
        });
        
        if (testResponse.ok) {
          isBackendActive = true;
          spinUpInProgress = false;
          notifyBackendStatusListeners();
          return true;
        }
      } catch (error) {
        // Backend API is not reachable, but frontend is working
        console.info('Backend API check failed, but frontend is operational');
        // We'll continue with the app since the frontend is working
      }
    }
    
    // If we have a browser environment and frontend is working,
    // consider the app active even if backend isn't yet
    if (typeof window !== "undefined" && frontendResponse.ok) {
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

// Client-side fetch function with backend status check
export const clientFetch = async (endpoint, options = {}) => {
  // Handle different API URL formats
  // If API_URL ends with /api and endpoint starts with api/, we need to handle it
  let url;
  if (API_URL.endsWith('/api') && endpoint.startsWith('api/')) {
    // Remove the duplicate 'api/' from the endpoint
    const adjustedEndpoint = endpoint.replace(/^api\//, '');
    url = `${API_URL}/${adjustedEndpoint}`;
  } else {
    // Normal case - just strip leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    url = `${API_URL}/${cleanEndpoint}`;
  }

  const fetchOptions = {
    ...options,
    headers: createHeaders(options.headers),
    credentials: "include", // Include cookies
  };

  // Check backend status and wait if necessary
  await checkBackendStatus();
  
  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      if (response.status === 401) {
        // Immediately redirect to home for auth errors
        if (window.location.pathname !== "/" && window.location.pathname !== "/auth") {
          window.location.href = "/";
        }
        throw new Error("Authentication required");
      }
      
      // Handle other error responses
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || `Error: ${response.statusText}`;
      
      // Create an error object with status code
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Server-side fetch function
export const serverFetch = async (endpoint, options = {}) => {
  // IMPORTANT: Import cookies dynamically for server-side use
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Handle different API URL formats
  // If API_URL ends with /api and endpoint starts with api/, we need to handle it
  let url;
  if (API_URL.endsWith('/api') && endpoint.startsWith('api/')) {
    // Remove the duplicate 'api/' from the endpoint
    const adjustedEndpoint = endpoint.replace(/^api\//, '');
    url = `${API_URL}/${adjustedEndpoint}`;
  } else {
    // Normal case - just strip leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    url = `${API_URL}/${cleanEndpoint}`;
  }

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
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Server error: ${response.statusText}`
      );
    }

    return await handleResponse(response);
  } catch (error) {
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
  
  checkBackendStatus,
  addBackendStatusListener,
  baseUrl: API_URL
};

export default api;