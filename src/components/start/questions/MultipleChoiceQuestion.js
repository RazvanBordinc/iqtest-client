"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptionButton from "../OptionButton";

// Reusable component for multiple choice questions
const MultipleChoiceQuestion = memo(function MultipleChoiceQuestion({
  question,
  options,
  selectedOption,
  onSelectOption,
  imageSrc,
  questionNumber,
  animateKey,
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`question-${animateKey || questionNumber}`}
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
              <img
                src={imageSrc}
                alt="Question visualization"
                className="max-w-full h-auto max-h-60"
              />
            </motion.div>
          )}

          <div className="space-y-4 relative">
            {options.map((option, index) => (
              <OptionButton
                key={`option-${index}`}
                option={option}
                index={index}
                isSelected={selectedOption === index}
                onSelect={onSelectOption}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default MultipleChoiceQuestion;
