"use client";

import React, { memo, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GenderOption from "./GenderOption";

// Using memo to prevent unnecessary re-renders
const GenderSelector = memo(function GenderSelector({
  gender,
  setGender,
  triggerSparkles,
}) {
  // Add state to track the last time sparkles were triggered
  const lastSparkleTime = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelectGender = useCallback(
    (selected) => {
      if (gender !== selected) {
        const now = Date.now();
        // Prevent triggering sparkles more than once per second
        if (!isAnimating && now - lastSparkleTime.current > 1000) {
          setGender(selected);
          setIsAnimating(true);
          triggerSparkles();
          lastSparkleTime.current = now;

          // Reset the animation lock after animation completes
          setTimeout(() => {
            setIsAnimating(false);
          }, 1000);
        } else {
          // Still update gender even if we don't trigger sparkles
          setGender(selected);
        }
      }
    },
    [gender, setGender, triggerSparkles, isAnimating]
  );

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6, duration: 0.8 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        How do you identify?
      </h2>
      <div className="flex items-center justify-center gap-6 sm:gap-12">
        <AnimatePresence mode="wait">
          <GenderOption
            type="male"
            selected={gender}
            onSelect={handleSelectGender}
          />
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <GenderOption
            type="female"
            selected={gender}
            onSelect={handleSelectGender}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default GenderSelector;
