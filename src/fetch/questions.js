import api, { normalizeEndpoint } from "./api";
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

// Helper function to get the correct endpoint path
const getEndpoint = (path) => {
  // Use the normalizeEndpoint function to handle API paths consistently
  return normalizeEndpoint(path);
};

export const getQuestionsByTestType = async (testTypeId) => {
  try {
    console.warn(`FRONTEND: Fetching questions for test type: ${testTypeId}`);
    const endpoint = getEndpoint(`/question/test/${testTypeId}`);
    console.warn(`FRONTEND: API endpoint: ${endpoint}`);
    
    const response = await api.get(endpoint);
    console.warn(`FRONTEND: Received ${response?.length || 0} questions from API for ${testTypeId}`);
    
    // Log first question from API
    if (response && response.length > 0) {
      const firstApiQuestion = response[0]?.text || response[0]?.Text;
      console.warn(`FRONTEND API: First question from API: ${firstApiQuestion?.substring(0, 100)}`);
    }
    
    // Normalize the response data to ensure consistent property naming
    const normalizedQuestions = normalizeQuestions(response);
    console.warn(`FRONTEND: Normalized ${normalizedQuestions?.length || 0} questions for ${testTypeId}`);
    
    // Log first normalized question
    if (normalizedQuestions && normalizedQuestions.length > 0) {
      const firstNormalizedQuestion = normalizedQuestions[0]?.text;
      console.warn(`FRONTEND NORMALIZED: First normalized question: ${firstNormalizedQuestion?.substring(0, 100)}`);
    }
    
    // Validate the questions
    if (!validateQuestions(normalizedQuestions, testTypeId)) {
      console.warn(`FRONTEND: Questions validation failed for ${testTypeId}, using fallback questions`);
      const fallbackQuestions = normalizeQuestions(getFallbackQuestions(testTypeId));
      console.warn(`FRONTEND FALLBACK: Using ${fallbackQuestions?.length || 0} fallback questions for ${testTypeId}`);
      return fallbackQuestions;
    }
    
    console.warn(`FRONTEND SUCCESS: Returning ${normalizedQuestions?.length || 0} validated questions for ${testTypeId}`);
    return normalizedQuestions;
  } catch (error) {
    console.error(`FRONTEND ERROR: Failed to fetch questions for ${testTypeId}:`, error);
    const fallbackQuestions = normalizeQuestions(getFallbackQuestions(testTypeId));
    console.warn(`FRONTEND ERROR FALLBACK: Using ${fallbackQuestions?.length || 0} fallback questions for ${testTypeId}`);
    return fallbackQuestions;
  }
};
