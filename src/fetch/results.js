import api from "./api";

export const getUserResults = async () => {
  try {
    return await api.get("api/results");
  } catch (error) {
    console.error("Failed to fetch user results:", error);
    throw error;
  }
};

export const getResultById = async (resultId) => {
  try {
    return await api.get(`api/results/${resultId}`);
  } catch (error) {
    console.error(`Failed to fetch result with ID ${resultId}:`, error);
    throw error;
  }
};

export const getResultsByTestType = async (testTypeId) => {
  try {
    return await api.get(`api/results/test-type/${testTypeId}`);
  } catch (error) {
    console.error(
      `Failed to fetch results for test type ${testTypeId}:`,
      error
    );
    throw error;
  }
};
