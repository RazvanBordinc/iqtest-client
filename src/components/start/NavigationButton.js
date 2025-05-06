// app/start/components/NavigationButton.js
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
}) {
  const Icon = direction === "next" ? ArrowRight : ArrowLeft;

  // Fixed styles to prevent glitching
  const buttonClass = disabled
    ? "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-800 text-gray-500 cursor-not-allowed"
    : direction === "next"
    ? "px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gradient-to-r from-purple-700 to-indigo-700 text-white"
    : "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-800 text-white";

  return (
    <motion.button
      className={buttonClass}
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
