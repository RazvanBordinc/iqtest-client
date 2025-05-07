"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Trophy,
  Crown,
  BarChart3,
  Users,
  Brain,
  ChevronUp,
} from "lucide-react";

/**
 * Enhanced wrapper component that handles test completion animations
 * and displays beautiful results with animations
 */
const TestCompletionWrapper = ({
  children,
  onComplete,
  testType = "numerical",
  score = null,
}) => {
  const [animationPhase, setAnimationPhase] = useState("initial"); // initial -> animation -> results
  const [calculatedScore, setCalculatedScore] = useState(null);
  const [ranking, setRanking] = useState(1341); // Sample ranking
  const [percentile, setPercentile] = useState(87); // Sample percentile

  // Get gradient and icon based on test type
  const getTypeInfo = () => {
    switch (testType) {
      case "numerical":
        return {
          color:
            "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          title: "Numerical Reasoning",
          icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
        };
      case "verbal":
        return {
          color:
            "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
          bg: "bg-green-50 dark:bg-green-900/20",
          title: "Verbal Intelligence",
          icon: <Brain className="w-6 h-6 text-green-500" />,
        };
      case "memory":
        return {
          color:
            "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
          bg: "bg-amber-50 dark:bg-amber-900/20",
          title: "Memory & Recall",
          icon: <Brain className="w-6 h-6 text-amber-500" />,
        };
      case "mixed":
        return {
          color:
            "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          title: "Comprehensive IQ",
          icon: <Brain className="w-6 h-6 text-purple-500" />,
        };
      default:
        return {
          color:
            "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          title: "Test Results",
          icon: <Brain className="w-6 h-6 text-purple-500" />,
        };
    }
  };

  const typeInfo = getTypeInfo();

  // Determine IQ score range based on percentile (simplified calculation)
  const getIQScore = (percentile) => {
    // Simple conversion from percentile to IQ (very rough approximation)
    // Real IQ calculations would be more complex
    return Math.round(100 + (percentile - 50) * 2);
  };

  // Handler for test completion
  const handleComplete = useCallback(
    (completionData) => {
      // Extract score value if it was passed as an object
      const scoreValue =
        completionData &&
        typeof completionData === "object" &&
        "score" in completionData
          ? completionData.score
          : completionData || score;

      setCalculatedScore(scoreValue);

      // Start animation sequence
      setAnimationPhase("animation");

      // Simulate generating percentile and ranking
      setPercentile(Math.min(99, Math.max(50, Math.round(scoreValue * 0.9))));
      setRanking(Math.round((100000 / Math.max(10, scoreValue)) * 10));

      // After animation, move to results phase
      setTimeout(() => {
        setAnimationPhase("results");

        // Also call the original onComplete handler
        if (onComplete && typeof onComplete === "function") {
          onComplete(scoreValue);
        }
      }, 3000);
    },
    [onComplete, score]
  );

  // Generate performance label based on percentile
  const getPerformanceLabel = () => {
    if (percentile >= 95) return "Exceptional";
    if (percentile >= 85) return "Superior";
    if (percentile >= 70) return "Above Average";
    if (percentile >= 45) return "Average";
    return "Fair";
  };

  // Get IQ classification based on IQ score
  const getIQClassification = (iq) => {
    if (iq >= 140) return "Gifted or Genius";
    if (iq >= 120) return "Superior Intelligence";
    if (iq >= 110) return "High Average";
    if (iq >= 90) return "Average";
    if (iq >= 80) return "Low Average";
    return "Below Average";
  };

  // Calculated IQ score based on percentile
  const iqScore = getIQScore(percentile);

  return (
    <div className="relative w-full min-h-[600px]">
      {/* Main content */}
      <AnimatePresence mode="wait">
        {animationPhase === "initial" && (
          <motion.div
            key="test-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Pass handleComplete only to the functional components */}
            {React.Children.map(children, (child) => {
              if (
                React.isValidElement(child) &&
                typeof child.type === "function"
              ) {
                return React.cloneElement(child, {
                  onComplete: handleComplete,
                });
              }
              return child;
            })}
          </motion.div>
        )}

        {/* Completion animation */}
        {animationPhase === "animation" && (
          <motion.div
            key="completion-animation"
            className="absolute inset-0 flex items-center justify-center min-h-[500px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`p-10 rounded-xl ${typeInfo.bg} flex flex-col items-center justify-center max-w-md mx-auto`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative">
                  <motion.div
                    className={`w-28 h-28 rounded-full bg-gradient-to-r ${typeInfo.color} flex items-center justify-center`}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(79, 70, 229, 0.5)",
                        "0 0 0 15px rgba(79, 70, 229, 0)",
                        "0 0 0 0 rgba(79, 70, 229, 0)",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: 2,
                      repeatType: "loop",
                      delay: 0.5,
                    }}
                  >
                    <CheckCircle className="w-14 h-14 text-white" />
                  </motion.div>

                  {/* Particle effects */}
                  <motion.div
                    className="absolute -top-4 -right-4"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 -left-3"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Award className="w-7 h-7 text-yellow-500" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.h2
                className="mt-8 text-2xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Test Complete!
              </motion.h2>

              <motion.p
                className="mt-4 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Analyzing your performance...
              </motion.p>

              {/* Loading bar */}
              <motion.div
                className="mt-8 w-full max-w-xs h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${typeInfo.color} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Results display */}
        {animationPhase === "results" && (
          <motion.div
            key="results-display"
            className="w-full min-h-[600px] py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-r ${typeInfo.color} mx-auto flex items-center justify-center`}
                  >
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {typeInfo.title} Results
                </motion.h2>

                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </motion.div>

              {/* Main score display */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 shadow-lg relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5 bg-gradient-to-r from-purple-500 to-indigo-500"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-5 bg-gradient-to-r from-indigo-500 to-purple-500"
                    animate={{
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1,
                    }}
                  />
                </div>

                <div className="relative z-10">
                  {/* IQ Score Display */}
                  <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                    <div className="mb-6 md:mb-0">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          {typeInfo.icon}
                          <span className="ml-2">Your IQ Score</span>
                        </h3>

                        <motion.div
                          className="flex items-end"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          <motion.span
                            className="text-5xl font-bold text-gray-900 dark:text-white"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              delay: 0.8,
                              duration: 0.5,
                              type: "spring",
                            }}
                          >
                            {iqScore}
                          </motion.span>
                          <span className="text-xl text-gray-500 dark:text-gray-400 ml-2 mb-1">
                            points
                          </span>
                        </motion.div>
                      </motion.div>

                      <motion.p
                        className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                      >
                        Classification:{" "}
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {getIQClassification(iqScore)}
                        </span>
                      </motion.p>
                    </div>

                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <div className="relative">
                        <motion.div
                          className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-r ${typeInfo.color} text-white shadow-lg`}
                          initial={{
                            boxShadow: "0 0 0 0 rgba(79, 70, 229, 0.2)",
                          }}
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(79, 70, 229, 0.2)",
                              "0 0 0 10px rgba(79, 70, 229, 0.2)",
                              "0 0 0 0 rgba(79, 70, 229, 0.2)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop",
                            delay: 1,
                          }}
                        >
                          <motion.div
                            className="text-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.9,
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <span className="block text-3xl font-bold">
                              {percentile}%
                            </span>
                            <span className="text-xs opacity-90">
                              Percentile
                            </span>
                          </motion.div>
                        </motion.div>

                        <motion.div
                          className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md"
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.1, duration: 0.5 }}
                        >
                          <TrendingUp className="w-6 h-6 text-green-500" />
                        </motion.div>
                      </div>

                      <motion.p
                        className="mt-4 font-medium text-gray-800 dark:text-gray-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        {getPerformanceLabel()} Performance
                      </motion.p>
                    </motion.div>
                  </div>

                  {/* Additional stats */}
                  <motion.div
                    className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    {/* Better than */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                        <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Better than
                      </p>
                      <div className="flex items-center mt-1">
                        <motion.span
                          className="text-2xl font-bold text-gray-900 dark:text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3, duration: 0.5 }}
                        >
                          {percentile}%
                        </motion.span>
                        <ChevronUp className="ml-1 w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        of test takers
                      </p>
                    </div>

                    {/* Leaderboard position */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
                        <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Leaderboard Rank
                      </p>
                      <motion.div
                        className="flex items-center mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                      >
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          #{ranking}
                        </span>
                      </motion.div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        global position
                      </p>
                    </div>

                    {/* Test score */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                        <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Test Score
                      </p>
                      <motion.div
                        className="flex items-center mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                      >
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {calculatedScore}%
                        </span>
                      </motion.div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        accuracy rate
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <motion.button
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  whileHover={{
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ y: 0 }}
                  onClick={() => (window.location.href = "/tests")}
                >
                  Back to Tests
                </motion.button>

                <motion.button
                  className={`px-6 py-3 rounded-lg bg-gradient-to-r ${typeInfo.color} text-white font-medium shadow-md cursor-pointer`}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
                  }}
                  whileTap={{ y: 0 }}
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestCompletionWrapper;
