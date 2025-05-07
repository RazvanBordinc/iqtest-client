"use client";

import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

// Using memo to prevent unnecessary re-renders
const GenderOption = memo(function GenderOption({ type, selected, onSelect }) {
  const isSelected = selected === type;
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

  // Conditional rendering based on device type
  if (isMobile) {
    // Mobile version - no animations
    return (
      <div className="relative">
        <div
          onClick={() => onSelect(type)}
          className="cursor-pointer"
          style={{ touchAction: "manipulation" }}
        >
          <div
            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${gradientClass} ${
              isSelected ? `ring-4 ${ringClass}` : ""
            } transition-colors duration-300`}
          >
            <Heart
              fill={isSelected ? "white" : "none"}
              className="text-white w-12 h-12 sm:w-16 sm:h-16"
            />

            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1">
                <Sparkles size={24} className={sparkleClass} />
              </div>
            )}
          </div>
          <p className={`mt-2 text-center font-semibold ${textClass}`}>
            {type === "male" ? "Male" : "Female"}
          </p>
        </div>
      </div>
    );
  }

  // Desktop version - with animations
  return (
    <div className="relative">
      <motion.div
        onClick={() => onSelect(type)}
        className="cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${gradientClass} ${
            isSelected ? `ring-4 ${ringClass}` : ""
          } transition-all duration-300`}
        >
          <Heart
            fill={isSelected ? "white" : "none"}
            className="text-white w-12 h-12 sm:w-16 sm:h-16"
          />

          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
              className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1"
            >
              <Sparkles size={24} className={sparkleClass} />
            </motion.div>
          )}
        </div>
        <p className={`mt-2 text-center font-semibold ${textClass}`}>
          {type === "male" ? "Male" : "Female"}
        </p>
      </motion.div>
    </div>
  );
});

export default GenderOption;
