// src/utils/cookies.js

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Cookie expiration in days
 */
export const setCookie = (name, value, days = 7) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);

  const cookieValue =
    encodeURIComponent(value) +
    (days ? `; expires=${expiryDate.toUTCString()}` : "") +
    "; path=/; SameSite=None"; // Allow cross-origin

  // Add secure flag in production
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";

  document.cookie = `${name}=${cookieValue}${secureFlag}`;
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
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
};

/**
 * Check if a cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean} - True if cookie exists
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};
