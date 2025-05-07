"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTheme } from "../shared/ThemeProvider";
import Header from "./Header";

// Import test components
import NumericalTest from "./tests/NumericalTest";
import VerbalTest from "./tests/VerbalTest";
import MemoryTest from "./tests/MemoryTest";
import MixedTest from "./tests/MixedTest";

// Import instructions component
import TestInstructions from "./tests/TestInstructions";

export default function ClientWrapper({ questions }) {
  const { mounted } = useTheme();
  const searchParams = useSearchParams();

  // Get test category from URL parameters
  const category = searchParams.get("category");

  // State for test flow
  const [testScore, setTestScore] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [testStarted, setTestStarted] = useState(false);

  // Handle test completion
  const handleTestComplete = (score) => {
    // Extract score value if it was passed as an object
    const scoreValue =
      score && typeof score === "object" && "score" in score
        ? score.score
        : score;

    setTestScore(scoreValue);

    // Here you could also save the score to localStorage or your backend
    try {
      const testHistory = JSON.parse(
        localStorage.getItem("testHistory") || "{}"
      );
      const categoryHistory = testHistory[category] || [];

      categoryHistory.push({
        score: scoreValue,
        date: new Date().toISOString(),
        duration: "15:30", // In a real app, you'd calculate this
        percentile: Math.round(scoreValue * 0.9), // Example calculation
        completed: questions?.length || 20,
        accuracy: `${Math.round(scoreValue)}%`,
      });

      testHistory[category] = categoryHistory;
      localStorage.setItem("testHistory", JSON.stringify(testHistory));
    } catch (error) {
      console.error("Error saving test results:", error);
    }
  };

  // Handle starting the test after viewing instructions
  const handleStartTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
  };

  // Don't render until client-side mounted to prevent hydration issues
  if (!mounted) return null;

  // Render the appropriate test component based on category
  const renderTestComponent = () => {
    switch (category) {
      case "number-logic":
        return <NumericalTest onComplete={handleTestComplete} />;
      case "word-logic":
        return <VerbalTest onComplete={handleTestComplete} />;
      case "memory":
        return <MemoryTest onComplete={handleTestComplete} />;
      case "mixed":
        return <MixedTest onComplete={handleTestComplete} />;
      default:
        // Fallback to mixed test if no valid category
        return <MixedTest onComplete={handleTestComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black text-black dark:text-white">
      <Header
        showTimer={testStarted}
        totalSeconds={
          category === "number-logic"
            ? 25 * 60
            : category === "word-logic"
            ? 30 * 60
            : category === "memory"
            ? 22 * 60
            : 45 * 60 // mixed test
        }
        onTimeFinish={() => handleTestComplete(0)}
      />

      <main className="flex flex-col items-center pt-8 pb-16 px-4">
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Main content */}
          <div
            className="bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 
                        rounded-2xl backdrop-blur-md shadow-xl overflow-hidden p-6 sm:p-8"
          >
            {/* Show instructions first, then the actual test */}
            {showInstructions ? (
              <TestInstructions category={category} onStart={handleStartTest} />
            ) : (
              renderTestComponent()
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
