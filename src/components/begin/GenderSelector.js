"use client";

import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GenderOption from "./GenderOption";

// Using memo to prevent unnecessary re-renders
const GenderSelector = memo(function GenderSelector({
  gender,
  setGender,
  triggerSparkles,
}) {
  // Handle gender selection and trigger sparkle effects
  // Only trigger effects when actually changing gender
  const handleSelectGender = useCallback(
    (selected) => {
      if (gender !== selected) {
        setGender(selected);
        triggerSparkles();
      }
    },
    [gender, setGender, triggerSparkles]
  );

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6, duration: 0.8 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-text-primary">
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
