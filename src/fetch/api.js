// Base API configuration
import { getCookie } from "@/utils/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5164";

// Server-side API fetch (for use in Server Components)
export const serverFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  // Basic headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // For server components, the token should be passed via the cookies header
  // The Next.js middleware or getServerSideProps should handle this

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Make sure to honor any caching directives, but default to no-cache
      // to ensure fresh data by default
      cache: options.cache || "no-store",
      credentials: "include", // Include cookies in the request
    });

    if (!response.ok) {
      // Get error message from the response body
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message ||
        `Error: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    // If response is 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Parse and return JSON data
    return response.json();
  } catch (error) {
    console.error("Server API request failed:", error);
    throw error;
  }
};

// Helper function to handle API responses for client-side fetching
const handleResponse = async (response) => {
  // Check if the request was successful
  if (!response.ok) {
    // Get error message from the response body
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message || `Error: ${response.status} ${response.statusText}`;

    // Throw error with message
    throw new Error(errorMessage);
  }

  // If response is 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Parse and return JSON data
  return response.json();
};

// Function to get auth token from cookies
const getToken = () => {
  return getCookie("token");
};

// Create headers with auth token if available
const createHeaders = (additionalHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Client-side fetch function
export const clientFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const fetchOptions = {
    ...options,
    headers: createHeaders(options.headers),
    credentials: "include", // Include cookies in the request
  };

  try {
    const response = await fetch(url, fetchOptions);
    return await handleResponse(response);
  } catch (error) {
    console.error("Client API request failed:", error);
    throw error;
  }
};

// Auto-detect whether this is running on client or server and use appropriate fetch
export const fetchApi =
  typeof window === "undefined" ? serverFetch : clientFetch;

export default {
  get: (endpoint) => fetchApi(endpoint, { method: "GET" }),
  post: (endpoint, data) =>
    fetchApi(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    fetchApi(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (endpoint) => fetchApi(endpoint, { method: "DELETE" }),
};
