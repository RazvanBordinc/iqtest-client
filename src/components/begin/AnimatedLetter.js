"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

// Using memo to prevent unnecessary re-renders
const AnimatedLetter = memo(function AnimatedLetter({ item, isConfirmed }) {
  return (
    <motion.div
      className="absolute font-bold pointer-events-none text-black dark:text-white"
      style={{
        left: item.x,
        top: item.y,
        fontSize: `${item.scale * 2}rem`,
      }}
      initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1.2, 0],
        filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(15px)"],
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
    >
      {item.char}
    </motion.div>
  );
});

export default AnimatedLetter;
