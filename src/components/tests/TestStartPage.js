"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { submitTest } from "@/fetch/tests";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import TestInstructions from "../start/tests/TestInstructions";
import NavigationControls from "@/components/start/NavigationControls";
import Header from "@/components/start/Header";

export default function TestStartPage({
  testType,
  initialQuestions = [],
  error = null,
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [testScore, setTestScore] = useState(null);

  // If there was an error from server-side fetching, show it
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Start the test after viewing instructions
  const handleStartTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
  };

  // Handle option selection
  const handleOptionSelect = (index) => {
    setAnswers({
      ...answers,
      [currentQuestion]: { value: index, type: "multiple-choice" },
    });
  };

  // Handle text input
  const handleTextInput = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion]: { value: e.target.value, type: "fill-in-gap" },
    });
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Navigate to next question or submit test
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitTest();
    }
  };

  // Submit test answers
  const handleSubmitTest = async () => {
    setIsLoading(true);

    try {
      // Convert answers to format expected by API
      const formattedAnswers = Object.entries(answers).map(
        ([questionIndex, answer]) => ({
          questionId: questions[questionIndex].id,
          value: answer.value,
          type: answer.type,
        })
      );

      // Submit test
      const result = await submitTest({
        testTypeId: testType.id,
        answers: formattedAnswers,
      });

      // Show results
      setTestScore(result.score);
      setTestComplete(true);
    } catch (error) {
      showError(error.message || "Failed to submit test. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-center">
          <LoadingAnimation />
        </div>
      </>
    );
  }

  // Show test completion results
  if (testComplete) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black">
          <main className="flex flex-col items-center pt-8 pb-16 px-4">
            {/* Test results component */}
            <div className="w-full max-w-3xl">
              {/* Test completion with score display */}
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <Header
        showTimer={testStarted}
        totalSeconds={testType?.timeLimit || 1800} // Default 30 minutes
        onTimeFinish={() => handleSubmitTest()}
      />

      <main className="flex flex-col items-center pt-8 pb-16 px-4">
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden p-6 sm:p-8">
            {/* Show instructions first, then the actual test */}
            {showInstructions ? (
              <TestInstructions
                category={testType?.id}
                onStart={handleStartTest}
              />
            ) : (
              <>
                {/* Current question display */}
                {questions.length > 0 && (
                  <div>
                    {/* Question content based on type */}

                    {/* Navigation controls */}
                    <NavigationControls
                      onPrevious={handlePrevious}
                      onNext={handleNext}
                      isPreviousDisabled={currentQuestion === 0}
                      isNextDisabled={!answers[currentQuestion]}
                      isLastQuestion={currentQuestion === questions.length - 1}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
