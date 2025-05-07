"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

/**
 * A reusable navigation control component for test interfaces
 *
 * @param {Object} props
 * @param {Function} props.onPrevious - Handler for previous button click
 * @param {Function} props.onNext - Handler for next button click
 * @param {boolean} props.isPreviousDisabled - Whether the previous button is disabled
 * @param {boolean} props.isNextDisabled - Whether the next button is disabled
 * @param {boolean} props.isLastQuestion - Whether this is the last question
 * @param {string} props.previousText - Text for previous button
 * @param {string} props.nextText - Text for next button
 * @param {string} props.finishText - Text for finish button (last question)
 * @param {string} props.testType - The type of test ("numerical", "verbal", "memory", "mixed")
 * @param {Function} props.onAnimationComplete - Called when test completion animation is done
 */
const NavigationControls = memo(function NavigationControls({
  onPrevious,
  onNext,
  isPreviousDisabled = false,
  isNextDisabled = false,
  isLastQuestion = false,
  previousText = "Previous",
  nextText = "Next",
  finishText = "Finish",
  testType = "numerical",
  onAnimationComplete = null,
}) {
  // Get gradient colors based on test type
  const getGradient = () => {
    switch (testType) {
      case "numerical":
        return "from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700";
      case "verbal":
        return "from-emerald-600 to-green-600 dark:from-emerald-700 dark:to-green-700";
      case "memory":
        return "from-amber-600 to-yellow-600 dark:from-amber-700 dark:to-yellow-700";
      case "mixed":
        return "from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700";
      default:
        return "from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700";
    }
  };

  const gradient = getGradient();

  // Define button styles based on theme, direction and disabled state
  const getPrevButtonClass = () => {
    if (isPreviousDisabled) {
      return "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed transition-all duration-200";
    }
    return "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer";
  };

  const getNextButtonClass = () => {
    if (isNextDisabled) {
      return `px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gray-300 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed transition-all duration-200`;
    }
    return `px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gradient-to-r ${gradient} text-white transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden`;
  };

  // Determine which text to use for the next button
  const getNextButtonText = () => {
    if (isLastQuestion) {
      return finishText;
    }
    return nextText;
  };

  // Custom click handler for next/finish button to handle animations
  const handleNextClick = () => {
    if (isNextDisabled) return;

    // If it's the last question and animation handler is provided, use animated completion
    if (
      isLastQuestion &&
      onAnimationComplete &&
      typeof onAnimationComplete === "function"
    ) {
      // Animation will be handled by the parent component that receives the event
      onNext({ isCompletion: true });
    } else {
      // Normal navigation
      onNext({ isCompletion: false });
    }
  };

  return (
    <div className="flex justify-between mt-8 space-x-4 w-full">
      {/* Previous button */}
      <motion.button
        className={getPrevButtonClass()}
        onClick={isPreviousDisabled ? undefined : onPrevious}
        disabled={isPreviousDisabled}
        whileHover={isPreviousDisabled ? {} : { scale: 1.02 }}
        whileTap={isPreviousDisabled ? {} : { scale: 0.98 }}
        style={{
          transform: "translateZ(0)", // Force hardware acceleration
          willChange: "transform", // Hint to browser
          touchAction: "manipulation", // Optimize for touch
        }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{previousText}</span>
      </motion.button>

      {/* Next/Finish button */}
      <motion.button
        className={getNextButtonClass()}
        onClick={isNextDisabled ? undefined : handleNextClick}
        disabled={isNextDisabled}
        whileHover={isNextDisabled ? {} : { scale: 1.02 }}
        whileTap={isNextDisabled ? {} : { scale: 0.98 }}
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
          touchAction: "manipulation",
        }}
      >
        <span>{getNextButtonText()}</span>
        {isLastQuestion ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <ArrowRight className="w-5 h-5" />
        )}

        {/* Shimmer effect for enabled next button */}
        {!isNextDisabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          />
        )}
      </motion.button>
    </div>
  );
});

export default NavigationControls;
