"use client";

import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Using memo to prevent unnecessary re-renders
const OptionButton = memo(function OptionButton({
  option,
  index,
  isSelected,
  onSelect,
}) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Define dynamic styles based on theme and selection state
  const baseClasses = isSelected
    ? "border-purple-500 bg-gradient-to-b from-purple-200 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/10 ring-1 ring-purple-500"
    : "border-gray-300 hover:border-purple-500/50 bg-white/80 dark:border-gray-700 dark:bg-gray-900/60";

  const circleClasses = isSelected
    ? "bg-purple-500 border-purple-300"
    : "border-gray-400 dark:border-gray-600";

  const textClasses = "text-gray-800 dark:text-gray-100";

  // Conditional rendering based on device type
  if (isMobile) {
    // Mobile version - no animations
    return (
      <div
        className={`p-5 border rounded-lg cursor-pointer ${baseClasses}`}
        onClick={() => onSelect(index)}
        style={{ touchAction: "manipulation" }}
      >
        <div className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border ${circleClasses}`}
          >
            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
          <span
            className={`${textClasses} text-lg ${
              isSelected ? "font-medium" : ""
            }`}
          >
            {option}
          </span>
        </div>
      </div>
    );
  }

  // Desktop version - with animations
  return (
    <motion.div
      className={`p-5 border rounded-lg cursor-pointer transition-all ${baseClasses}`}
      onClick={() => onSelect(index)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
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
          className="absolute inset-0 rounded-lg ring-1 ring-purple-500 overflow-hidden z-[-1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
});

export default OptionButton;
