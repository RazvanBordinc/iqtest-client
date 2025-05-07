"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Brain, Eye, Lightbulb, BookOpen, Sparkles } from "lucide-react";

/**
 * A reusable progress bar component for different test types
 *
 * @param {Object} props
 * @param {number} props.current - Current question or set number (0-indexed)
 * @param {number} props.total - Total number of questions or sets
 * @param {string} props.type - Test type: "numerical", "verbal", "memory", "mixed"
 * @param {string} props.phase - For memory tests: "memorization" or "recall"
 * @param {boolean} props.animationDisabled - Whether to disable animations
 */
const TestProgressBar = memo(function TestProgressBar({
  current = 0,
  total = 1,
  type = "numerical",
  phase = null,
  animationDisabled = false,
}) {
  // Ensure current and total are valid numbers to prevent NaN
  const currentNum =
    typeof current === "number" && !isNaN(current) ? current : 0;
  const totalNum =
    typeof total === "number" && !isNaN(total) && total > 0 ? total : 1;

  // Calculate progress percentage based on test type
  const calculateProgress = () => {
    if (type === "memory" && phase) {
      // For memory tests, we consider each set to have two phases
      const totalSteps = totalNum * 2;
      const currentStep = currentNum * 2 + (phase === "recall" ? 1 : 0);
      return (currentStep / totalSteps) * 100;
    }

    // For other test types, simple linear progress
    return (currentNum / totalNum) * 100;
  };

  const progressPercentage = calculateProgress();

  // Get icon and label based on test type
  const getTypeInfo = () => {
    switch (type) {
      case "numerical":
        return {
          icon: <Lightbulb className="w-4 h-4 mr-1.5 text-blue-500" />,
          label: "Numerical Reasoning",
          color:
            "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
          bgClass:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        };
      case "verbal":
        return {
          icon: <BookOpen className="w-4 h-4 mr-1.5 text-green-500" />,
          label: "Verbal Intelligence",
          color:
            "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
          bgClass:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        };
      case "memory":
        return {
          icon: <Brain className="w-4 h-4 mr-1.5 text-amber-500" />,
          label: "Memory & Recall",
          color:
            "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
          bgClass:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        };
      case "mixed":
        return {
          icon: <Sparkles className="w-4 h-4 mr-1.5 text-purple-500" />,
          label: "Comprehensive IQ",
          color:
            "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
          bgClass:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        };
      default:
        return {
          icon: <Lightbulb className="w-4 h-4 mr-1.5 text-blue-500" />,
          label: "Test Progress",
          color:
            "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
          bgClass:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        };
    }
  };

  const typeInfo = getTypeInfo();
  const gradient = typeInfo.color;

  return (
    <div className="w-full mb-6">
      {/* Top bar with info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {/* Primary indicator (question number or set) */}
          <div className="flex items-center">
            {typeInfo.icon}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {type === "memory"
                ? `Set ${currentNum + 1} of ${totalNum}`
                : `Question ${currentNum + 1} of ${totalNum}`}
            </span>
          </div>

          {/* For memory tests - show phase badge */}
          {type === "memory" && phase && (
            <span
              className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                phase === "memorization"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              }`}
            >
              {phase === "memorization" ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Memorize
                </>
              ) : (
                <>
                  <Brain className="w-3 h-3 mr-1" />
                  Recall
                </>
              )}
            </span>
          )}

          {/* For other test types - show type badge */}
          {type !== "memory" && (
            <span
              className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgClass}`}
            >
              {typeInfo.label}
            </span>
          )}
        </div>

        {/* Percentage indicator */}
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      {/* Progress bar container */}
      <motion.div
        className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative"
        initial={animationDisabled ? {} : { opacity: 0, y: 10 }}
        animate={animationDisabled ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Progress fill */}
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          style={{ width: `${progressPercentage}%` }}
          initial={
            animationDisabled
              ? { width: `${progressPercentage}%` }
              : { width: 0 }
          }
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Subtle shimmer effect */}
        <motion.div
          className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 w-20"
          initial={{ left: "-20%" }}
          animate={{ left: "120%" }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
        />

        {/* For memory tests, add phase markers */}
        {type === "memory" && (
          <>
            {Array.from({ length: totalNum }).map((_, index) => (
              <React.Fragment key={index}>
                {/* Memorization phase marker */}
                <motion.div
                  className={`absolute top-0 bottom-0 w-1 ${
                    currentNum > index ||
                    (currentNum === index && phase === "recall")
                      ? "bg-white/40 dark:bg-gray-400/20"
                      : "bg-gray-400/20 dark:bg-gray-600/20"
                  }`}
                  style={{
                    left: `${((index * 2) / (totalNum * 2)) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />

                {/* Recall phase marker */}
                <motion.div
                  className={`absolute top-0 bottom-0 w-1 ${
                    currentNum > index
                      ? "bg-white/40 dark:bg-gray-400/20"
                      : "bg-gray-400/20 dark:bg-gray-600/20"
                  }`}
                  style={{
                    left: `${((index * 2 + 1) / (totalNum * 2)) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </React.Fragment>
            ))}

            {/* Mini phase indicators for memory tests */}
            <div className="flex justify-between mt-1 absolute w-full top-full">
              {Array.from({ length: totalNum }).map((_, index) => (
                <div key={index} className="flex items-center text-xs -mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentNum > index ||
                      (currentNum === index && phase === "memorization")
                        ? "bg-blue-500 dark:bg-blue-400"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full ml-0.5 ${
                      currentNum > index ||
                      (currentNum === index && phase === "recall")
                        ? "bg-purple-500 dark:bg-purple-400"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* For other test types, add question markers */}
        {type !== "memory" && (
          <div className="absolute top-full left-0 right-0 flex justify-between -mt-1 px-1">
            {Array.from({ length: Math.min(totalNum, 10) }).map((_, index) => {
              // Only show markers at certain intervals for tests with many questions
              const position =
                totalNum <= 10 ? index : Math.floor(index * (totalNum / 10));
              const isCompleted = currentNum > position;

              return (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCompleted
                      ? `bg-gradient-to-r ${gradient}`
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  style={{
                    left: `${(position / totalNum) * 100}%`,
                  }}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
});

export default TestProgressBar;
