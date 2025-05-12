"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";

export default function Timer({ totalSeconds, onTimeFinish }) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Check if we're on a mobile device for responsive sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set up timer and warning states
  useEffect(() => {
    if (seconds <= 0) {
      onTimeFinish();
      return;
    }

    if (isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // Set warning thresholds
    if (seconds < 60 && !isCritical) {
      setIsCritical(true);
    } else if (seconds < totalSeconds * 0.1 && !isWarning) {
      setIsWarning(true);
    }

    return () => clearInterval(timer);
  }, [seconds, onTimeFinish, isWarning, isCritical, isPaused, totalSeconds]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, [seconds]);

  const progress = useCallback(() => {
    return (seconds / totalSeconds) * 100;
  }, [seconds, totalSeconds]);

  // Expose remaining time to parent components
  useEffect(() => {
    if (window) {
      window.testRemainingTime = seconds;
    }
  }, [seconds]);

  // Set dimensions based on device size
  const width = isMobile ? "w-20" : "w-28";
  const height = isMobile ? "h-8" : "h-10";
  const fontSize = isMobile ? "text-sm" : "text-base";
  const iconSize = isMobile ? 16 : 18;

  // Dynamic colors based on time remaining
  const getColors = () => {
    if (isCritical) {
      return {
        text: "text-red-500 dark:text-red-400",
        bg: "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
        glow: "0 0 15px rgba(239, 68, 68, 0.4)",
        ring: "ring-red-400 dark:ring-red-500",
      };
    }
    if (isWarning) {
      return {
        text: "text-yellow-500 dark:text-yellow-400",
        bg: "from-yellow-500 to-amber-600 dark:from-yellow-600 dark:to-amber-700",
        glow: "0 0 15px rgba(245, 158, 11, 0.3)",
        ring: "ring-yellow-400 dark:ring-yellow-500",
      };
    }
    return {
      text: "text-purple-500 dark:text-purple-400",
      bg: "from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700",
      glow: "0 0 15px rgba(139, 92, 246, 0.3)",
      ring: "ring-purple-400 dark:ring-purple-500",
    };
  };

  const colors = getColors();

  // Animation variants
  const pulseVariants = {
    normal: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={`relative ${width} ${height} rounded-full overflow-hidden
                    bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm
                    shadow-lg border border-gray-200/30 dark:border-gray-700/30
                    flex items-center justify-center
                    ${isCritical || isWarning ? "ring-2" : ""}
                    ${colors.ring}`}
        variants={pulseVariants}
        initial="normal"
        animate={isCritical ? "pulse" : "normal"}
        whileHover={{ scale: 1.03 }}
        style={{
          boxShadow: colors.glow,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        {/* Progress background with gradient */}
        <motion.div
          className={`absolute left-0 top-0 bottom-0 h-full bg-gradient-to-r ${colors.bg}`}
          style={{ width: `${progress()}%` }}
          initial={{ width: "100%" }}
          animate={{ width: `${progress()}%` }}
          transition={{ duration: 0.5 }}
        >
          {/* Glass overlay effect */}
          <div className="absolute inset-0 bg-white/20 dark:bg-black/10"></div>
        </motion.div>

        {/* Subtle shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />

        {/* Icon and timer display */}
        <div className="relative z-10 flex items-center justify-center space-x-1.5">
          <AnimatePresence mode="wait">
            {isCritical ? (
              <motion.div
                key="critical-icon"
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 10, scale: 0 }}
                transition={{ duration: 0.3 }}
                className={colors.text}
              >
                <AlertTriangle size={iconSize} strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="clock-icon"
                initial={{ rotate: 10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -10, scale: 0 }}
                transition={{ duration: 0.3 }}
                className={colors.text}
              >
                <Clock
                  className="stroke-white rounded-full"
                  size={iconSize}
                  strokeWidth={2}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.span
            className={`font-semibold ${fontSize} text-white`}
            layout
            key={seconds}
            initial={{ opacity: 0.8, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime()}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
