"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  TrendingUp,
  ChevronLeft,
  BarChart3,
  Calendar,
  Clock,
  Medal,
} from "lucide-react";

export default function TestScoreDisplay({ category, onBack }) {
  // Mock data for test scores
  // In a real app, this would come from an API or database
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate some mock data based on category
      const mockScores = [
        {
          id: 1,
          date: "May 3, 2025",
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          duration: "18:24",
          percentile: Math.floor(Math.random() * 25) + 75, // Random percentile 75-100
        },
        {
          id: 2,
          date: "April 25, 2025",
          score: Math.floor(Math.random() * 30) + 70,
          duration: "19:12",
          percentile: Math.floor(Math.random() * 25) + 75,
        },
        {
          id: 3,
          date: "April 18, 2025",
          score: Math.floor(Math.random() * 30) + 70,
          duration: "16:45",
          percentile: Math.floor(Math.random() * 25) + 75,
        },
      ];

      setScores(mockScores);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [category.id]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  // Get gradient color from category
  const gradientClass = category.color;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`scores-${category.id}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative"
      >
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="absolute top-0 left-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          variants={itemVariants}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-8"
          variants={itemVariants}
        >
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center mb-4 shadow-lg`}
          >
            <category.icon className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {category.title} Tests
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-center max-w-lg">
            View your previous test scores and performance
          </p>
        </motion.div>

        {/* Score display */}
        {isLoading ? (
          // Loading skeleton
          <motion.div className="space-y-4" variants={itemVariants}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse h-24"
              />
            ))}
          </motion.div>
        ) : scores.length > 0 ? (
          // Score list
          <motion.div className="space-y-4" variants={itemVariants}>
            {scores.map((score) => (
              <motion.div
                key={score.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden hover:shadow-md transition-shadow"
                whileHover={{ y: -2 }}
                variants={itemVariants}
              >
                {/* Background decoration */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientClass}`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-3 sm:mb-0">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-amber-500 mr-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Score: {score.score}
                      </h3>
                    </div>

                    <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{score.date}</span>

                      <Clock className="w-4 h-4 mr-1" />
                      <span>Duration: {score.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {score.percentile}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Percentile
                      </span>
                    </div>

                    <motion.button
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // No scores message
          <motion.div className="text-center py-12" variants={itemVariants}>
            <Medal className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              No tests completed yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Take your first test to see your results here
            </p>
          </motion.div>
        )}

        {/* Start test button */}
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <motion.button
            className={`px-6 py-3 rounded-lg bg-gradient-to-r ${gradientClass} text-white font-medium shadow-md cursor-pointer`}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            Start New Test
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
