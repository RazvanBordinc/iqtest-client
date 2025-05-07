"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

// Using memo to prevent unnecessary re-renders
const ProgressBar = memo(function ProgressBar({
  currentQuestion,
  totalQuestions,
  isDark,
}) {
  const progress = (currentQuestion / totalQuestions) * 100;

  const backgroundClass = isDark ? "bg-gray-800" : "bg-gray-200";

  return (
    <motion.div
      className={`w-full h-3 ${backgroundClass} rounded-full mb-6 overflow-hidden relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />

      {/* Single shimmer effect that doesn't rerun on every state change */}
      <motion.div
        className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 w-20"
        initial={{ left: "-20%" }}
        animate={{ left: "120%" }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />
    </motion.div>
  );
});

export default ProgressBar;
