"use client";
import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "medium", text = "" }) => {
  const sizes = {
    small: { wrapper: "w-12 h-12", dots: "w-2 h-2" },
    medium: { wrapper: "w-16 h-16", dots: "w-3 h-3" },
    large: { wrapper: "w-20 h-20", dots: "w-4 h-4" }
  };

  const { wrapper, dots } = sizes[size];

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    initial: { y: "0%" },
    animate: {
      y: ["0%", "-100%", "0%"],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`relative ${wrapper}`}
        variants={spinnerVariants}
        animate="animate"
      >
        {/* Background ring */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700 opacity-20" />
        
        {/* Spinning gradient ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent, transparent, transparent, rgb(147 51 234), transparent)"
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Center dots */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={containerVariants}
          animate="animate"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`${dots} rounded-full bg-purple-600 dark:bg-purple-400`}
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {text && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Inline button loading animation for more compact spaces
export const InlineLoadingAnimation = () => {
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 rounded-full bg-white"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            delay: index * 0.15
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;