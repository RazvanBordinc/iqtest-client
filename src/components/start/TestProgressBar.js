"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Brain, Eye, Lightbulb, BookOpen, Sparkles } from "lucide-react";

/**
 * A minimalist progress bar component for different test types
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

  // Get icon and styling based on test type
  const getTypeInfo = () => {
    switch (type) {
      case "numerical":
        return {
          icon: <Lightbulb className="w-4 h-4" />,
          label: "Numerical",
          color: "bg-blue-500 dark:bg-blue-600",
          lightColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-600 dark:text-blue-400",
        };
      case "verbal":
        return {
          icon: <BookOpen className="w-4 h-4" />,
          label: "Verbal",
          color: "bg-green-500 dark:bg-green-600",
          lightColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-600 dark:text-green-400",
        };
      case "memory":
        return {
          icon: <Brain className="w-4 h-4" />,
          label: "Memory",
          color: "bg-amber-500 dark:bg-amber-600",
          lightColor: "bg-amber-100 dark:bg-amber-900/30",
          textColor: "text-amber-600 dark:text-amber-400",
        };
      case "mixed":
        return {
          icon: <Sparkles className="w-4 h-4" />,
          label: "Mixed",
          color: "bg-purple-500 dark:bg-purple-600",
          lightColor: "bg-purple-100 dark:bg-purple-900/30",
          textColor: "text-purple-600 dark:text-purple-400",
        };
      default:
        return {
          icon: <Lightbulb className="w-4 h-4" />,
          label: "Test",
          color: "bg-blue-500 dark:bg-blue-600",
          lightColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-600 dark:text-blue-400",
        };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <div className="w-full mb-6">
      {/* Simple header with progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`${typeInfo.textColor}`}>
            {typeInfo.icon}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {type === "memory"
              ? `Set ${currentNum + 1} of ${totalNum}`
              : `Question ${currentNum + 1} of ${totalNum}`}
          </span>
          
          {/* Phase indicator for memory tests */}
          {type === "memory" && phase && (
            <span className={`
              text-xs font-medium px-2 py-0.5 rounded-full
              ${phase === "memorization" 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"}
            `}>
              {phase === "memorization" ? "Memorize" : "Recall"}
            </span>
          )}
        </div>

        {/* Percentage */}
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Minimal progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${typeInfo.color} rounded-full`}
          style={{ width: `${progressPercentage}%` }}
          initial={animationDisabled ? {} : { width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Dots indicator for smaller test counts */}
      {totalNum <= 10 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {Array.from({ length: totalNum }).map((_, index) => (
            <motion.div
              key={index}
              className={`
                rounded-full transition-all duration-300
                ${index <= currentNum 
                  ? `w-2 h-2 ${typeInfo.color}` 
                  : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700"}
              `}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default TestProgressBar;