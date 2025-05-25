import api, { normalizeEndpoint } from "./api";

// Helper function to get the correct endpoint path
const getEndpoint = (path) => {
  // Use the normalizeEndpoint function to handle API paths consistently
  return normalizeEndpoint(path);
};

export const getTestTypeLeaderboard = async (testTypeId, page = 1, pageSize = 10) => {
  try {
    const endpoint = getEndpoint(`/leaderboard/test-type/${testTypeId}?page=${page}&pageSize=${pageSize}`);
    // Add cache headers for leaderboard data (cache for 5 minutes)
    return await api.get(endpoint, {
      headers: {
        'Cache-Control': 'max-age=300',
      },
      // Enable Next.js fetch caching
      next: { revalidate: 300 } // 5 minutes
    });
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
    // User ranking can be cached for a shorter time (2 minutes)
    return await api.get(endpoint, {
      headers: {
        'Cache-Control': 'max-age=120',
      },
      // Enable Next.js fetch caching
      next: { revalidate: 120 } // 2 minutes
    });
  } catch (error) {
    console.error("Failed to fetch user ranking:", error);
    throw error;
  }
};
