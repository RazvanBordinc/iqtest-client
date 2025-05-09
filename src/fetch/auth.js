import api from "./api";

export const register = async (userData) => {
  try {
    const response = await api.post("api/auth/register", userData);

    // Store token if available
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: response.username,
          email: response.email,
        })
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

    // Store token and user data
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: response.username,
          email: response.email,
        })
      );
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = () => {
  // Clear auth data from local storage
  localStorage.removeItem("token");
  localStorage.removeItem("userData");

  // Redirect to home page
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const getCurrentUser = () => {
  // Get user data from local storage
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const isAuthenticated = () => {
  // Check if user is authenticated
  return !!getToken();
};

const getToken = () => {
  // Get auth token from local storage
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};
