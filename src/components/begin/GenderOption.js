"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

// Using memo to prevent unnecessary re-renders
const GenderOption = memo(function GenderOption({ type, selected, onSelect }) {
  const isSelected = selected === type;

  // Generate dynamic class names based on type and selection state
  const gradientClass =
    type === "male"
      ? isSelected
        ? "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700"
        : "from-blue-200 to-blue-400 dark:from-blue-400 dark:to-blue-600"
      : isSelected
      ? "from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-700"
      : "from-pink-200 to-pink-400 dark:from-pink-400 dark:to-pink-600";

  const ringClass =
    type === "male"
      ? "ring-blue-300 dark:ring-blue-400"
      : "ring-pink-300 dark:ring-pink-400";

  const textClass =
    type === "male"
      ? isSelected
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-300"
      : isSelected
      ? "text-pink-600 dark:text-pink-400"
      : "text-gray-600 dark:text-gray-300";

  const sparkleClass =
    type === "male"
      ? "text-blue-500 dark:text-blue-300"
      : "text-pink-500 dark:text-pink-300";

  return (
    <motion.div
      className="relative cursor-pointer group"
      onClick={() => onSelect(type)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${gradientClass} ${
          isSelected ? `ring-4 ${ringClass}` : ""
        } transition-all duration-300`}
        layout
      >
        <Heart
          fill={isSelected ? "white" : "none"}
          className="text-white w-12 h-12 sm:w-16 sm:h-16"
        />

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1"
          >
            <Sparkles size={24} className={sparkleClass} />
          </motion.div>
        )}
      </motion.div>
      <p className={`mt-2 text-center font-semibold ${textClass}`}>
        {type === "male" ? "Male" : "Female"}
      </p>
    </motion.div>
  );
});

export default GenderOption;
