"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Using memo to prevent unnecessary re-renders
const NavigationButton = memo(function NavigationButton({
  direction,
  onClick,
  disabled,
  text,
  isDark,
}) {
  const Icon = direction === "next" ? ArrowRight : ArrowLeft;

  // Define button styles based on theme, direction and disabled state
  const getButtonClass = () => {
    if (disabled) {
      return isDark
        ? "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-800 text-gray-500 cursor-not-allowed"
        : "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 text-gray-400 cursor-not-allowed";
    }

    if (direction === "next") {
      return isDark
        ? "px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gradient-to-r from-purple-700 to-indigo-700 text-white"
        : "px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white";
    }

    return isDark
      ? "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-800 text-white"
      : "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 text-gray-700";
  };

  return (
    <motion.button
      className={getButtonClass()}
      onClick={disabled ? undefined : onClick}
      initial={{ scale: 1 }}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "tween", duration: 0.15 }}
      disabled={disabled}
    >
      {direction === "prev" && <Icon className="w-5 h-5" />}
      <span>{text}</span>
      {direction === "next" && <Icon className="w-5 h-5" />}

      {direction === "next" && !disabled && (
        <div className="absolute inset-0 rounded-lg opacity-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
          />
        </div>
      )}
    </motion.button>
  );
});

export default NavigationButton;
