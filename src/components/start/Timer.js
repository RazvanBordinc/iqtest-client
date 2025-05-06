// app/start/components/Timer.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";

export default function Timer({ totalSeconds, onTimeFinish }) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);

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

  const circleCircumference = 2 * Math.PI * 45;
  const strokeDashoffset =
    circleCircumference - (progress() / 100) * circleCircumference;

  return (
    <motion.div
      className="flex items-center justify-center relative"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Main timer body */}
        <div className="relative w-[120px] h-[120px]">
          {/* Background layer */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gray-900 shadow-[0_0_20px_rgba(138,43,226,0.25)]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* SVG timer circles */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="absolute inset-0"
          >
            {/* Decorative dots around the circle - fixed positions */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 60 + 52 * Math.sin(angle);
              const y = 60 - 52 * Math.cos(angle);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={y}
                  r={i % 3 === 0 ? 2 : 1}
                  fill={i % 3 === 0 ? "#8A2BE2" : "#6d6d6d"}
                />
              );
            })}

            {/* Dark background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#2A2A2A"
              strokeWidth="10"
            />

            {/* Colorful progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={timeColor()}
              strokeWidth="10"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />

            {/* Light glow effect */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={timeColor()}
              strokeWidth="1"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.95, 1, 0.95],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Warning pulse when time is low */}
            {isWarning && (
              <motion.circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#ff4d4f"
                strokeWidth="2"
                initial={{ opacity: 0.7, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </svg>

          {/* Ticks around the edges for a clock-like appearance */}
          <div className="absolute inset-0">
            {[...Array(60)].map((_, i) => {
              const angle = (i * 6 * Math.PI) / 180;
              const width = i % 5 === 0 ? 2 : 1;
              const height = i % 5 === 0 ? 6 : 3;
              const distance = 54;
              const x = 60 + distance * Math.sin(angle);
              const y = 60 - distance * Math.cos(angle);
              const rotation = i * 6;

              // Only render every 3rd tick for performance
              if (i % 3 !== 0) return null;

              return (
                <div
                  key={`tick-${i}`}
                  className="absolute bg-gray-600"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    borderRadius: "1px",
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    transformOrigin: "center",
                    opacity: i % 5 === 0 ? 0.8 : 0.4,
                  }}
                />
              );
            })}
          </div>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-2xl font-bold"
              style={{ color: timeColor() }}
              animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isWarning ? Infinity : 0 }}
            >
              {formatTime()}
            </motion.div>

            <div className="flex items-center mt-1">
              {isWarning ? (
                <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
              ) : (
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
              )}
              <span className="text-xs text-gray-400">Remaining</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
