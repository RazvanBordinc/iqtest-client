// src/fetch/tests.js

import api from "./api";
import { TEST_TYPES } from "@/components/constants/testTypes";

// Get test types from constants (they're hardcoded)
export const getAvailableTests = async () => {
  try {
    // Can also fetch from backend if needed: const testTypes = await api.get("/api/test/types");
    return TEST_TYPES;
  } catch (error) {
    // Fallback to constants if API fails
    return TEST_TYPES;
  }
};

export const getTestById = (testId) => {
  // Use synchronous version for server components
  return TEST_TYPES.find((test) => test.id === testId) || null;
};

// Helper function to get the correct endpoint path based on API_URL
const getEndpoint = (path) => {
  // If API_URL is already '/api', don't prefix paths with '/api'
  if (api.baseUrl === '/api') {
    // Remove leading '/api' if present
    return path.startsWith('/api/') ? path.substring(4) : path;
  }
  
  // Otherwise, ensure path starts with '/api'
  return path.startsWith('/api/') ? path : `/api${path}`;
};

// Submit test answers to backend
export const submitTest = async (testData) => {
  try {
    // Validate answers before submission
    if (!Array.isArray(testData.answers)) {
      throw new Error("Invalid test data format - answers must be an array");
    }

    // Check each answer for required properties
    testData.answers.forEach((answer, index) => {
      if (!answer.hasOwnProperty('questionId') || 
          !answer.hasOwnProperty('type') || 
          (!answer.hasOwnProperty('value') && answer.value !== null)) {
        throw new Error("Invalid answer format - missing required properties");
      }
    });

    const endpoint = getEndpoint("/test/submit");
    const result = await api.post(endpoint, testData);
    return result;
  } catch (error) {
    throw error;
  }
};

// Check test availability
export const checkTestAvailability = async (testTypeId) => {
  try {
    const endpoint = getEndpoint(`/test/availability/${testTypeId}`);
    return await api.get(endpoint);
  } catch (error) {
    throw error;
  }
};

// For backward compatibility - if you need these functions elsewhere
export const getTestTypes = getAvailableTests;
export const fetchTestById = getTestById;
