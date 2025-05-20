"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Eye, Clock } from "lucide-react";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import FillInGapQuestion from "../questions/FillInGapQuestion";
import MemoryPairQuestion from "../questions/MemoryPairQuestion";
import TestProgressBar from "../TestProgressBar";
import NavigationControls from "../NavigationControls";

const MixedTest = ({ onComplete, questions = [] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testComplete, setTestComplete] = useState(false);
  const [memoryPhase, setMemoryPhase] = useState("memorization"); // Only used for memory questions
  const [timer, setTimer] = useState(0); // For memory questions timer
  const [recallTimer, setRecallTimer] = useState(30); // Timer for recall phase
  const [memoryAnswers, setMemoryAnswers] = useState({}); // Track answers for memory pairs
  
  // Effect to handle timer expiration
  useEffect(() => {
    const checkTimeExpiration = () => {
      if (window.testRemainingTime !== undefined && window.testRemainingTime <= 0) {
        // Submit whatever answers we have
        const finalAnswers = formatAnswersForSubmission();
        onComplete(finalAnswers);
      }
    };
    
    const interval = setInterval(checkTimeExpiration, 1000);
    return () => clearInterval(interval);
  }, [answers, onComplete, questions]);

  // Initialize component with questions
  useEffect(() => {
    // Questions loaded effect hook
  }, [questions]);

  // Get current question data
  const currentQuestionData = React.useMemo(() => {
    
    if (!questions || questions.length === 0) {
      return {
        type: "multiple-choice",
        text: "Loading questions...",
        options: ["Please wait..."]
      };
    }
    
    if (currentQuestion >= questions.length) {
      return {
        type: "multiple-choice", 
        text: "No more questions",
        options: ["Test complete"]
      };
    }
    
    // Handle both PascalCase and camelCase properties
    const rawQuestion = questions[currentQuestion];
    if (rawQuestion) {
      return {
        // Support both normalized camelCase and PascalCase backend format
        type: rawQuestion.type || rawQuestion.Type || "multiple-choice",
        text: rawQuestion.text || rawQuestion.Text || "Question text unavailable",
        options: rawQuestion.options || rawQuestion.Options || [],
        memorizationTime: rawQuestion.memorizationTime || rawQuestion.MemorizationTime || 15,
        pairs: rawQuestion.pairs || rawQuestion.Pairs || [],
        missingIndices: rawQuestion.missingIndices || rawQuestion.MissingIndices || [],
        id: rawQuestion.id || rawQuestion.Id || currentQuestion,
        category: rawQuestion.category || rawQuestion.Category || "mixed",
        correctAnswer: rawQuestion.correctAnswer || rawQuestion.CorrectAnswer || "",
        weight: rawQuestion.weight || rawQuestion.Weight || 1
      };
    }
    
    return {
      type: "multiple-choice",
      text: "Question not available",
      options: ["Option A", "Option B", "Option C", "Option D"]
    };
  }, [questions, currentQuestion]);

  // Handle memory question timer for memorization phase
  useEffect(() => {
    if (
      currentQuestionData?.type === "memory-pair" &&
      memoryPhase === "memorization" &&
      timer > 0
    ) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setMemoryPhase("recall");
            setRecallTimer(30); // Set recall timer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [currentQuestionData?.type, memoryPhase, timer]);

  // Handle memory question timer for recall phase
  useEffect(() => {
    if (
      currentQuestionData?.type === "memory-pair" &&
      memoryPhase === "recall" &&
      recallTimer > 0
    ) {
      const countdown = setInterval(() => {
        setRecallTimer((prev) => {
          if (prev <= 1) {
            // Auto-submit empty answers if time runs out
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionData?.type, memoryPhase, recallTimer]);

  // Reset memory phase when moving to a new memory question
  useEffect(() => {
    if (currentQuestionData?.type === "memory-pair") {
      // Only reset if this is a different memory question
      const prevAnswer = answers[currentQuestion];
      if (!prevAnswer || prevAnswer.type !== "memory-pair") {
        setMemoryPhase("memorization");
        setTimer(currentQuestionData.memorizationTime || 20);
        setRecallTimer(30);
        setMemoryAnswers({}); // Reset memory answers for new question
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, currentQuestionData?.type, currentQuestionData?.memorizationTime]);

  // If no questions are provided, show error
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No questions available for this test.
        </p>
        <button
          onClick={() => onComplete([])}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Return
        </button>
      </div>
    );
  }

  // Handle option selection for multiple choice
  const handleOptionSelect = (index) => {
    setAnswers({
      ...answers,
      [currentQuestion]: { value: index, type: "multiple-choice" },
    });
  };

  // Handle text input for fill-in-gap
  const handleTextInput = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion]: { value: e.target.value, type: "fill-in-gap" },
    });
  };

  // Handle memory pair answer (for individual inputs)
  const handleMemoryAnswer = (inputId, value) => {
    setMemoryAnswers((prev) => {
      const updated = {
        ...prev,
        [inputId]: value,
      };
      
      // Store all memory answers for this question in real-time
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion]: { value: updated, type: "memory-pair" },
      }));
      
      return updated;
    });
  };

  // Format answers for submission - matching parent component's format
  const formatAnswersForSubmission = () => {
    // Format answers to match backend expectations
    const formattedAnswers = questions.map((question, index) => {
      const userAnswer = answers[index];
      
      // Get question ID and type from either camelCase or PascalCase properties
      const questionId = question.id || question.Id || index;
      const questionType = question.type || question.Type || "multiple-choice";
      
      // If no answer for this question, return null value
      if (!userAnswer || userAnswer.type === "skipped" || userAnswer.value === null) {
        return {
          questionId: questionId,
          type: questionType,
          value: null,
        };
      }
      
      // Format based on answer type - check for both camelCase and PascalCase
      const isMemoryPair = questionType.toLowerCase() === "memory-pair" || 
                          questionType.toLowerCase() === "memory";
      
      if (isMemoryPair) {
        // For memory questions, properly format the object
        return {
          questionId: questionId,
          type: "memory-pair",
          value:
            typeof userAnswer.value === "object"
              ? JSON.stringify(userAnswer.value)
              : userAnswer.value,
        };
      } else {
        // For other question types
        return {
          questionId: questionId,
          type: userAnswer.type || questionType,
          value: userAnswer.value,
        };
      }
    });

    return formattedAnswers;
  };

  // Handle navigation - requires answers for all questions, no skipping
  const handleNext = ({ isCompletion } = {}) => {
    // Don't allow navigation without an answer
    if (!hasAnswer()) {
      return;
    }
    
    // For memory questions in recall phase, check if all inputs are filled
    if (currentQuestionData?.type === "memory-pair" && memoryPhase === "recall") {
      const missingPairs = currentQuestionData.missingIndices || [];
      let allFilled = true;
      
      for (let pairIndex = 0; pairIndex < missingPairs.length; pairIndex++) {
        if (!missingPairs[pairIndex]) continue;
        
        for (let wordIndex of missingPairs[pairIndex]) {
          const inputId = `pair-${pairIndex}-word-${wordIndex}`;
          if (!memoryAnswers[inputId] || memoryAnswers[inputId].trim() === "") {
            allFilled = false;
            break;
          }
        }
        if (!allFilled) break;
      }
      
      if (!allFilled) {
        return; // Don't allow navigation until all inputs are filled
      }
    }
    
    // Special handling for memory questions
    if (currentQuestionData?.type === "memory-pair") {
      if (memoryPhase === "memorization") {
        // Move to recall phase
        setMemoryPhase("recall");
        setRecallTimer(30);
        return;
      } else {
        // In recall phase, save the final memory answers
        const finalMemoryAnswers = { ...memoryAnswers };
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [currentQuestion]: { value: finalMemoryAnswers, type: "memory-pair" },
        }));
        // Continue to move to the next question after saving
      }
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed - make sure all questions are answered
      const allAnswered = questions.every((_, index) => answers[index]?.value !== null && answers[index]?.value !== undefined);
      
      if (!allAnswered) {
        // All questions must be answered before submission
        return;
      }
      
      // Send answers to parent
      const finalAnswers = formatAnswersForSubmission();

      if (onComplete) {
        onComplete(finalAnswers);
      }
    }
  };

  // Disable going back
  const handlePrevious = () => {
    // No going back functionality - completely disabled
    return;
  };

  // Get current answer based on question type
  const getCurrentAnswer = () => {
    const answerData = answers[currentQuestion];

    if (!answerData) {
      return currentQuestionData.type === "multiple-choice" ? null : "";
    }

    return answerData.value;
  };

  // Check if current question has been answered
  const hasAnswer = () => {
    // Get question type, safely handling both camelCase and PascalCase
    const questionType = (currentQuestionData.type || "").toLowerCase().trim();
    
    // Special case for memory questions in memorization phase
    if ((questionType === "memory-pair" || questionType === "memory") && 
        memoryPhase === "memorization") {
      return true; // Always allow proceeding from memorization phase
    }
    
    // For memory questions in recall phase, check if all inputs are filled
    if ((questionType === "memory-pair" || questionType === "memory") && 
        memoryPhase === "recall") {
      const missingPairs = currentQuestionData.missingIndices || [];
      
      // If there are no missing pairs defined, something is wrong with the question
      if (!missingPairs.length) {
        // Memory question missing required indices
        return false;
      }
      
      for (let pairIndex = 0; pairIndex < missingPairs.length; pairIndex++) {
        if (!missingPairs[pairIndex]) continue;
        
        for (let wordIndex of missingPairs[pairIndex]) {
          const inputId = `pair-${pairIndex}-word-${wordIndex}`;
          if (!memoryAnswers[inputId] || memoryAnswers[inputId].trim() === "") {
            return false; // Not all inputs are filled
          }
        }
      }
      
      return true; // All inputs are filled
    }
    
    // For other question types
    const answerData = answers[currentQuestion];
    if (!answerData || answerData.type === "skipped") return false;
    
    if (questionType === "multiple-choice") {
      return typeof answerData.value === "number";
    } else if (questionType === "fill-in-gap") {
      return answerData.value?.trim().length > 0;
    }
    
    // Default case - if we don't recognize the type, be cautious
    return false;
  };

  // Render question based on type
  const renderQuestion = () => {
    // Safely access and normalize the question type
    const questionType = (currentQuestionData.type || "").toLowerCase().trim();
    
    // If pairs exist, it's a memory question regardless of what the type says
    const hasMemoryData = Array.isArray(currentQuestionData.pairs) && 
                         currentQuestionData.pairs.length > 0 &&
                         Array.isArray(currentQuestionData.missingIndices) &&
                         currentQuestionData.missingIndices.length > 0;
    
    // If options exist, it's a multiple choice question
    const hasMultipleChoiceData = Array.isArray(currentQuestionData.options) && 
                                  currentQuestionData.options.length > 0;
    
    // Determine the effective question type based on content
    let effectiveType = questionType;
    
    if (!effectiveType || effectiveType === "") {
      if (hasMemoryData) {
        effectiveType = "memory-pair";
      } else if (hasMultipleChoiceData) {
        effectiveType = "multiple-choice";
      } else {
        effectiveType = "fill-in-gap";
      }
      // Infer the question type from content
    }
    
    // Render based on the effective type
    switch (effectiveType) {
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={currentQuestionData.text}
            options={currentQuestionData.options || ["Option A", "Option B", "Option C", "Option D"]}
            selectedOption={getCurrentAnswer()}
            onSelectOption={handleOptionSelect}
            questionNumber={currentQuestion}
          />
        );
        
      case "fill-in-gap":
        return (
          <FillInGapQuestion
            question={currentQuestionData.text}
            currentAnswer={getCurrentAnswer()}
            onAnswerChange={handleTextInput}
            questionNumber={currentQuestion}
          />
        );
        
      case "memory":
      case "memory-pair":
        // Ensure we have valid memory question data
        if (!hasMemoryData) {
          // Missing memory question data, using fallback
          return (
            <MultipleChoiceQuestion
              question={currentQuestionData.text || "Memory question data error"}
              options={["Unable to load memory question", "Please try again", "Contact support", "Skip this question"]}
              selectedOption={getCurrentAnswer()}
              onSelectOption={handleOptionSelect}
              questionNumber={currentQuestion}
            />
          );
        }
        
        if (memoryPhase === "memorization") {
          // Memorization phase
          return (
            <motion.div
              key="memorization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                className="mb-6 text-purple-600 dark:text-purple-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-16 h-16 mx-auto" />
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Memorize{" "}
                {currentQuestionData.pairs[0]?.length === 2
                  ? "These Pairs"
                  : "These Triplets"}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You&apos;ll need to recall the missing{" "}
                {currentQuestionData.pairs[0]?.length === 2
                  ? "word from each pair"
                  : "words from each triplet"}{" "}
                afterward
              </p>

              {/* Memory pairs or triplets to memorize */}
              <div className="grid gap-4 max-w-lg mx-auto mb-8">
                {currentQuestionData.pairs.map((pair, pairIndex) => (
                  <motion.div
                    key={`memorize-${pairIndex}`}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pairIndex * 0.15 }}
                  >
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {pair.map((word, wordIndex) => (
                        <React.Fragment key={`word-${pairIndex}-${wordIndex}`}>
                          <motion.div
                            className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md font-medium text-gray-900 dark:text-white shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {word}
                          </motion.div>

                          {wordIndex < pair.length - 1 && (
                            <div className="text-gray-400">→</div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Timer display */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-purple-500" />
                <motion.div
                  className="text-xl font-bold text-purple-600 dark:text-purple-400"
                  key={timer}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {timer}s
                </motion.div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Take your time to memorize. The test will automatically continue
                in {timer} seconds...
              </p>
            </motion.div>
          );
        } else {
          // Recall phase
          return (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recall timer display */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <motion.div
                    className="text-xl font-bold text-amber-600 dark:text-amber-400"
                    key={recallTimer}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {Math.floor(recallTimer / 60)}:
                    {(recallTimer % 60).toString().padStart(2, '0')}
                  </motion.div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Time remaining to complete this set
                </p>
              </div>

              <MemoryPairQuestion
                questionText={currentQuestionData.text}
                pairs={currentQuestionData.pairs}
                missingIndices={currentQuestionData.missingIndices}
                userAnswers={memoryAnswers}
                onAnswerChange={handleMemoryAnswer}
                questionNumber={currentQuestion}
                showHint={true}
              />
            </motion.div>
          );
        }
        
      default:
        // Unknown question type, using fallback
        // Fallback to multiple choice if type is not recognized
        return (
          <MultipleChoiceQuestion
            question={currentQuestionData.text || "Question not available"}
            options={currentQuestionData.options || ["Option A", "Option B", "Option C", "Option D"]}
            selectedOption={getCurrentAnswer()}
            onSelectOption={handleOptionSelect}
            questionNumber={currentQuestion}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comprehensive IQ Test
          </h2>
          <Sparkles className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          A comprehensive test combining numerical, verbal, and memory challenges
        </p>
      </motion.div>

      <TestProgressBar
        current={currentQuestion}
        total={questions.length}
        type="mixed"
      />

      {/* Question content */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls - require answer before proceeding, no going back */}
        <NavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={true} // Always disable previous button
          isNextDisabled={!hasAnswer()} // Disable next if no answer
          isLastQuestion={currentQuestion === questions.length - 1}
          testType="mixed"
          hasAnswer={hasAnswer()}
          enableKeyboard={true}
          nextText={
            currentQuestionData?.type === "memory-pair" && memoryPhase === "memorization"
              ? "I'm Ready"
              : currentQuestion < questions.length - 1
              ? "Next"
              : "Finish"
          }
        />
      </div>
    </div>
  );
};

export default MixedTest;