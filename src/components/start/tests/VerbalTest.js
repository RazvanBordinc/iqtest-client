"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import FillInGapQuestion from "../questions/FillInGapQuestion";
import TestProgressBar from "../TestProgressBar";
import NavigationControls from "../NavigationControls";

const VerbalTest = ({ onComplete, questions = [] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  
  // Effect to handle timer expiration
  useEffect(() => {
    const checkTimeExpiration = () => {
      if (window.testRemainingTime !== undefined && window.testRemainingTime <= 0) {
        // Submit whatever answers we have
        const finalAnswers = Object.entries(answers).map(([index, answer]) => ({
          ...answer,
          questionIndex: parseInt(index),
        }));
        onComplete(finalAnswers);
      }
    };
    
    const interval = setInterval(checkTimeExpiration, 1000);
    return () => clearInterval(interval);
  }, [answers, onComplete]);

  // If no questions are provided, show error
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No questions available for this test.
        </p>
        <button
          onClick={() => onComplete([])}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Return
        </button>
      </div>
    );
  }

  // Get current question data
  const currentQuestionData = questions[currentQuestion];

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

  // Calculate score and prepare answers for submission
  const calculateScore = () => {
    // Convert answers object to array format for backend submission
    const formattedAnswers = [];
    
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      
      if (userAnswer) {
        // Only include non-null values (skip empty questions)
        if (userAnswer.type !== "skipped" && userAnswer.value !== null) {
          formattedAnswers.push({
            questionIndex: index,
            questionId: question.id || question.Id, // Use normalized id property
            value: userAnswer.value,
            type: userAnswer.type
          });
        }
      }
    });

    // Return formatted answers for submission to backend
    return formattedAnswers;
  };

  // Handle navigation - No skipping allowed
  const handleNext = ({ isCompletion } = {}) => {
    // Don't allow proceeding without an answer
    if (!hasAnswer()) {
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed - send answers to parent
      const finalAnswers = calculateScore();

      if (onComplete) {
        onComplete(finalAnswers);
      }
    }
  };

  // Disable going back
  const handlePrevious = () => {
    // No going back functionality - disabled
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
    const answerData = answers[currentQuestion];
    if (!answerData || answerData.type === "skipped") return false;
    
    if (currentQuestionData.type === "multiple-choice") {
      return typeof answerData.value === "number";
    } else if (currentQuestionData.type === "fill-in-gap") {
      return answerData.value?.trim().length > 0;
    }
    
    return false;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verbal Intelligence Test
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Test your ability to understand and analyze language, words, and
          concepts
        </p>
      </motion.div>

      <TestProgressBar
        current={currentQuestion}
        total={questions.length}
        type="verbal"
      />

      {/* Question content */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestionData.type === "multiple-choice" ? (
            <MultipleChoiceQuestion
              question={currentQuestionData.text}
              options={currentQuestionData.options}
              selectedOption={getCurrentAnswer()}
              onSelectOption={handleOptionSelect}
              questionNumber={currentQuestion}
            />
          ) : (
            <FillInGapQuestion
              question={currentQuestionData.text}
              currentAnswer={getCurrentAnswer()}
              onAnswerChange={handleTextInput}
              questionNumber={currentQuestion}
            />
          )}
        </motion.div>

        {/* Updated navigation controls - no skipping, no going back */}
        <NavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={true} // Always disable previous
          isNextDisabled={!hasAnswer()} // Disable next if no answer
          isLastQuestion={currentQuestion === questions.length - 1}
          testType="verbal"
          hasAnswer={hasAnswer()}
          enableKeyboard={true}
        />
      </div>
    </div>
  );
};

export default VerbalTest;