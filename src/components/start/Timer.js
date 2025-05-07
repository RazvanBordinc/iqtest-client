"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";

export default function Timer({ totalSeconds, onTimeFinish }) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isPulse, setIsPulse] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device for responsive sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add pulse effect every minute
  useEffect(() => {
    if (seconds % 60 === 0 && seconds > 0) {
      setIsPulse(true);
      setTimeout(() => setIsPulse(false), 1000);
    }
  }, [seconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeFinish();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds < 180 && !isWarning) {
      setIsWarning(true);
    }

    return () => clearInterval(timer);
  }, [seconds, onTimeFinish, isWarning]);

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

  // Calculate time color based on remaining time percentage
  const timeColor = useCallback(() => {
    const percentage = progress();
    if (percentage <= 25) return "#ff4d4f"; // Red for < 25%
    if (percentage <= 50) return "#faad14"; // Yellow for 25-50%
    return "#8A2BE2"; // Purple for > 50%
  }, [progress]);

  // Set dimensions based on device size
  const width = isMobile ? "w-24" : "w-36";
  const height = isMobile ? "h-9" : "h-10";
  const fontSize = isMobile ? "text-sm" : "text-base";
  const iconSize = isMobile ? "w-3 h-3" : "w-4 h-4";

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      <motion.div
        className={`relative ${width} ${height} rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700`}
        whileHover={{
          scale: 1.03,
          boxShadow: isWarning
            ? "0 0 12px rgba(255, 77, 79, 0.35)"
            : "0 0 12px rgba(138, 43, 226, 0.25)",
        }}
        animate={{
          boxShadow: isPulse
            ? [
                "0 0 0px rgba(138, 43, 226, 0.2)",
                "0 0 12px rgba(138, 43, 226, 0.6)",
                "0 0 0px rgba(138, 43, 226, 0.2)",
              ]
            : isWarning
            ? [
                "0 0 5px rgba(255, 77, 79, 0.2)",
                "0 0 8px rgba(255, 77, 79, 0.4)",
                "0 0 5px rgba(255, 77, 79, 0.2)",
              ]
            : "0 0 5px rgba(138, 43, 226, 0.2)",
        }}
        transition={{
          scale: { duration: 0.2 },
          boxShadow: {
            duration: isWarning ? 1.5 : 1,
            repeat: isWarning || isPulse ? Infinity : 0,
            repeatType: "reverse",
          },
        }}
      >
        {/* Progress background */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 h-full bg-gradient-to-r"
          style={{
            width: `${progress()}%`,
            background: `linear-gradient(to right, ${timeColor()}40, ${timeColor()}80)`,
          }}
          initial={{ width: "100%" }}
          animate={{ width: `${progress()}%` }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 dark:opacity-10"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "easeInOut",
          }}
        />

        {/* Content container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="flex items-center space-x-2 z-10"
            animate={
              isPulse
                ? { scale: [1, 1.08, 1] }
                : isWarning
                ? { scale: [1, 1.03, 1] }
                : {}
            }
            transition={{
              duration: isPulse ? 0.4 : 1,
              ease: "easeInOut",
              repeat: isWarning && !isPulse ? Infinity : 0,
              repeatDelay: 1,
            }}
          >
            <AnimatePresence mode="wait">
              {isWarning ? (
                <motion.div
                  key="warning-icon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertTriangle
                    className={`${iconSize} text-red-500`}
                    strokeWidth={2.5}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="clock-icon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Clock
                    className={`${iconSize} text-purple-500 dark:text-purple-400`}
                    strokeWidth={2}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.span
              className={`font-semibold ${fontSize} text-gray-900 dark:text-white`}
              style={{
                color: isWarning ? "#ff4d4f" : undefined,
              }}
              layout
            >
              {formatTime()}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
