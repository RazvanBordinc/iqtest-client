"use client";

import React, { memo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, SkipForward } from "lucide-react";

/**
 * A reusable navigation control component for test interfaces
 *
 * @param {Object} props
 * @param {Function} props.onPrevious - Handler for previous button click
 * @param {Function} props.onNext - Handler for next button click
 * @param {boolean} props.isPreviousDisabled - Whether the previous button is disabled
 * @param {boolean} props.isNextDisabled - Whether the next button is disabled (now only true if explicitly set)
 * @param {boolean} props.isLastQuestion - Whether this is the last question
 * @param {string} props.previousText - Text for previous button
 * @param {string} props.nextText - Text for next button
 * @param {string} props.finishText - Text for finish button (last question)
 * @param {string} props.testType - The type of test ("numerical", "verbal", "memory", "mixed")
 * @param {Function} props.onAnimationComplete - Called when test completion animation is done
 * @param {boolean} props.hasAnswer - Whether the current question has been answered
 * @param {boolean} props.enableKeyboard - Whether to enable keyboard navigation (default true)
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
  hasAnswer = false,
  enableKeyboard = true,
}) {
  // Add keyboard event handler
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (event) => {
      // Enter key to proceed
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleNextClick();
      }
      // Arrow keys for navigation
      else if (event.key === "ArrowRight" && !isNextDisabled) {
        event.preventDefault();
        handleNextClick();
      }
      else if (event.key === "ArrowLeft" && !isPreviousDisabled) {
        event.preventDefault();
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enableKeyboard,
    isPreviousDisabled,
    isNextDisabled,
    isLastQuestion,
    onPrevious,
    onNext,
    onAnimationComplete,
    handleNextClick,
  ]);

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
    
    // Different styling when answer is selected vs skipping
    if (hasAnswer) {
      return `px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gradient-to-r ${gradient} text-white transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden`;
    } else {
      // Skip button style when no answer selected
      return `px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden`;
    }
  };

  // Determine which text to use for the next button
  const getNextButtonText = () => {
    if (!hasAnswer && !isLastQuestion) {
      return "Skip";
    }
    if (isLastQuestion) {
      return finishText;
    }
    return nextText;
  };

  // Get icon for next button
  const getNextButtonIcon = () => {
    if (!hasAnswer && !isLastQuestion) {
      return <SkipForward className="w-5 h-5" />;
    }
    if (isLastQuestion) {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <ArrowRight className="w-5 h-5" />;
  };

  // Custom click handler for next/finish button to handle animations
  const handleNextClick = useCallback(() => {
    if (isNextDisabled) return;

    // If it's the last question and animation handler is provided, use animated completion
    if (
      isLastQuestion &&
      onAnimationComplete &&
      typeof onAnimationComplete === "function"
    ) {
      // Animation will be handled by the parent component that receives the event
      onNext({ isCompletion: true, isSkip: !hasAnswer });
    } else {
      // Normal navigation, including skip
      onNext({ isCompletion: false, isSkip: !hasAnswer });
    }
  }, [isNextDisabled, isLastQuestion, onAnimationComplete, onNext, hasAnswer]);

  return (
    <div className="flex flex-col gap-4 mt-8 w-full">
      {/* Keyboard hint */}
      {enableKeyboard && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Enter</kbd> to {hasAnswer ? "continue" : "skip"}
        </motion.div>
      )}

      <div className="flex justify-between space-x-4 w-full">
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

        {/* Next/Skip/Finish button */}
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
          {getNextButtonIcon()}

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

      {/* Skip hint when no answer */}
      {!hasAnswer && !isLastQuestion && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 italic"
        >
          Not sure? You can skip this question and come back later
        </motion.p>
      )}
    </div>
  );
});

export default NavigationControls;