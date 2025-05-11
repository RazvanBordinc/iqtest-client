import api from "./api";

export const getQuestionsByTestType = async (testTypeId) => {
  try {
    console.log("Fetching questions for test type:", testTypeId);

    // Updated to use the new endpoint
    return await api.get(`api/test/questions/${testTypeId}`);
  } catch (error) {
    console.error(
      `Failed to fetch questions for test type ${testTypeId}:`,
      error
    );
    throw error;
  }
};
