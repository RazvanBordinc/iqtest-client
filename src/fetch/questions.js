import api from "./api";

export const getQuestionsByTestType = async (testTypeId) => {
  try {
    console.log("Fetching questions for test type:", testTypeId);
    const response = await api.get(`api/test/questions/${testTypeId}`);
    console.log("Question response:", response);
    return response;
  } catch (error) {
    console.error(`Failed to fetch questions:`, error);
    throw error;
  }
};
