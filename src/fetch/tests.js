// src/fetch/tests.js
import api from "./api";
import { TEST_TYPES } from "@/components/constants/testTypes";

// No need to fetch test types - they're defined in constants
export const getAvailableTests = () => {
  return TEST_TYPES;
};

export const getTestById = (testId) => {
  return TEST_TYPES.find((test) => test.id === testId) || null;
};

// Keep this function as it's still needed
export const submitTest = async (testData) => {
  try {
    console.log("Submitting test:", testData);
    return await api.post("api/test/submit", testData);
  } catch (error) {
    console.error("Failed to submit test:", error);
    throw error;
  }
};
