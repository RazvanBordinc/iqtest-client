// src/fetch/tests.js

import api from "./api";
import { TEST_TYPES } from "@/components/constants/testTypes";

// Get test types from constants (they're hardcoded)
export const getAvailableTests = async () => {
  try {
    // Can also fetch from backend if needed: const testTypes = await api.get("api/test/types");
    return TEST_TYPES;
  } catch (error) {
    console.error("Failed to fetch test types:", error);
    // Fallback to constants if API fails
    return TEST_TYPES;
  }
};

export const getTestById = async (testId) => {
  try {
    // First check constants
    const testFromConstants = TEST_TYPES.find((test) => test.id === testId);

    if (testFromConstants) {
      return testFromConstants;
    }

    // If not found in constants, try API
    return await api.get(`api/test/types/${testId}`);
  } catch (error) {
    console.error(`Failed to fetch test with ID ${testId}:`, error);
    // Fallback to constants
    return TEST_TYPES.find((test) => test.id === testId) || null;
  }
};

// Submit test answers to backend
export const submitTest = async (testData) => {
  try {
    console.log("Submitting test:", testData);

    // Ensure testData includes timeTaken if not already present
    if (!testData.timeTaken && typeof testData.timeTaken !== "number") {
      console.warn("No timeTaken value provided in test submission");
    }

    const result = await api.post("api/test/submit", testData);

    // Log the result for debugging
    console.log("Test submission result:", result);

    return result;
  } catch (error) {
    console.error("Failed to submit test:", error);
    throw error;
  }
};

// Check test availability
export const checkTestAvailability = async (testTypeId) => {
  try {
    return await api.get(`api/test/availability/${testTypeId}`);
  } catch (error) {
    console.error(`Failed to check test availability for ${testTypeId}:`, error);
    throw error;
  }
};

// For backward compatibility - if you need these functions elsewhere
export const getTestTypes = getAvailableTests;
export const fetchTestById = getTestById;
