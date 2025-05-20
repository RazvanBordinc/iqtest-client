// src/fetch/api.js

// Always use the backend URL directly
const API_URL = typeof window === "undefined"
  ? "http://backend:5164"  // Server-side: Docker service name
  : "http://localhost:5164"; // Client-side: Host port

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

// Client-side fetch function
export const clientFetch = async (endpoint, options = {}) => {
  // Strip leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_URL}/${cleanEndpoint}`;

  const fetchOptions = {
    ...options,
    headers: createHeaders(options.headers),
    credentials: "include", // Include cookies
  };

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

  // Strip leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_URL}/${cleanEndpoint}`;

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
};

export default api;