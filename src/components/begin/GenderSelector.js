// components/GenderSelector.js
import React from "react";
import { motion } from "framer-motion";
import GenderOption from "./GenderOption";

export default function GenderSelector({ gender, setGender, triggerSparkles }) {
  // Handle gender selection and trigger sparkle effects
  const handleSelectGender = (selected) => {
    setGender(selected);
    triggerSparkles();
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6, duration: 0.8 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        How do you identify?
      </h2>
      <div className="flex items-center justify-center gap-6 sm:gap-12">
        <GenderOption
          type="male"
          selected={gender}
          onSelect={handleSelectGender}
        />
        <GenderOption
          type="female"
          selected={gender}
          onSelect={handleSelectGender}
        />
      </div>
    </motion.div>
  );
}
