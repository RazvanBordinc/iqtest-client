// src/utils/cookies.js

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Cookie expiration in days
 */
export const setCookie = (name, value, days = 7) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);

  let cookieValue =
    encodeURIComponent(value) +
    (days ? `; expires=${expiryDate.toUTCString()}` : "") +
    "; path=/";

  // Handle SameSite and Secure flags based on environment
  if (IS_DEVELOPMENT) {
    cookieValue += "; SameSite=Lax";
  } else {
    cookieValue += "; SameSite=None; Secure";
  }

  document.cookie = `${name}=${cookieValue}`;
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof document === "undefined") {
    return null; // Server-side rendering check
  }

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
};

/**
 * Remove a cookie
 * @param {string} name - Cookie name
 */
export const removeCookie = (name) => {
  let cookieValue = `${name}=; Max-Age=-99999999; path=/`;

  // Handle SameSite and Secure flags based on environment
  if (IS_DEVELOPMENT) {
    cookieValue += "; SameSite=Lax";
  } else {
    cookieValue += "; SameSite=None; Secure";
  }

  document.cookie = cookieValue;
};

/**
 * Check if a cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean} - True if cookie exists
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};
