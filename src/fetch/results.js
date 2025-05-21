import api, { normalizeEndpoint } from "./api";

// Helper function to get the correct endpoint path
const getEndpoint = (path) => {
  // Use the normalizeEndpoint function to handle API paths consistently
  return normalizeEndpoint(path);
};

export const getUserResults = async () => {
  try {
    const endpoint = getEndpoint("/results");
    return await api.get(endpoint);
  } catch (error) {
    console.error("Failed to fetch user results:", error);
    throw error;
  }
};

export const getResultById = async (resultId) => {
  try {
    const endpoint = getEndpoint(`/results/${resultId}`);
    return await api.get(endpoint);
  } catch (error) {
    console.error(`Failed to fetch result with ID ${resultId}:`, error);
    throw error;
  }
};

export const getResultsByTestType = async (testTypeId) => {
  try {
    const endpoint = getEndpoint(`/results/test-type/${testTypeId}`);
    return await api.get(endpoint);
  } catch (error) {
    console.error(
      `Failed to fetch results for test type ${testTypeId}:`,
      error
    );
    throw error;
  }
};
