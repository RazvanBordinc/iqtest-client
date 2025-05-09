"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export default function LoadingAnimation({ fullScreen = false }) {
  // Variants for container
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Variants for the brain icon
  const iconVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  // If fullScreen is true, render a full-screen loading overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black z-50">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div className="mx-auto mb-6 relative" variants={iconVariants}>
            <BrainCircuit className="h-20 w-20 text-purple-600 dark:text-purple-500" />

            <motion.div
              className="absolute inset-0 rounded-full blur-md"
              animate={{
                background: [
                  "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(0,0,0,0) 70%)",
                  "radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(0,0,0,0) 70%)",
                  "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(0,0,0,0) 70%)",
                ],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-purple-300 dark:bg-purple-700 -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-xl font-medium text-gray-800 dark:text-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4 },
            }}
          >
            Loading...
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  // Otherwise, render an inline loading spinner
  return (
    <div className="flex items-center justify-center py-6">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <BrainCircuit className="h-10 w-10 text-purple-600 dark:text-purple-500" />

        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(124, 58, 237, 0.3)",
              "0 0 0 8px rgba(124, 58, 237, 0)",
              "0 0 0 0px rgba(124, 58, 237, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
}
