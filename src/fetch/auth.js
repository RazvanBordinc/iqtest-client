import api, { normalizeEndpoint } from "./api";
import { setCookie, removeCookie, getCookie } from "@/utils/cookies";

// Helper function to get the correct endpoint path
const getEndpoint = (path) => {
  // Use the normalizeEndpoint function to handle API paths consistently
  return normalizeEndpoint(path);
};

export const checkUsername = async (username) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  const tryCheckUsername = async () => {
    try {
      const endpoint = getEndpoint('/auth/check-username');
      
      // Send the username in the request body following the DTO structure
      // Remove the query parameter approach that was causing the 400 Bad Request
      const response = await api.post(endpoint, { username });
      return response;
    } catch (error) {
      // If we've hit a rate limit (429), wait and retry
      if (error.status === 429 && retryCount < MAX_RETRIES) {
        console.log(`Rate limited on username check, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        retryCount++;
        
        // Wait a bit before retrying (increasing delay based on retry count)
        const delay = 1000 * retryCount;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Try again
        return tryCheckUsername();
      }
      
      // For non-rate-limit errors or if we've exhausted retries
      if (error.status === 429) {
        console.error("Username check rate limited after retries, returning dummy response");
        // Return a default response to avoid breaking the UI
        return { available: true, message: "Username check skipped due to rate limiting" };
      }
      
      console.error("Username check failed:", error);
      throw error;
    }
  };
  
  return tryCheckUsername();
};

export const createUser = async (userData) => {
  try {
    const endpoint = getEndpoint('/auth/create-user');
    const response = await api.post(endpoint, userData);

    // Store token and user data in cookies if available
    if (response.token) {
      setCookie("token", response.token, 1); // 1 day expiry
      if (response.refreshToken) {
        setCookie("refreshToken", response.refreshToken, 7); // 7 days for refresh token
      }
      const userDataObj = {
        username: response.username,
        email: response.email,
        country: response.country,
        age: response.age,
      };
      setCookie("userData", JSON.stringify(userDataObj), 30); // 30 days for preferences
    }

    return response;
  } catch (error) {
    console.error("User creation failed:", error);
    throw error;
  }
};

export const loginWithPassword = async (credentials) => {
  try {
    const endpoint = getEndpoint('/auth/login-with-password');
    const response = await api.post(endpoint, credentials);

    // Store token and user data in cookies
    if (response.token) {
      setCookie("token", response.token, 1); // 1 day expiry
      if (response.refreshToken) {
        setCookie("refreshToken", response.refreshToken, 7); // 7 days for refresh token
      }
      const userDataObj = {
        username: response.username,
        email: response.email,
        country: response.country,
        age: response.age,
      };
      setCookie("userData", JSON.stringify(userDataObj), 30); // 30 days for preferences
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    // Add more context to the error
    if (error.status === 400 && error.message.includes("Invalid credentials")) {
      // This could be either wrong password or non-existent user
      error.isInvalidCredentials = true;
    }
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const endpoint = getEndpoint('/auth/register');
    const response = await api.post(endpoint, userData);

    // Store token and user data in cookies if available
    if (response.token) {
      setCookie("token", response.token, 1); // 1 day expiry
      const userDataObj = {
        username: response.username,
        email: response.email,
      };
      setCookie("userData", JSON.stringify(userDataObj), 1);
    }

    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const endpoint = getEndpoint('/auth/login');
    const response = await api.post(endpoint, credentials);

    // Store token and user data in cookies
    if (response.token) {
      setCookie("token", response.token, 1); // 1 day expiry
      const userDataObj = {
        username: response.username,
        email: response.email,
      };
      setCookie("userData", JSON.stringify(userDataObj), 1);
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const disconnect = async () => {
  try {
    const endpoint = getEndpoint('/auth/disconnect');
    await api.post(endpoint);
    
    // Clear all cookies
    removeCookie("token");
    removeCookie("userData");
    removeCookie("username");
    removeCookie("age");
    removeCookie("gender");

    // Redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Disconnect failed:", error);
    // Still clear cookies even if API call fails
    removeCookie("token");
    removeCookie("userData");
    removeCookie("username");
    removeCookie("age");
    removeCookie("gender");
    
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
};

export const logout = () => {
  disconnect();
};

export const getCurrentUser = () => {
  // Get user data from cookies
  const userDataCookie = getCookie("userData");
  return userDataCookie ? JSON.parse(userDataCookie) : null;
};

export const isAuthenticated = () => {
  // Check if user is authenticated by verifying token cookie exists and is not expired
  const token = getCookie("token");
  
  if (!token) {
    return false;
  }
  
  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, remove it
      removeCookie("token");
      removeCookie("userData");
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format, consider it invalid
    console.error("Invalid token format:", error);
    removeCookie("token");
    removeCookie("userData");
    return false;
  }
};