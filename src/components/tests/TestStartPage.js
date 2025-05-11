"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { submitTest } from "@/fetch/tests";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import { isAuthenticated } from "@/fetch/auth";

// Import test components
import NumericalTest from "@/components/start/tests/NumericalTest";
import VerbalTest from "@/components/start/tests/VerbalTest";
import MemoryTest from "@/components/start/tests/MemoryTest";
import MixedTest from "@/components/start/tests/MixedTest";

// Import instructions and header
import TestInstructions from "@/components/start/tests/TestInstructions";
import Header from "@/components/start/Header";

export default function TestStartPage({
  testType,
  initialQuestions = [],
  error = null,
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [testScore, setTestScore] = useState(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth");
    }
  }, [router]);

  // If there was an error from server-side fetching, show it
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Update questions if they change
  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  // Start the test after viewing instructions
  const handleStartTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
  };

  // Handle test completion
  const handleTestComplete = async (answers) => {
    if (!answers || answers.length === 0) {
      showError("No answers to submit. Please complete the test.");
      return;
    }

    setIsLoading(true);

    try {
      // Format answers for submission
      const formattedAnswers = formatAnswersForSubmission(answers);

      // Submit test to backend
      const result = await submitTest({
        testTypeId: testType.id,
        answers: formattedAnswers,
      });

      // Set results and show completion
      setTestScore(result);
      setTestComplete(true);
    } catch (error) {
      console.error("Test submission error:", error);
      showError(error.message || "Failed to submit test. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format answers for backend submission
  const formatAnswersForSubmission = (answers) => {
    return Object.entries(answers)
      .map(([questionIndex, answer]) => {
        const question = questions[parseInt(questionIndex)];

        if (!question) {
          console.warn(`Question not found for index ${questionIndex}`);
          return null;
        }

        // Format based on answer type
        if (question.type === "memory-pair") {
          // For memory questions, properly format the object
          return {
            questionId: question.id,
            type: "memory-pair",
            // Convert the answer object to a proper string:string dictionary
            value: JSON.stringify(answer),
          };
        } else {
          // For other question types
          return {
            questionId: question.id,
            type: answer.type || question.type,
            value:
              typeof answer.value === "string"
                ? answer.value
                : String(answer.value),
          };
        }
      })
      .filter(Boolean); // Remove null entries
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-center">
          <LoadingAnimation />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Submitting your test...
          </p>
        </div>
      </>
    );
  }

  // Render appropriate test component based on test type
  const renderTestComponent = () => {
    const testProps = {
      onComplete: handleTestComplete,
      questions,
    };

    switch (testType?.id) {
      case "number-logic":
        return <NumericalTest {...testProps} />;
      case "word-logic":
        return <VerbalTest {...testProps} />;
      case "memory":
        return <MemoryTest {...testProps} />;
      case "mixed":
        return <MixedTest {...testProps} />;
      default:
        return <MixedTest {...testProps} />;
    }
  };

  // Show test completion results
  if (testComplete && testScore) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black">
          <main className="flex flex-col items-center pt-8 pb-16 px-4">
            <div className="w-full max-w-3xl">
              {/* Test results component */}
              <div className="bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden p-6 sm:p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Test Complete!
                  </h2>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {testScore.score}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    You scored in the {testScore.percentile}th percentile
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400">
                        Duration
                      </div>
                      <div className="font-semibold">{testScore.duration}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400">
                        Accuracy
                      </div>
                      <div className="font-semibold">
                        {testScore.accuracy.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4 justify-center">
                    <button
                      onClick={() => router.push("/tests")}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Back to Tests
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Main test interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <Header
        showTimer={testStarted}
        totalSeconds={testType?.timeLimit || 1800} // Use time limit from props
        onTimeFinish={() => handleTestComplete({})} // Submit empty answers on timeout
      />

      <main className="flex flex-col items-center pt-8 pb-16 px-4">
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {showInstructions ? (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TestInstructions
                    category={testType?.id}
                    onStart={handleStartTest}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="test"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTestComponent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
