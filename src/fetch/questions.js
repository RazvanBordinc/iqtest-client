// src/fetch/questions.js
import api from "./api";

export const getQuestionsByTestType = async (testTypeId) => {
  try {
    console.log("Fetching questions for test type:", testTypeId);
    return await api.get(`api/question/test/${testTypeId}`);
  } catch (error) {
    console.error(
      `Failed to fetch questions for test type ${testTypeId}:`,
      error
    );
    throw error;
  }
};

export const getQuestionById = async (questionId) => {
  try {
    console.log("Fetching question by ID:", questionId);
    return await api.get(`api/question/${questionId}`);
  } catch (error) {
    console.error(`Failed to fetch question with ID ${questionId}:`, error);
    throw error;
  }
};
