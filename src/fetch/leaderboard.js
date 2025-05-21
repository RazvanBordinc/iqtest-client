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
