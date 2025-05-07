"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SimpleWelcome({ username, onContinue }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-full px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Display the welcome message with nice animation */}
      <motion.h1
        className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-75 w-full"
        initial={{ letterSpacing: "0px", y: 20, opacity: 0 }}
        animate={{ letterSpacing: "2px", y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Welcome back, {username}!
      </motion.h1>
    </motion.div>
  );
}
