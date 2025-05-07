"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";

export default function Timer({ totalSeconds, onTimeFinish }) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isPulse, setIsPulse] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device and set state accordingly
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

  // Define sizes based on device
  const containerSize = isMobile ? "size-[76px]" : "size-[130px]";
  const timerSize = isMobile ? "w-[70px] h-[70px]" : "w-[120px] h-[120px]";
  const timeTextSize = isMobile ? "text-xl" : "text-2xl";
  const iconSize = isMobile ? "w-3 h-3" : "w-4 h-4";
  const circleRadius = isMobile ? 26 : 45;
  const centerPoint = isMobile ? 35 : 60;

  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (progress() / 100) * circleCircumference;

  return (
    <motion.div
      className="flex items-center justify-center relative"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        className={`relative ${containerSize} flex items-center justify-center`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop shadow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-500/10 dark:from-purple-600/20 dark:via-indigo-600/10 dark:to-purple-600/20 backdrop-blur-sm"
          animate={{
            boxShadow: isPulse
              ? [
                  "0 0 5px rgba(138,43,226,0.4)",
                  "0 0 10px rgba(138,43,226,0.7)",
                  "0 0 5px rgba(138,43,226,0.4)",
                ]
              : "0 0 8px rgba(138,43,226,0.3)",
          }}
          transition={{ duration: 1 }}
        />

        {/* Main timer body */}
        <div className={`relative ${timerSize}`}>
          {/* SVG timer circles */}
          <svg
            width={isMobile ? "70" : "120"}
            height={isMobile ? "70" : "120"}
            viewBox={`0 0 ${isMobile ? "70" : "120"} ${
              isMobile ? "70" : "120"
            }`}
            className="absolute inset-0"
          >
            {/* Subtle ambient glow */}
            <motion.circle
              cx={centerPoint}
              cy={centerPoint}
              r={isMobile ? 34 : 58}
              className="fill-none stroke-purple-200/10 dark:stroke-purple-400/10"
              strokeWidth="1"
              animate={{
                scale: [0.98, 1.02, 0.98],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />

            {/* Only show decorative dots on larger screens */}
            {!isMobile &&
              [...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x = centerPoint + 52 * Math.sin(angle);
                const y = centerPoint - 52 * Math.cos(angle);
                const size = i % 3 === 0 ? 2.5 : 1.5;

                return (
                  <motion.circle
                    key={`dot-${i}`}
                    cx={x}
                    cy={y}
                    r={size}
                    className={
                      i % 3 === 0
                        ? "fill-purple-500 dark:fill-purple-400"
                        : "fill-slate-400 dark:fill-slate-600"
                    }
                    animate={
                      i % 3 === 0
                        ? {
                            opacity: [0.7, 1, 0.7],
                            scale: [1, 1.2, 1],
                          }
                        : {}
                    }
                    transition={
                      i % 3 === 0
                        ? {
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatType: "mirror",
                          }
                        : {}
                    }
                  />
                );
              })}

            {/* Track background circle */}
            <circle
              cx={centerPoint}
              cy={centerPoint}
              r={circleRadius}
              className="fill-none stroke-gray-200 dark:stroke-gray-800"
              strokeWidth={isMobile ? "6" : "10"}
            />

            {/* Progress track with gradient */}
            <motion.circle
              cx={centerPoint}
              cy={centerPoint}
              r={circleRadius}
              fill="none"
              className="stroke-current"
              style={{ stroke: timeColor() }}
              strokeWidth={isMobile ? "6" : "10"}
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${centerPoint} ${centerPoint})`}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />

            {/* Light glow effect */}
            <motion.circle
              cx={centerPoint}
              cy={centerPoint}
              r={circleRadius + 5}
              fill="none"
              className="stroke-current"
              style={{ stroke: timeColor() }}
              strokeWidth="1"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.95, 1, 0.95],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />

            {/* Show fewer minute markers on mobile */}
            {[...Array(isMobile ? 4 : 12)].map((_, i) => {
              const multiplier = isMobile ? 3 : 1;
              const angle = (i * 30 * multiplier * Math.PI) / 180;
              const outerX = centerPoint + circleRadius * Math.sin(angle);
              const outerY = centerPoint - circleRadius * Math.cos(angle);
              const innerX = centerPoint + (circleRadius - 3) * Math.sin(angle);
              const innerY = centerPoint - (circleRadius - 3) * Math.cos(angle);

              return (
                <line
                  key={`marker-${i}`}
                  x1={innerX}
                  y1={innerY}
                  x2={outerX}
                  y2={outerY}
                  className="stroke-gray-400 dark:stroke-gray-600"
                  strokeWidth={i % 3 === 0 ? 2 : 1}
                />
              );
            })}

            {/* Warning pulse when time is low */}
            <AnimatePresence>
              {isWarning && (
                <motion.circle
                  cx={centerPoint}
                  cy={centerPoint}
                  r={circleRadius + 10}
                  fill="none"
                  stroke="#ff4d4f"
                  strokeWidth="2"
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 0, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              )}
            </AnimatePresence>
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className={`font-bold ${timeTextSize}`}
              style={{ color: timeColor() }}
              animate={
                isPulse
                  ? { scale: [1, 1.15, 1] }
                  : isWarning
                  ? { scale: [1, 1.1, 1] }
                  : {}
              }
              transition={{
                duration: isPulse ? 0.5 : 1,
                repeat: isWarning && !isPulse ? Infinity : 0,
                repeatType: "mirror",
              }}
            >
              {formatTime()}
            </motion.div>

            <AnimatePresence mode="wait">
              {isWarning ? (
                <motion.div
                  key="warning"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1"
                >
                  <AlertTriangle
                    className={`${iconSize} text-red-500`}
                    strokeWidth={3}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="clock"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1"
                >
                  <Clock
                    className={`${iconSize} text-purple-500 dark:text-purple-400`}
                    strokeWidth={2.5}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
