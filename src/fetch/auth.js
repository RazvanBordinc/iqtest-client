import api, { normalizeEndpoint } from "./api";
import { setCookie, removeCookie, getCookie } from "@/utils/cookies";

// Helper function to get the correct endpoint path
const getEndpoint = (path) => {
  // Use the normalizeEndpoint function to handle API paths consistently
  return normalizeEndpoint(path);
};

export const checkUsername = async (username) => {
  // Debug information
  console.log('Checking username:', username);
  
  // The server validation requires a username of at least 3 characters
  // Let's add this validation on the client side
  if (!username || username.length < 3) {
    console.warn("Username must be at least 3 characters long");
    return { 
      message: "Username is too short", 
      exists: false,
      isInvalid: true 
    };
  }
  
  // Use a single, simple approach that matches the backend model
  try {
    const endpoint = getEndpoint('/auth/check-username');
    console.log('Making username check request to:', endpoint);
    
    const response = await api.post(endpoint, {
      Username: username
    });
    
    console.log('Username check response:', response);
    return response;
  } catch (error) {
    console.error("Username check failed:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const endpoint = getEndpoint('/auth/create-user');
    
    // Format the user data with proper casing for .NET model binding
    const formattedData = {
      Username: userData.username,
      Password: userData.password,
      Country: userData.country,
      Age: userData.age
    };
    
    console.log('Creating user with data:', JSON.stringify(formattedData));
    
    // Make the request
    const response = await api.post(endpoint, formattedData);
    
    // Store token and user data in cookies if available
    setAuthTokens(response);
    
    return response;
  } catch (error) {
    console.error("User creation failed:", error);
    throw error;
  }
};

export const loginWithPassword = async (credentials) => {
  try {
    const endpoint = getEndpoint('/auth/login-with-password');
    
    // Format the credentials with proper casing for .NET model binding
    const formattedCredentials = {
      Username: credentials.username,
      Password: credentials.password
    };
    
    console.log('Attempting login with credentials:', JSON.stringify(formattedCredentials));
    
    // Make the request
    const response = await api.post(endpoint, formattedCredentials);
    
    // Store token and user data in cookies using our helper
    setAuthTokens(response);
    
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const endpoint = getEndpoint('/auth/register');
    
    // Format the user data with proper casing for .NET model binding
    const formattedData = {
      Username: userData.username,
      Password: userData.password,
      Country: userData.country,
      Age: userData.age
    };
    
    const response = await api.post(endpoint, formattedData);

    // Store token and user data in cookies if available
    setAuthTokens(response);

    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// Helper function to safely set token
export const setAuthTokens = (response) => {
  try {
    if (response && response.token) {
      // Validate the token is in proper JWT format before setting
      if (typeof response.token !== 'string') {
        console.error("Invalid token format: not a string");
        return false;
      }
      else if (response.token.split('.').length === 3) {
        try {
          // Ensure it's valid base64 by testing decoding
          const parts = response.token.split('.');
          if (parts[1] && parts[1].trim() !== '') {
            // Proper token - try to decode it for further validation
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const pad = base64.length % 4;
            const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
            
            // If this fails to decode, it will go to the catch block
            JSON.parse(atob(padded));
            
            // Valid JWT token, store it
            console.log("Setting valid JWT token in cookies");
            setCookie("token", response.token, 1); // 1 day expiry
          } else {
            // Invalid payload
            throw new Error("Invalid token payload");
          }
        } catch (error) {
          // Invalid token format
          console.error("JWT token decode error:", error.message);
          return false;
        }
      } else {
        // Unknown token format
        console.error("Invalid token format: expected JWT with 3 parts");
        return false;
      }
      
      // Set refresh token if available
      if (response.refreshToken) {
        setCookie("refreshToken", response.refreshToken, 7);
      }
      
      // Set user data
      const userDataObj = {
        username: response.username,
        country: response.country,
        age: response.age,
      };
      setCookie("userData", JSON.stringify(userDataObj), 1);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error setting auth tokens:", error);
    return false;
  }
};

export const login = async (credentials) => {
  try {
    const endpoint = getEndpoint('/auth/login');
    
    // Format the credentials with proper casing for .NET model binding
    const formattedCredentials = {
      Username: credentials.username,
      Password: credentials.password
    };
    
    const response = await api.post(endpoint, formattedCredentials);

    // Store token and user data in cookies
    setAuthTokens(response);

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
    // Check if token is in JWT format with 3 parts
    if (!token.includes('.') || token.split('.').length !== 3) {
      // Only log warning for non-dummy tokens to prevent spam
      return false; 
    }
    
    // Extra validation to make sure the token is properly base64url encoded
    const parts = token.split('.');
    if (!parts[1] || parts[1].trim() === '') {
      console.warn("Token payload is empty");
      return false;
    }
    
    // Ensure it's valid base64 by adding padding if needed
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(padded));
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
    // Invalid token format
    console.error("Token validation error:", error.message);
    
    // Clear invalid tokens
    removeCookie("token");
    removeCookie("userData");
    return false;
  }
};