"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ListChecks, TrendingUp } from "lucide-react";

export default function TestCategoryButton({ category, onSelect, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const Icon = category.icon;

  // Simplified animations for mobile devices
  if (isMobile) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 cursor-pointer relative overflow-hidden"
        variants={itemVariants}
        onClick={onSelect}
        whileTap={{ scale: 0.97 }}
        style={{ touchAction: "manipulation" }}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 shadow-md`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {category.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {category.description}
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <ListChecks className="w-3 h-3 mr-1" />
              <span>{category.stats.questionsCount}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{category.stats.timeLimit}</span>
            </div>
          </div>

          {/* Action hint */}
          <div className="mt-3 text-xs font-medium text-purple-600 dark:text-purple-400">
            Tap to select
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop version with rich animations
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer relative overflow-hidden h-full"
      variants={itemVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        borderColor: "rgb(139, 92, 246)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      {/* Background elements */}
      <motion.div
        className="absolute top-0 right-0 w-48 h-48 -mt-16 -mr-16 rounded-full opacity-[0.07]"
        style={{
          background: `radial-gradient(circle, rgba(139,92,246,1) 0%, rgba(0,0,0,0) 70%)`,
          willChange: "transform, opacity",
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.12 : 0.07,
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="p-6 relative z-10 h-full flex flex-col">
        {/* Icon */}
        <div className="flex items-center mb-5">
          <motion.div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}
            whileHover={{ scale: 1.05 }}
            animate={{
              y: isHovered ? [0, -4, 0] : 0,
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              },
            }}
          >
            <Icon className="w-8 h-8 text-white" />

            {/* Orbital effect on hover */}
            {isHovered && (
              <motion.div
                className="absolute w-full h-full rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  boxShadow: [
                    "0 0 0 0px rgba(255,255,255,0.4)",
                    "0 0 0 10px rgba(255,255,255,0)",
                    "0 0 0 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              />
            )}
          </motion.div>

          <div className="ml-4 flex-1">
            <motion.h3
              className="text-xl font-bold text-gray-900 dark:text-white mb-1"
              animate={{
                x: isHovered ? 4 : 0,
                color: isHovered ? "rgb(139, 92, 246)" : "",
              }}
              transition={{ duration: 0.3 }}
            >
              {category.title}
            </motion.h3>

            {/* Stats row */}
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <ListChecks className="w-3 h-3 mr-1" />
                <span>{category.stats.questionsCount} Questions</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{category.stats.timeLimit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded description */}
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow"
          animate={{
            opacity: isHovered ? 1 : 0.9,
          }}
        >
          {isHovered ? category.longDescription : category.description}
        </motion.p>

        {/* Bottom action row */}
        <motion.div
          className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <motion.div
            className="text-xs text-gray-500 dark:text-gray-400 flex items-center"
            animate={{ opacity: isHovered ? 0 : 1 }}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Difficulty: {category.stats.difficulty}</span>
          </motion.div>

          <motion.div
            className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -10,
            }}
            transition={{ duration: 0.2 }}
          >
            <span>Select Test</span>
            <motion.span
              animate={{ x: isHovered ? [0, 4, 0] : 0 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
