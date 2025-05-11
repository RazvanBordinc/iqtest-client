import { getCookie } from "@/utils/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5164";

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

// Client-side fetch function with better error handling
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
      console.log(
        "Response Headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.status === 401) {
        // Token might be expired, redirect to login
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
