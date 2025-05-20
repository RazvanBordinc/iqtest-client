import api from "./api";
import { getFallbackQuestions } from "@/utils/fallbackQuestions";

// Normalize question data to ensure consistent casing and structure
const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    return [];
  }
  
  return questions.map(q => {
    // Create normalized question with proper casing for all properties
    return {
      id: q.Id || q.id || 0,
      type: q.Type?.toLowerCase() || q.type?.toLowerCase() || "",
      category: q.Category?.toLowerCase() || q.category?.toLowerCase() || "",
      text: q.Text || q.text || "",
      options: q.Options || q.options || [],
      memorizationTime: q.MemorizationTime || q.memorizationTime || 15,
      pairs: q.Pairs || q.pairs || [],
      missingIndices: q.MissingIndices || q.missingIndices || [],
      correctAnswer: q.CorrectAnswer || q.correctAnswer || "",
      weight: q.Weight || q.weight || 3,
      // Additional fields for frontend rendering
      question: q.Text || q.text || "", // For backwards compatibility
    };
  });
};

// Check if questions are valid for the given test type
const validateQuestions = (questions, testTypeId) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return false;
  }
  
  // Check for required properties based on test type
  if (testTypeId === 'memory') {
    // Memory tests require pairs and missingIndices
    const validMemoryQuestions = questions.filter(q => 
      Array.isArray(q.pairs) && q.pairs.length > 0 && 
      Array.isArray(q.missingIndices) && q.missingIndices.length > 0
    );
    
    if (validMemoryQuestions.length === 0) {
      return false;
    }
  }
  
  // For numerical and verbal tests, check if they have either options or are fill-in-gap type
  if (testTypeId === 'number-logic' || testTypeId === 'word-logic') {
    const validQuestions = questions.filter(q => 
      (Array.isArray(q.options) && q.options.length > 0) || 
      q.type === 'fill-in-gap'
    );
    
    if (validQuestions.length === 0) {
      return false;
    }
  }
  
  return true;
};

export const getQuestionsByTestType = async (testTypeId) => {
  try {
    const response = await api.get(`/api/test/questions/${testTypeId}`);
    
    // Normalize the response data to ensure consistent property naming
    const normalizedQuestions = normalizeQuestions(response);
    
    // Validate the questions
    if (!validateQuestions(normalizedQuestions, testTypeId)) {
      // If invalid or empty, return fallback questions
      return normalizeQuestions(getFallbackQuestions(testTypeId));
    }
    
    return normalizedQuestions;
  } catch (error) {
    // Return fallback questions on error
    return normalizeQuestions(getFallbackQuestions(testTypeId));
  }
};
