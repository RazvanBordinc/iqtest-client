"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmButton from "./ConfirmButton";
import {
  TRAVEL_DURATION,
  TRANSFORM_DELAY,
  TRANSFORM_DURATION,
  INPUT_APPEAR_DELAY,
} from "../../app/page";

// Using memo to prevent unnecessary re-renders
const InputRectangle = memo(function InputRectangle({
  width,
  height,
  inputText,
  handleInputChange,
  isConfirmed,
  showButton,
  handleConfirm,
}) {
  return (
    <motion.div
      className="absolute rounded-full size-10 bg-white dark:bg-gray-800"
      initial={{ top: 0, left: 0 }}
      animate={{
        top: "50%",
        left: "50%",
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "8px",
        x: "-50%",
        y: "-50%",
      }}
      exit={{
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0],
        rotate: [0, 0, 720],
        transition: { duration: 1.5 },
      }}
      transition={{
        top: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        left: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        x: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        y: { duration: TRAVEL_DURATION, ease: "easeInOut" },
        width: {
          delay: TRANSFORM_DELAY,
          duration: TRANSFORM_DURATION,
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
      <motion.input
        type="text"
        placeholder="write your name"
        value={inputText}
        onChange={handleInputChange}
        className="w-full h-full bg-transparent text-center focus:outline-none font-bold text-base sm:text-xl px-3 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: INPUT_APPEAR_DELAY, duration: 0.3 }}
        disabled={isConfirmed}
      />

      <ConfirmButton showButton={showButton} handleConfirm={handleConfirm} />
    </motion.div>
  );
});

export default InputRectangle;
