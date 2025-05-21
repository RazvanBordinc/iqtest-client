// src/fetch/tests.js

import api, { normalizeEndpoint } from "./api";
import { TEST_TYPES } from "@/components/constants/testTypes";

// Helper function to get the correct endpoint path
const getEndpoint = (path) => {
  // Remove the api prefix if needed
  const normalizedPath = normalizeEndpoint(path);
  // For server-side rendering and special cases
  return normalizedPath;
};

// Get test types from constants (they're hardcoded)
export const getAvailableTests = async () => {
  try {
    // First try to get test types from the API
    const endpoint = getEndpoint("/test/types");
    console.log('Fetching test types from endpoint:', endpoint);
    
    try {
      const apiTestTypes = await api.get(endpoint);
      console.log('Test types from API:', apiTestTypes);
      
      // If we got a valid response with at least one test type, use it
      if (Array.isArray(apiTestTypes) && apiTestTypes.length > 0) {
        return apiTestTypes;
      } else {
        console.warn('API returned empty or invalid test types, using fallback');
      }
    } catch (apiError) {
      console.error('Error fetching test types from API, using fallback:', apiError);
    }
    
    // Fallback to constants if API fails or returns empty
    return TEST_TYPES;
  } catch (error) {
    console.error('Complete failure in getAvailableTests, using hardcoded fallback:', error);
    // Fallback to constants if everything fails
    return TEST_TYPES;
  }
};

export const getTestById = (testId) => {
  // Use synchronous version for server components
  return TEST_TYPES.find((test) => test.id === testId) || null;
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
    // For timeouts and connection errors, provide a fallback response
    if (error.message?.includes('timeout') || 
        error.message?.includes('fetch') || 
        error.message?.includes('network') ||
        error.status === 0) {
      console.warn(`Test availability check failed for ${testTypeId}, using fallback`);
      return {
        canTake: true,
        timeUntilNext: 0,
        message: "Test available (backend unavailable)",
        isFallback: true
      };
    }
    
    // For other errors, let the component handle it
    throw error;
  }
};

// For backward compatibility - if you need these functions elsewhere
export const getTestTypes = getAvailableTests;
export const fetchTestById = getTestById;
