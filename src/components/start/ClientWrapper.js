"use client";

import React, { useState } from "react";

import TestInProgress from "./TestInProgress";
import TimeUpMessage from "./TimeUpMessage";
import TestResults from "./TestResults";
import { useTheme } from "../shared/ThemeProvider";
import Header from "./Header";

export default function ClientWrapper({ questions }) {
  const { mounted } = useTheme();

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const totalQuestions = questions.length;
  const totalTimeInSeconds = 20 * 60; // 20 minutes

  // Handle timer completion
  const handleTimeUp = () => {
    setTimeUp(true);
    setTestComplete(true);
  };

  // Get current question data
  const questionData = questions[currentQuestion - 1];

  // Handle next question navigation
  const handleNext = () => {
    if (selectedOption !== null) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: selectedOption,
      }));
    }

    if (currentQuestion === totalQuestions) {
      setTestComplete(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedOption(answers[currentQuestion + 1] || null);
  };

  // Handle previous question navigation
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      if (selectedOption !== null) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion]: selectedOption,
        }));
      }

      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(answers[currentQuestion - 1] || null);
    }
  };

  // Handle option selection
  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  // Calculate test results
  const calculateScore = () => {
    let correct = 0;
    Object.keys(answers).forEach((questionId) => {
      const question = questions[parseInt(questionId) - 1];
      if (question.options[answers[questionId]] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  // Don't render until client-side mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          {/* Test in progress UI */}
          {!testComplete && !timeUp && (
            <TestInProgress
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
              questionData={questionData}
              selectedOption={selectedOption}
              handleOptionSelect={handleOptionSelect}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            />
          )}

          {/* Time's up message */}
          {timeUp && !testComplete && (
            <TimeUpMessage setTestComplete={setTestComplete} />
          )}

          {/* Test completed results */}
          {testComplete && (
            <TestResults
              answers={answers}
              totalQuestions={totalQuestions}
              calculateScore={calculateScore}
            />
          )}
        </div>
      </main>
    </div>
  );
}
