// src/fetch/api.js (Updated version)
import { getCookie } from "@/utils/cookies";
import { showError } from "@/components/shared/ErrorModal";

const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_SERVER_API_URL || "http://backend:5164"
    : process.env.NEXT_PUBLIC_API_URL || "/api";

// Create headers with auth token if available
export const createHeaders = (additionalHeaders = {}) => {
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

// Client-side fetch function
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
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      if (response.status === 401) {
        // Immediately redirect to home for auth errors
        if (window.location.pathname !== "/" && window.location.pathname !== "/auth") {
          window.location.href = "/";
        }
        throw new Error("Authentication required");
      }
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Client API request failed:", error);
    // Show error modal for non-auth errors
    if (error.message !== "Authentication required") {
      showError(error.message || "An unexpected error occurred");
    }
    throw error;
  }
};

// Server-side API fetch
export const serverFetch = async (endpoint, options = {}) => {
  // IMPORTANT: Import cookies dynamically for server-side use
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("Server API Request:", {
    url,
    method: options.method || "GET",
    headers,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || "no-store",
    });

    if (!response.ok) {
      console.error("Server API Error:", {
        status: response.status,
        statusText: response.statusText,
        url,
      });

      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message ||
        `Error: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Server API request failed:", error);
    throw error;
  }
};

// Auto-detect environment
export const fetchApi =
  typeof window === "undefined" ? serverFetch : clientFetch;

// Helper function
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

// Create the API object first, then export it (avoiding anonymous default export)
const apiMethods = {
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

export default apiMethods;
