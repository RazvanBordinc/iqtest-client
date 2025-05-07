"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import FillInGapQuestion from "../questions/FillInGapQuestion";
import TestProgressBar from "../TestPorgressBar";
import NavigationControls from "../NavigationControls";
import TestCompletionWrapper from "../TestCompletionWrapper";

// Create a container component to handle test logic
const TestContent = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Sample questions data - In a real app this would come from an API or props
  const questions = [
    {
      type: "multiple-choice",
      text: "What number comes next in the sequence: 2, 4, 8, 16, ?",
      options: ["24", "32", "28", "30", "36", "40"],
      correctAnswer: "32",
    },
    {
      type: "fill-in-gap",
      text: "Fill in the missing number: 1, 3, _, 7, 9",
      correctAnswer: "5",
    },
    {
      type: "multiple-choice",
      text: "If 8 + 2x = 24, what is the value of x?",
      options: ["6", "8", "10", "12", "16", "18"],
      correctAnswer: "8",
    },
    {
      type: "fill-in-gap",
      text: "Complete the pattern: 3, 6, 12, 24, _",
      correctAnswer: "48",
    },
    {
      type: "multiple-choice",
      text: "What is the prime factorization of 36?",
      options: ["2² × 3²", "2² × 3³", "2³ × 3", "2 × 3³", "2³ × 3²", "6²"],
      correctAnswer: "2² × 3²",
    },
  ];

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

      if (question.type === "multiple-choice") {
        if (question.options[userAnswer.value] === question.correctAnswer) {
          correct++;
        }
      } else if (question.type === "fill-in-gap") {
        if (
          userAnswer.value.trim().toLowerCase() ===
          question.correctAnswer.toLowerCase()
        ) {
          correct++;
        }
      }
    });

    // If no answers, return 0 to avoid NaN
    if (totalAnswered === 0) return 0;

    return Math.round((correct / totalAnswered) * 100);
  };

  // Handle navigation - Modified to support completion animation
  const handleNext = ({ isCompletion } = {}) => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed - calculate score and proceed
      const score = calculateScore();

      // For completion with animation, pass the score to the handler
      if (isCompletion && onComplete) {
        onComplete({ score });
      }
      // For completion without animation, directly call completion handler
      else if (onComplete) {
        onComplete(score);
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
const NumericalTest = ({ onComplete }) => {
  return (
    <TestCompletionWrapper onComplete={onComplete} testType="numerical">
      <TestContent />
    </TestCompletionWrapper>
  );
};

export default NumericalTest;
