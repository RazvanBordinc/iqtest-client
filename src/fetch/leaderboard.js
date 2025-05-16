import api from "./api";

export const getTestTypeLeaderboard = async (testTypeId, page = 1, pageSize = 10) => {
  try {
    return await api.get(
      `api/leaderboard/test-type/${testTypeId}?page=${page}&pageSize=${pageSize}`
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
