"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  ChevronUp,
  Medal,
  Brain,
  Award,
  Calculator,
  BookText,
  Sparkles,
  Crown,
  TrendingUp,
} from "lucide-react";

export default function UserRankingSummary({ userData, activeTab }) {
  // No data to display
  if (!userData) return null;

  // Get data based on active tab
  const getRankData = () => {
    if (activeTab === "global") {
      return {
        rank: userData.globalRank,
        percentile: userData.globalPercentile,
        score: userData.iqScore,
        icon: <Trophy className="w-5 h-5 text-amber-500" />,
        color:
          "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
        label: "Global Ranking",
        scoreLabel: "IQ Score",
      };
    }

    const testData = userData.testResults[activeTab];
    if (!testData) return null;

    // Return test-specific data with appropriate styling
    switch (activeTab) {
      case "number-logic":
        return {
          rank: testData.rank,
          percentile: testData.percentile,
          score: testData.score,
          totalTests: testData.totalTests,
          icon: <Calculator className="w-5 h-5 text-blue-500" />,
          color:
            "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
          label: "Numerical Reasoning",
          scoreLabel: "Average Score",
        };
      case "word-logic":
        return {
          rank: testData.rank,
          percentile: testData.percentile,
          score: testData.score,
          totalTests: testData.totalTests,
          icon: <BookText className="w-5 h-5 text-emerald-500" />,
          color:
            "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
          label: "Verbal Intelligence",
          scoreLabel: "Average Score",
        };
      case "memory":
        return {
          rank: testData.rank,
          percentile: testData.percentile,
          score: testData.score,
          totalTests: testData.totalTests,
          icon: <Brain className="w-5 h-5 text-amber-500" />,
          color:
            "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
          label: "Memory & Recall",
          scoreLabel: "Average Score",
        };
      case "mixed":
        return {
          rank: testData.rank,
          percentile: testData.percentile,
          score: testData.score,
          totalTests: testData.totalTests,
          icon: <Sparkles className="w-5 h-5 text-purple-500" />,
          color:
            "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
          label: "Comprehensive IQ",
          scoreLabel: "Average Score",
        };
      default:
        return null;
    }
  };

  const rankData = getRankData();
  if (!rankData) return null;

  // Performance label based on percentile
  const getPerformanceLabel = (percentile) => {
    if (percentile >= 95) return "Exceptional";
    if (percentile >= 85) return "Superior";
    if (percentile >= 70) return "Above Average";
    if (percentile >= 45) return "Average";
    return "Fair";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="mb-8 bg-white/80 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6 shadow-lg backdrop-blur-sm overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-0 right-0 w-60 h-60 rounded-full bg-gradient-to-r ${rankData.color} opacity-5 -mt-20 -mr-20`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* User info section */}
          <motion.div variants={itemVariants} className="flex items-center">
            <div className="mr-4">
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-r ${rankData.color} flex items-center justify-center shadow-md`}
              >
                <Crown className="w-7 h-7 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-1">
                {rankData.icon}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
                  {rankData.label}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Hey <span className="font-medium">{userData.username}</span>,
                here&apos;s how you compare to other test-takers
              </p>
            </div>
          </motion.div>

          {/* Ranking stats */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            {/* Ranking */}
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-1">
                <Trophy className="w-3.5 h-3.5 mr-1" />
                <span>Your Rank</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  #{rankData.rank}
                </span>
                <motion.div
                  className="ml-2 text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full flex items-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-3 h-3 mr-1" />
                  <span>Top {100 - rankData.percentile}%</span>
                </motion.div>
              </div>
            </div>

            {/* Score */}
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-1">
                <Brain className="w-3.5 h-3.5 mr-1" />
                <span>{rankData.scoreLabel}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {rankData.score}
                </span>
                <motion.div
                  className="ml-2 text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{getPerformanceLabel(rankData.percentile)}</span>
                </motion.div>
              </div>
            </div>

            {/* Tests Taken (only for test-specific tabs) */}
            {rankData.totalTests && (
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-1">
                  <ClipboardList className="w-3.5 h-3.5 mr-1" />
                  <span>Tests Taken</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {rankData.totalTests}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Missing component from imports
const ClipboardList = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
};
