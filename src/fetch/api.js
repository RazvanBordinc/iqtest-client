// src/fetch/api.js (Updated version)
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

  console.log("Client API Request:", {
    url,
    method: options.method || "GET",
    headers: fetchOptions.headers,
  });

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      console.error("Client API Error:", {
        status: response.status,
        statusText: response.statusText,
        url,
      });

      if (response.status === 401) {
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
