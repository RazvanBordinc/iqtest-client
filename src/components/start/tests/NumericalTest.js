"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import FillInGapQuestion from "../questions/FillInGapQuestion";
import TestProgressBar from "../TestPorgressBar";
import NavigationControls from "../NavigationControls";
import TestCompletionWrapper from "../TestCompletionWrapper";

// Create a container component to handle test logic
const TestContent = ({ onComplete, questions = [] }) => {
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
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    let totalAnswered = 0;

    questions.forEach((question, index) => {
      const userAnswer = answers[index];

      if (!userAnswer) return;
      totalAnswered++;

      // Note: We can't actually check correctness on frontend
      // since correct answers are not sent from backend
      // The backend will calculate the actual score
    });

    // Return answers for submission to backend
    return answers;
  };

  // Handle navigation - Modified to support completion
  const handleNext = ({ isCompletion } = {}) => {
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

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Get current answer based on question type
  const getCurrentAnswer = () => {
    const answerData = answers[currentQuestion];

    if (!answerData) {
      return currentQuestionData.type === "multiple-choice" ? null : "";
    }

    return answerData.value;
  };

  // Is next button enabled - enable if user has answered
  const isNextEnabled = () => {
    return (
      (currentQuestionData.type === "multiple-choice" &&
        typeof answers[currentQuestion]?.value === "number") ||
      (currentQuestionData.type === "fill-in-gap" &&
        answers[currentQuestion]?.value?.trim().length > 0)
    );
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
          Numerical Reasoning Test
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Test your ability to analyze numerical patterns and solve mathematical
          puzzles
        </p>
      </motion.div>

      <TestProgressBar
        current={currentQuestion}
        total={questions.length}
        type="numerical"
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
        </AnimatePresence>

        {/* Updated navigation controls */}
        <NavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={currentQuestion === 0}
          isNextDisabled={!isNextEnabled()}
          isLastQuestion={currentQuestion === questions.length - 1}
          testType="numerical"
        />
      </div>
    </div>
  );
};

// Main component that wraps the test content
const NumericalTest = ({ onComplete, questions = [] }) => {
  // Don't use TestCompletionWrapper since we're handling completion
  // in the parent TestStartPage component now
  return <TestContent onComplete={onComplete} questions={questions} />;
};

export default NumericalTest;
