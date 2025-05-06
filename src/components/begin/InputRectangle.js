// components/InputRectangle.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmButton from "./ConfirmButton";
import {
  TRAVEL_DURATION,
  TRANSFORM_DELAY,
  TRANSFORM_DURATION,
  INPUT_APPEAR_DELAY,
} from "../../app/page";

export default function InputRectangle({
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
      className="bg-white absolute rounded-full size-10"
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
        className="w-full h-full bg-transparent text-black text-center focus:outline-none font-bold text-base sm:text-xl px-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: INPUT_APPEAR_DELAY, duration: 0.3 }}
        disabled={isConfirmed}
      />

      <ConfirmButton showButton={showButton} handleConfirm={handleConfirm} />
    </motion.div>
  );
}
