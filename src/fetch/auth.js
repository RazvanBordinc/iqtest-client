import api from "./api";
import { setCookie, removeCookie, getCookie } from "@/utils/cookies";

export const checkUsername = async (username) => {
  try {
    const response = await api.post("/api/auth/check-username", { username });
    return response;
  } catch (error) {
    console.error("Username check failed:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/create-user", userData);

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
    const response = await api.post("/api/auth/login-with-password", credentials);

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
    const response = await api.post("/api/auth/register", userData);

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
    const response = await api.post("/api/auth/login", credentials);

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
    await api.post("/api/auth/disconnect");
    
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