import api, { normalizeEndpoint } from "./api";

// Helper function to get the correct endpoint path
const getEndpoint = (path) => {
  // Use the normalizeEndpoint function to handle API paths consistently
  return normalizeEndpoint(path);
};

export const getTestTypeLeaderboard = async (testTypeId, page = 1, pageSize = 10) => {
  try {
    const endpoint = getEndpoint(`/leaderboard/test-type/${testTypeId}?page=${page}&pageSize=${pageSize}`);
    return await api.get(endpoint);
  } catch (error) {
    console.error(
      `Failed to fetch leaderboard for test type ${testTypeId}:`,
      error
    );
    throw error;
  }
};

export const getUserRanking = async () => {
  try {
    const endpoint = getEndpoint("/leaderboard/user-ranking");
    return await api.get(endpoint);
  } catch (error) {
    console.error("Failed to fetch user ranking:", error);
    throw error;
  }
};
