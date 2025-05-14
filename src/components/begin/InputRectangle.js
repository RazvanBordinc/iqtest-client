"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import ConfirmButton from "./ConfirmButton";
import LoadingDots from "../shared/LoadingDots";

// Animation timing constants
export const TRAVEL_DURATION = 1.0;
export const TRANSFORM_DELAY = TRAVEL_DURATION - 0.05;
export const TRANSFORM_DURATION = 0.3;
export const INPUT_APPEAR_DELAY = TRANSFORM_DELAY + TRANSFORM_DURATION * 0.5;

// Using memo to prevent unnecessary re-renders
const InputRectangle = memo(function InputRectangle({
  width,
  height,
  inputText,
  handleInputChange,
  isConfirmed,
  showButton,
  handleConfirm,
  isLoading = false,
  error = null,
}) {
  return (
    <motion.div
      className={`absolute rounded-full size-10 ${error ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-purple-500 to-indigo-500'} shadow-xl`}
      initial={{ 
        top: 0, 
        left: 0,
        scale: 0.5,
        opacity: 0
      }}
      animate={{
        top: "50%",
        left: "50%",
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "16px",
        x: "-50%",
        y: "-50%",
        scale: 1,
        opacity: 1
      }}
      exit={{
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0],
        rotate: [0, 0, 360],
        transition: { duration: 1.2 },
      }}
      transition={{
        top: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        left: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        x: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        y: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        scale: { duration: TRANSFORM_DURATION, delay: 0.2 },
        opacity: { duration: 0.5 },
        width: {
          delay: TRANSFORM_DELAY,
          duration: TRANSFORM_DURATION,
          type: "spring",
          damping: 15,
          stiffness: 100
        },
        height: {
          delay: TRANSFORM_DELAY,
          duration: TRANSFORM_DURATION,
        },
        borderRadius: {
          delay: TRANSFORM_DELAY,
          duration: TRANSFORM_DURATION,
        },
      }}
    >
      <motion.div
        className="relative w-full h-full flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: INPUT_APPEAR_DELAY }}
      >
        <input
          type="text"
          placeholder="write your name"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && showButton && !isLoading && handleConfirm()}
          className={`w-full h-full bg-transparent text-center focus:outline-none font-bold text-base sm:text-xl px-12 text-white placeholder:text-white/70 transition-all ${error ? 'animate-shake' : ''}`}
          disabled={isConfirmed || isLoading}
          autoFocus
        />
        
        {isLoading && (
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingDots />
          </motion.div>
        )}

        <ConfirmButton 
          showButton={showButton && !isLoading} 
          handleConfirm={handleConfirm} 
          isLoading={isLoading} 
        />
      </motion.div>
    </motion.div>
  );
});

export default InputRectangle;