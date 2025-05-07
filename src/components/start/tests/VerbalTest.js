"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import FillInGapQuestion from "../questions/FillInGapQuestion";
import TestProgressBar from "./TestProgressBar";
import NavigationControls from "./NavigationControls";

const VerbalTest = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testComplete, setTestComplete] = useState(false);

  // Sample questions data - In a real app this would come from an API or props
  const questions = [
    {
      type: "multiple-choice",
      text: "Which word is closest in meaning to 'ephemeral'?",
      options: [
        "Permanent",
        "Temporary",
        "Important",
        "Colorful",
        "Spiritual",
        "Dramatic",
      ],
      correctAnswer: "Temporary",
    },
    {
      type: "fill-in-gap",
      text: "Complete the analogy: Book is to Reading as Fork is to _____",
      correctAnswer: "Eating",
    },
    {
      type: "multiple-choice",
      text: "Which word is an antonym of 'benevolent'?",
      options: [
        "Malicious",
        "Charitable",
        "Friendly",
        "Generous",
        "Considerate",
        "Sympathetic",
      ],
      correctAnswer: "Malicious",
    },
    {
      type: "fill-in-gap",
      text: "Complete the word: Psy_____ogy",
      correctAnswer: "chol",
    },
    {
      type: "multiple-choice",
      text: "Identify the correct sentence:",
      options: [
        "Their going to the store later.",
        "They're going too the store later.",
        "Their going too the store later.",
        "They're going to the store later.",
        "There going to the store later.",
        "There going too the store later.",
      ],
      correctAnswer: "They're going to the store later.",
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

  // Handle navigation
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed
      setTestComplete(true);
      if (onComplete) {
        onComplete(calculateScore());
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;

    questions.forEach((question, index) => {
      const userAnswer = answers[index];

      if (!userAnswer) return;

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

    return Math.round((correct / questions.length) * 100);
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
          Verbal Intelligence Test
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Challenge your vocabulary, word relationships, and language
          comprehension
        </p>
      </motion.div>

      {/* Progress bar */}
      <TestProgressBar
        currentQuestion={currentQuestion + 1}
        totalQuestions={questions.length}
      />

      {/* Question */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
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

        {/* Navigation */}
        <NavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={currentQuestion === 0}
          isNextDisabled={!isNextEnabled()}
          isLastQuestion={currentQuestion === questions.length - 1}
        />
      </div>
    </div>
  );
};

export default VerbalTest;
