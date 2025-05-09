import api from "./api";

export const getGlobalLeaderboard = async (limit = 10) => {
  try {
    return await api.get(`api/leaderboard/global?limit=${limit}`);
  } catch (error) {
    console.error("Failed to fetch global leaderboard:", error);
    throw error;
  }
};

export const getTestTypeLeaderboard = async (testTypeId, limit = 10) => {
  try {
    return await api.get(
      `api/leaderboard/test-type/${testTypeId}?limit=${limit}`
    );
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
    return await api.get("api/leaderboard/user-ranking");
  } catch (error) {
    console.error("Failed to fetch user ranking:", error);
    throw error;
  }
};
