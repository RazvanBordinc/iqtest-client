"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

// Using memo to prevent unnecessary re-renders
const OptionButton = memo(function OptionButton({
  option,
  index,
  isSelected,
  onSelect,
  isDark,
}) {
  // Define dynamic styles based on theme and selection state
  const baseClasses = isDark
    ? isSelected
      ? "border-purple-500 bg-gradient-to-b from-purple-900/30 to-purple-800/10 ring-1 ring-purple-500"
      : "border-gray-700 hover:border-purple-500/50 bg-gray-900/60"
    : isSelected
    ? "border-purple-500 bg-gradient-to-b from-purple-200 to-purple-50 ring-1 ring-purple-500"
    : "border-gray-300 hover:border-purple-500/50 bg-white/80";

  const circleClasses = isDark
    ? isSelected
      ? "bg-purple-500 border-purple-300"
      : "border-gray-600"
    : isSelected
    ? "bg-purple-500 border-purple-300"
    : "border-gray-400";

  const textClasses = isDark ? "text-gray-100" : "text-gray-800";

  return (
    <motion.div
      layout
      whileHover={{
        scale: 1.02,
        boxShadow: isDark
          ? "0 0 15px rgba(138, 43, 226, 0.3)"
          : "0 0 15px rgba(138, 43, 226, 0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`p-5 border rounded-lg cursor-pointer transition-all ${baseClasses}`}
      onClick={() => onSelect(index)}
    >
      <div className="flex items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border ${circleClasses}`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-2 h-2 bg-white rounded-full"
            />
          )}
        </div>
        <span
          className={`${textClasses} text-lg ${
            isSelected ? "font-medium" : ""
          }`}
        >
          {option}
        </span>
      </div>

      {/* Selected state highlight */}
      {isSelected && (
        <motion.div
          className={`absolute inset-0 rounded-lg ring-1 ring-purple-500 overflow-hidden z-[-1]`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
});

export default OptionButton;
