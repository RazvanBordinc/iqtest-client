import { getCookie } from "@/utils/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5164";

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let refreshPromise = null;

// Create headers with auth token if available
const createHeaders = (additionalHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  const token = getCookie("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Function to refresh the token
const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    // Token should be set automatically by the server via cookies
    return data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Redirect to login if refresh fails
    window.location.href = "/auth";
    throw error;
  }
};

// Client-side fetch function with automatic token refresh
export const clientFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const fetchOptions = {
    ...options,
    headers: createHeaders(options.headers),
    credentials: "include", // Include cookies
  };

  try {
    console.log("Request URL:", url);
    console.log("Request Headers:", fetchOptions.headers);

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      console.log("Response Status:", response.status);

      if (response.status === 401) {
        // Try to refresh token if we have a refresh token
        const refreshTokenCookie = getCookie("refreshToken");

        if (refreshTokenCookie && !isRefreshing) {
          // If we're not already refreshing, start the refresh process
          if (!refreshPromise) {
            isRefreshing = true;
            refreshPromise = refreshToken().finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
          }

          // Wait for the refresh to complete
          await refreshPromise;

          // Retry the original request with new token
          const newFetchOptions = {
            ...options,
            headers: createHeaders(options.headers),
            credentials: "include",
          };

          const retryResponse = await fetch(url, newFetchOptions);
          if (retryResponse.ok) {
            return await handleResponse(retryResponse);
          }
        }

        // If refresh failed or no refresh token, redirect to login
        window.location.href = "/auth";
        throw new Error("Authentication required");
      }
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Client API request failed:", error);
    throw error;
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auto-detect whether this is running on client or server
export const fetchApi =
  typeof window === "undefined" ? serverFetch : clientFetch;

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
