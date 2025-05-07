"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
import ProgressBar from "./ProgressBar";
import OptionButton from "./OptionButton";
import NavigationButton from "./NavigationButton";

// Using memo for better performance
const TestInProgress = memo(function TestInProgress({
  currentQuestion,
  totalQuestions,
  questionData,
  selectedOption,
  handleOptionSelect,
  handlePrevious,
  handleNext,
  isDark,
}) {
  return (
    <div
      className={`${
        isDark
          ? "bg-gray-900/70 border-gray-800"
          : "bg-white/70 border-gray-200"
      } rounded-xl backdrop-blur-md border shadow-[0_0_15px_rgba(79,70,229,0.15)] p-6 sm:p-8 mb-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-lg font-semibold ${
            isDark ? "text-gray-100" : "text-gray-900"
          } flex items-center`}
        >
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Question {currentQuestion} of {totalQuestions}
        </h2>

        <span
          className={`text-sm ${
            isDark ? "text-gray-300 bg-gray-800" : "text-gray-700 bg-gray-100"
          } font-medium px-4 py-1 rounded-full`}
        >
          {Math.round((currentQuestion / totalQuestions) * 100)}% Complete
        </span>
      </div>

      <ProgressBar
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        isDark={isDark}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${currentQuestion}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="mb-8">
            <h3
              className={`text-xl font-medium ${
                isDark ? "text-white" : "text-gray-800"
              } mb-6 leading-relaxed`}
            >
              {questionData.question}
            </h3>

            {questionData.imageSrc && (
              <motion.div
                className={`flex justify-center mb-8 ${
                  isDark ? "bg-gray-800/50" : "bg-gray-100/50"
                } p-6 rounded-lg`}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={questionData.imageSrc}
                  alt="Question diagram"
                  className="max-w-full h-auto max-h-60"
                />
              </motion.div>
            )}

            <div className="space-y-4 relative">
              {questionData.options.map((option, index) => (
                <OptionButton
                  key={`option-${index}`}
                  option={option}
                  index={index}
                  isSelected={selectedOption === index}
                  onSelect={handleOptionSelect}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <NavigationButton
          key="prev-button"
          direction="prev"
          onClick={handlePrevious}
          disabled={currentQuestion === 1}
          text="Previous"
          isDark={isDark}
        />

        <NavigationButton
          key="next-button"
          direction="next"
          onClick={handleNext}
          disabled={false}
          text={
            currentQuestion === totalQuestions ? "Finish Test" : "Next Question"
          }
          isDark={isDark}
        />
      </div>
    </div>
  );
});

export default TestInProgress;
