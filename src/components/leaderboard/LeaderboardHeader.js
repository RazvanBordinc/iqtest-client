"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Medal, Crown, Calculator, BookText, Brain, Sparkles, ClipboardList } from "lucide-react";
import { TEST_TYPES } from "../constants/testTypes";

export default function LeaderboardHeader({ activeTest, testStats }) {
  const getTestInfo = () => {
    const testType = TEST_TYPES.find(type => type.id === activeTest);
    if (!testType) return { title: "Test Rankings", icon: Trophy, gradient: "from-gray-500 to-gray-600" };
    
    let icon;
    switch (testType.icon) {
      case "Calculator":
        icon = Calculator;
        break;
      case "BookText":
        icon = BookText;
        break;
      case "Brain":
        icon = Brain;
        break;
      case "Sparkles":
        icon = Sparkles;
        break;
      default:
        icon = Trophy;
    }
    
    return {
      title: testType.title,
      icon,
      gradient: testType.color,
    };
  };
  
  const testInfo = getTestInfo();
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
        key={activeTest}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
          duration: 0.3,
        }}
      >
        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${testInfo.gradient} flex items-center justify-center shadow-lg`}>
          {React.createElement(testInfo.icon, { className: "w-10 h-10 text-white" })}
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
          key={activeTest}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {testInfo.title} Rankings
        </motion.h1>

        <motion.div
          className={`h-1 w-full bg-gradient-to-r ${testInfo.gradient} rounded-full`}
          key={`underline-${activeTest}`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.6 }}
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
        <motion.div 
          key={`users-${activeTest}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-2 rounded-full"
        >
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
            {testStats?.totalUsers?.toLocaleString() || 0} Total Users
          </span>
        </motion.div>
        
        <motion.div 
          key={`completed-${activeTest}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`flex items-center px-4 py-2 rounded-full ${
            activeTest === 'number-logic' 
              ? 'bg-blue-50 dark:bg-blue-900/20' 
              : activeTest === 'word-logic' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20' 
              : activeTest === 'memory' 
              ? 'bg-amber-50 dark:bg-amber-900/20' 
              : 'bg-purple-50 dark:bg-purple-900/20'
          }`}
        >
          <ClipboardList className={`w-5 h-5 mr-2 ${
            activeTest === 'number-logic' 
              ? 'text-blue-600 dark:text-blue-400' 
              : activeTest === 'word-logic' 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : activeTest === 'memory' 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-purple-600 dark:text-purple-400'
          }`} />
          <span className={`text-sm font-medium ${
            activeTest === 'number-logic' 
              ? 'text-blue-800 dark:text-blue-300' 
              : activeTest === 'word-logic' 
              ? 'text-emerald-800 dark:text-emerald-300' 
              : activeTest === 'memory' 
              ? 'text-amber-800 dark:text-amber-300' 
              : 'text-purple-800 dark:text-purple-300'
          }`}>
            {testStats?.testCompletedCount?.toLocaleString() || 0} Tests Completed
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-2 rounded-full"
        >
          <Medal className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
            Updated Daily
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
