import api from "./api";
import { setCookie, removeCookie, getCookie } from "@/utils/cookies";

export const register = async (userData) => {
  try {
    const response = await api.post("api/auth/register", userData);

    // Store token and user data in cookies if available
    if (response.token) {
      setCookie("token", response.token, 1); // 1 day expiry
      setCookie(
        "userData",
        JSON.stringify({
          username: response.username,
          email: response.email,
        }),
        1
      );
    }

    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("api/auth/login", credentials);

    // Store token and user data in cookies
    if (response.token) {
      setCookie("token", response.token, 1); // 1 day expiry
      setCookie(
        "userData",
        JSON.stringify({
          username: response.username,
          email: response.email,
        }),
        1
      );
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = () => {
  // Clear auth data from cookies
  removeCookie("token");
  removeCookie("userData");

  // Redirect to home page
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const getCurrentUser = () => {
  // Get user data from cookies
  const userDataCookie = getCookie("userData");
  return userDataCookie ? JSON.parse(userDataCookie) : null;
};

export const isAuthenticated = () => {
  // Check if user is authenticated by verifying token cookie exists
  return !!getCookie("token");
};
