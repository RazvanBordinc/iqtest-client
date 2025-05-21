import api from "./api";

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
