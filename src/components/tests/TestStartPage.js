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
import TestResults from "@/components/start/TestResults";

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
  const [testStartTime, setTestStartTime] = useState(null);

  // Get time limit in seconds from testType
  const getTimeLimit = () => {
    if (!testType?.stats?.timeLimit) return 1800; // Default 30 minutes

    const timeLimitStr = testType.stats.timeLimit;
    const minutes = parseInt(timeLimitStr.match(/(\d+)/)[0], 10);
    return minutes * 60; // Convert to seconds
  };

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth");
    }
  }, [router]);

  // Show error if passed from server
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
    setTestStartTime(Date.now());
  };

  // Handle test completion
  const handleTestComplete = async (answers) => {
    if (!answers || Object.keys(answers).length === 0) {
      showError("No answers to submit. Please complete the test.");
      return;
    }

    setIsLoading(true);

    try {
      // Calculate time taken in seconds
      const endTime = Date.now();
      const calculatedTimeTaken = testStartTime
        ? Math.floor((endTime - testStartTime) / 1000)
        : 0;

      console.log(`Test completed in ${calculatedTimeTaken} seconds`);

      // Format answers for submission
      const formattedAnswers = formatAnswersForSubmission(answers);

      // Submit test to backend with time taken
      const result = await submitTest({
        testTypeId: testType.id,
        answers: formattedAnswers,
        timeTaken: calculatedTimeTaken,
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
            value:
              typeof answer.value === "object"
                ? JSON.stringify(answer.value)
                : answer.value,
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

  // Function to handle timer expiration
  const handleTimerExpire = () => {
    console.log("Test time expired, auto-submitting");
    // Submit whatever answers were collected
    handleTestComplete({});
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
              <TestResults
                answers={[]}
                totalQuestions={testType?.stats?.questionsCount || 0}
                calculateScore={() => testScore.score}
              />
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
        totalSeconds={getTimeLimit()}
        onTimeFinish={handleTimerExpire}
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
