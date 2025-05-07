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
  answers,
  totalQuestions,
  calculateScore,
}) {
  // Calculate ranking (this would normally come from a database)
  const ranking = 13515;
  const betterThanPercent = 87; // Placeholder value

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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300 text-lg">
                Better than
              </span>
            </div>

            <motion.div className="relative" variants={scoreRevealVariants}>
              <div
                className="relative px-4 py-3 rounded-lg bg-gradient-to-r 
                            from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700
                            text-white font-bold text-xl sm:text-2xl
                            flex items-center gap-1 shadow-lg"
              >
                <span>{betterThanPercent}%</span>
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

          {/* Leaderboard position */}
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center
                      mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                Leaderboard Position
              </span>
            </div>

            <div className="mt-2 sm:mt-0 flex items-center gap-3">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                #{ranking}
              </span>

              <motion.div
                className="flex items-center gap-1.5 text-sm text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 
                          py-1 px-2 rounded-full border border-indigo-100 dark:border-indigo-800"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Lock className="w-3 h-3" />
                <span>Global</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ENHANCED LOGIN/SIGNUP CARD WITH HIGHLIGHTED IQ SCORE */}
        <motion.div
          className="relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Animated highlight border */}
          <motion.div
            className="absolute inset-0 rounded-xl z-0"
            variants={pulseVariants}
            animate="pulse"
          />

          <motion.div
            className="relative z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 
                      dark:from-indigo-950/60 dark:via-indigo-900/40 dark:to-purple-950/60
                      p-6 rounded-xl border-2 border-indigo-300 dark:border-indigo-700
                      text-center shadow-lg"
          >
            {/* Decorative stars */}
            <motion.div
              className="absolute top-2 left-2 text-yellow-400 dark:text-yellow-300"
              animate={{
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Star size={16} fill="currentColor" />
            </motion.div>

            <motion.div
              className="absolute top-2 right-2 text-yellow-400 dark:text-yellow-300"
              animate={{
                rotate: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Star size={16} fill="currentColor" />
            </motion.div>

            {/* Header */}
            <div className="flex justify-center mb-2">
              <motion.div
                className="w-14 h-14 bg-indigo-100 dark:bg-indigo-800 rounded-full 
                          flex items-center justify-center shadow-md 
                          text-indigo-600 dark:text-indigo-300"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(79, 70, 229, 0)",
                    "0 0 0 8px rgba(79, 70, 229, 0.2)",
                    "0 0 0 0 rgba(79, 70, 229, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <BrainCircuit className="w-8 h-8" />
              </motion.div>
            </div>

            {/* Highlighted message */}
            <div className="relative mb-4 mt-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Discover Your Exact IQ Score
              </h3>

              <div
                className="h-2 w-32 bg-gradient-to-r from-indigo-400 to-purple-400 
                            dark:from-indigo-500 dark:to-purple-500 
                            rounded-full mx-auto mt-2 mb-3"
              />

              <motion.div
                className="mt-3 mx-auto max-w-sm p-3 rounded-lg 
                          bg-gradient-to-r from-indigo-100/80 to-purple-100/80 
                          dark:from-indigo-900/30 dark:to-purple-900/30
                          border border-indigo-200 dark:border-indigo-800"
                whileHover={{ y: -2 }}
              >
                <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                  Log in now to see your precise IQ measurement and detailed
                  analysis
                </p>
              </motion.div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-5">
              <motion.button
                className="flex items-center gap-1 px-5 py-2.5 bg-white dark:bg-gray-800 
                          text-indigo-600 dark:text-indigo-400 rounded-lg 
                          border border-indigo-200 dark:border-indigo-700 
                          font-medium shadow-sm cursor-pointer
                          hover:border-indigo-300 dark:hover:border-indigo-600
                          w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </motion.button>

              <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                or
              </span>

              <motion.button
                className="flex items-center gap-2 px-5 py-2.5 
                          bg-gradient-to-r from-indigo-600 to-purple-600 
                          dark:from-indigo-700 dark:to-purple-700 
                          text-white rounded-lg font-medium 
                          shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/30 
                          cursor-pointer w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Sign up for free</span>
                <motion.div variants={arrowVariants} animate="animate">
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Try again button */}
        <motion.div className="text-center mt-8" variants={itemVariants}>
          <motion.button
            className="px-5 py-3 bg-indigo-600 dark:bg-indigo-700 text-white
                        rounded-lg font-medium text-xl cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.reload()}
          >
            Restart
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
