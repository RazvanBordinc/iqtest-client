"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Medal, Crown } from "lucide-react";

export default function LeaderboardHeader() {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Icon */}
      <motion.div
        className="inline-block mb-4 relative"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
          delay: 0.2,
        }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Crown className="w-5 h-5 text-yellow-500" />
        </motion.div>

        <motion.div
          className="absolute -bottom-1 -left-3 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <Medal className="w-5 h-5 text-amber-500" />
        </motion.div>
      </motion.div>

      {/* Title with animated gradient underline */}
      <motion.div className="relative inline-block">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Global Leaderboards
        </motion.h1>

        <motion.div
          className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        See how you rank against other test-takers worldwide. Track your
        progress and compete for the top spots in different test categories.
      </motion.p>

      {/* Stats row */}
      <motion.div
        className="flex flex-wrap justify-center gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full">
          <Users className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
          <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
            32,547 Active Users
          </span>
        </div>
        <div className="flex items-center bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full">
          <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
          <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
            195,328 Tests Completed
          </span>
        </div>
        <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full">
          <Medal className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
            Updated Daily
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
