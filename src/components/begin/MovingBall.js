"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { TRAVEL_DURATION } from "../home/HomePage";

// Using memo to prevent unnecessary re-renders
const MovingBall = memo(function MovingBall({ position, isConfirmed }) {
  const { initial, animate } = position;

  return (
    <motion.div
      className="bg-black dark:bg-gray-300 absolute size-10 rounded-full"
      initial={{ ...initial }}
      animate={{
        ...animate,
        scale: [1, 1, 0],
        opacity: [1, 1, 0],
      }}
      exit={{
        scale: 5,
        opacity: 0,
        transition: { duration: 0.7 },
      }}
      transition={{
        ...Object.fromEntries(
          Object.keys(animate).map((key) => [
            key,
            { duration: TRAVEL_DURATION, ease: "easeInOut" },
          ])
        ),
        scale: {
          times: [0, 0.95, 1],
          duration: TRAVEL_DURATION,
        },
        opacity: {
          times: [0, 0.95, 1],
          duration: TRAVEL_DURATION,
        },
      }}
    />
  );
});

export default MovingBall;
