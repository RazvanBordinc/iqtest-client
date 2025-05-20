"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Trophy,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Lock,
  LogIn,
  Crown,
  BrainCircuit,
  ArrowRight,
  Star,
} from "lucide-react";

export default function TestResults({
  testResult,
  testType,
}) {
  // Extract data from backend result (note: backend returns PascalCase)
  const score = testResult?.Score || testResult?.score || 0;
  const percentile = testResult?.Percentile || testResult?.percentile || 0;
  const iqScore = testResult?.IQScore || testResult?.iqScore;
  const duration = testResult?.Duration || testResult?.duration || "N/A";
  const accuracy = testResult?.Accuracy || testResult?.accuracy || 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const scoreRevealVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 1.2,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(99, 102, 241, 0.2)",
        "0 0 0 10px rgba(99, 102, 241, 0.2)",
        "0 0 0 0 rgba(99, 102, 241, 0.2)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const arrowVariants = {
    animate: {
      x: [0, 5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <motion.div
      className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-md rounded-xl 
                border border-gray-200/30 dark:border-gray-700/50 
                shadow-[0_0_30px_rgba(79,70,229,0.2)] p-6 sm:p-10
                max-w-full sm:max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top section with award icon */}
      <div className="text-center mb-10">
        <motion.div className="relative inline-block" variants={itemVariants}>
          <div
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full 
                        bg-gradient-to-br from-purple-500 to-indigo-600 
                        dark:from-purple-600 dark:to-indigo-700
                        flex items-center justify-center mx-auto
                        shadow-[0_0_20px_rgba(125,83,234,0.3)]"
          >
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>

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
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-2"
          variants={itemVariants}
        >
          Test Completed!
        </motion.h2>

        <motion.p
          className="text-gray-600 dark:text-gray-300 text-base sm:text-lg"
          variants={itemVariants}
        >
          Your results are in!
        </motion.p>
      </div>

      {/* Results section */}
      <motion.div className="mb-10 space-y-6" variants={fadeInVariants}>
        {/* Main stat */}
        <motion.div
          className="relative bg-gray-50/80 dark:bg-gray-800/50 p-6 sm:p-8 
                    rounded-xl border border-gray-100 dark:border-gray-700 
                    shadow-sm overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 text-purple-200/10 dark:text-purple-500/10 -mr-10 -mt-10"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Award size={128} />
          </motion.div>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-400 mr-3" />
            Your Performance
          </h3>

          {/* Score and percentile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Test Score</div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {score}/100
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Better than</div>
              <motion.div className="relative" variants={scoreRevealVariants}>
                <div
                  className="inline-flex px-4 py-2 rounded-lg bg-gradient-to-r 
                              from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700
                              text-white font-bold text-2xl
                              items-center gap-1 shadow-lg"
                >
                  <span>Top {100 - percentile < 1 ? (100 - percentile).toFixed(2) : Math.round(100 - percentile)}%</span>
                  <ChevronUp className="w-5 h-5" />

                <motion.div
                  className="absolute inset-0 rounded-lg opacity-30 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                </motion.div>
              </div>

              <motion.span
                className="absolute -top-2 -right-2 flex items-center justify-center
                          w-6 h-6 bg-white dark:bg-gray-900 rounded-full
                          text-xs font-bold text-indigo-600 dark:text-indigo-400
                          border-2 border-indigo-500 dark:border-indigo-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: 1.8,
                }}
              >
                <Crown className="w-3 h-3" />
              </motion.span>
              </motion.div>
            </div>
          </div>

          {/* Additional stats */}
          <div className="grid grid-cols-2 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time Taken</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {duration}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Accuracy</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {accuracy.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* IQ Score for comprehensive test only */}
          {testType === "mixed" && iqScore && (
            <motion.div
              className="mt-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 
                        dark:from-indigo-600 dark:to-purple-700 rounded-xl
                        text-center shadow-lg"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center mb-2">
                <BrainCircuit className="w-8 h-8 text-white mr-3" />
                <h4 className="text-xl font-bold text-white">Your IQ Score</h4>
              </div>
              <div className="text-5xl font-bold text-white">
                {iqScore}
              </div>
              <p className="text-indigo-100 mt-2">
                Based on your performance and time
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          variants={itemVariants}
        >
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                       dark:from-indigo-700 dark:to-purple-700 text-white
                       rounded-xl font-medium text-lg cursor-pointer
                       shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30
                       hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = '/tests'}
          >
            Try Another Test
          </motion.button>

          <motion.button
            className="px-6 py-3 bg-white dark:bg-gray-800 
                       text-indigo-600 dark:text-indigo-400 rounded-xl
                       border border-indigo-200 dark:border-indigo-700 
                       font-medium text-lg cursor-pointer
                       hover:border-indigo-300 dark:hover:border-indigo-600
                       transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = '/leaderboard'}
          >
            View Leaderboard
          </motion.button>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
