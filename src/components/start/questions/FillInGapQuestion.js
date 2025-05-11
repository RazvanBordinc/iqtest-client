"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// Component for fill-in-the-gap questions
const FillInGapQuestion = memo(function FillInGapQuestion({
  question,
  answerPlaceholder = "Type your answer",
  currentAnswer = "",
  onAnswerChange,
  questionNumber,
  animateKey,
  imageSrc,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`fill-gap-${animateKey || questionNumber}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-6 leading-relaxed">
            {question}
          </h3>

          {imageSrc && (
            <motion.div
              className="flex justify-center mb-8 bg-gray-100/50 dark:bg-gray-800/50 p-6 rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={imageSrc}
                alt="Question visualization"
                className="max-w-full h-auto max-h-60"
              />
            </motion.div>
          )}

          <div className="relative">
            <motion.div
              className={`relative border ${
                isFocused
                  ? "border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900"
                  : "border-gray-300 dark:border-gray-700"
              } rounded-lg p-4 bg-white dark:bg-gray-800 transition-all duration-200`}
              animate={{
                y: isFocused ? -2 : 0,
                boxShadow: isFocused
                  ? "0 4px 20px rgba(124, 58, 237, 0.2)"
                  : "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                value={currentAnswer}
                onChange={onAnswerChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={answerPlaceholder}
                className="w-full bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />

              {/* Subtle animation for focus state */}
              {isFocused && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                  layoutId="focus-indicator"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>

            {/* Help text */}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 pl-1">
              Fill in the missing value
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default FillInGapQuestion;
