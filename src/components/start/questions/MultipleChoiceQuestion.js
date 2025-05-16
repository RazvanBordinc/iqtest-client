"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Circle, 
  Square, 
  Triangle, 
  Diamond, 
  Star, 
  Hexagon,
  Pentagon,
  Octagon,
  Check,
  X,
  Sparkles,
  Lightbulb
} from "lucide-react";

// Enhanced option button component with modern design
const OptionCard = ({ option, index, isSelected, onSelect, totalOptions }) => {
  // Different icons for variety
  const getOptionIcon = () => {
    const icons = [Circle, Square, Triangle, Diamond, Star, Hexagon, Pentagon, Octagon];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5" strokeWidth={2} />;
  };

  // Get option label (A, B, C, D, etc.)
  const getOptionLabel = () => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  // Modern color schemes for each option
  const getOptionColors = () => {
    const colors = [
      { border: "border-blue-200 hover:border-blue-400", bg: "bg-blue-50", text: "text-blue-600", selectedBg: "bg-blue-500" },
      { border: "border-green-200 hover:border-green-400", bg: "bg-green-50", text: "text-green-600", selectedBg: "bg-green-500" },
      { border: "border-yellow-200 hover:border-yellow-400", bg: "bg-yellow-50", text: "text-yellow-600", selectedBg: "bg-yellow-500" },
      { border: "border-red-200 hover:border-red-400", bg: "bg-red-50", text: "text-red-600", selectedBg: "bg-red-500" },
      { border: "border-purple-200 hover:border-purple-400", bg: "bg-purple-50", text: "text-purple-600", selectedBg: "bg-purple-500" },
      { border: "border-pink-200 hover:border-pink-400", bg: "bg-pink-50", text: "text-pink-600", selectedBg: "bg-pink-500" },
      { border: "border-indigo-200 hover:border-indigo-400", bg: "bg-indigo-50", text: "text-indigo-600", selectedBg: "bg-indigo-500" },
      { border: "border-teal-200 hover:border-teal-400", bg: "bg-teal-50", text: "text-teal-600", selectedBg: "bg-teal-500" }
    ];
    return colors[index % colors.length];
  };

  const colorScheme = getOptionColors();

  const variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.06,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.01,
      transition: { duration: 0.15 },
    },
    tap: { scale: 0.99 },
  };

  return (
    <motion.button
      type="button"
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onClick={() => onSelect(index)}
      className={`
        relative overflow-hidden rounded-xl p-4 text-left
        transition-all duration-200 ease-out
        border-2 shadow-sm hover:shadow-md
        ${
          isSelected
            ? `border-gray-900 dark:border-white bg-gray-900 dark:bg-white`
            : `${colorScheme.border} bg-white dark:bg-gray-800`
        }
        transform group cursor-pointer
      `}
    >
      {/* Option label with modern design */}
      <div className="flex items-start gap-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
          transition-all duration-200 flex-shrink-0
          ${
            isSelected
              ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              : `${colorScheme.bg} ${colorScheme.text} group-hover:scale-110`
          }
        `}>
          {getOptionLabel()}
        </div>

        {/* Option text */}
        <div className="flex-1 pr-8">
          <span
            className={`
              text-base leading-relaxed block
              transition-colors duration-200
              ${
                isSelected
                  ? "text-white dark:text-gray-900 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {option}
          </span>
        </div>
      </div>

      {/* Selection indicator or decorative icon */}
      <div className={`
        absolute top-4 right-4 
        transition-all duration-200
        ${
          isSelected
            ? "text-white dark:text-gray-900"
            : `${colorScheme.text} opacity-30 group-hover:opacity-50`
        }
      `}>
        {isSelected ? (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <Check className="w-5 h-5" strokeWidth={3} />
          </motion.div>
        ) : (
          getOptionIcon()
        )}
      </div>

      {/* Animated background effect on hover */}
      <motion.div
        className={`absolute inset-0 ${colorScheme.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
      />
    </motion.button>
  );
};

// Minimalist question component
const MultipleChoiceQuestion = memo(function MultipleChoiceQuestion({
  question,
  options = [],
  selectedOption,
  onSelectOption,
  imageSrc,
  questionNumber,
  animateKey,
  totalQuestions,
}) {
  // Dynamic grid layout
  const getGridClass = () => {
    const optionCount = options.length;
    if (optionCount <= 2) return "grid-cols-1 gap-3";
    if (optionCount <= 4) return "grid-cols-1 md:grid-cols-2 gap-3";
    if (optionCount <= 6) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`question-${animateKey || questionNumber}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Clean question display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                {question}
              </h3>
              {totalQuestions && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Question {questionNumber + 1} of {totalQuestions}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Image with minimal styling */}
        {imageSrc && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl inline-block">
              <Image
                src={imageSrc}
                alt="Question visualization"
                className="max-w-full h-auto max-h-60 rounded-lg"
                width={400}
                height={300}
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Options grid */}
        <motion.div
          className={`grid ${getGridClass()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {options.map((option, index) => (
            <OptionCard
              key={`option-${index}`}
              option={option}
              index={index}
              isSelected={selectedOption === index}
              onSelect={onSelectOption}
              totalOptions={options.length}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default MultipleChoiceQuestion;