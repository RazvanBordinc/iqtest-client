"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/start/Header";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import LeaderboardTabs from "@/components/leaderboard/LeaderboardTabs";
import UserRankingSummary from "@/components/leaderboard/UserRankingSummary";
import GlobalRankTable from "@/components/leaderboard/GlobalRankingTable";
import TestSpecificRankTable from "@/components/leaderboard/TestSpecificRankTable";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function LeaderboardPage() {
  const { mounted } = useTheme();
  const [activeTab, setActiveTab] = useState("global");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated fetch of user data
  useEffect(() => {
    if (mounted) {
      // Simulate loading time
      const timer = setTimeout(() => {
        // In a real app, you'd fetch this from an API
        const mockUserData = {
          username: "Alexander",
          userId: "user123",
          globalRank: 1243,
          globalPercentile: 92,
          iqScore: 128,
          testResults: {
            "number-logic": {
              rank: 845,
              score: 89,
              percentile: 94,
              totalTests: 3,
            },
            "word-logic": {
              rank: 1560,
              score: 82,
              percentile: 87,
              totalTests: 2,
            },
            memory: {
              rank: 2134,
              score: 75,
              percentile: 84,
              totalTests: 1,
            },
            mixed: {
              rank: 1103,
              score: 85,
              percentile: 91,
              totalTests: 4,
            },
          },
        };

        setUserData(mockUserData);
        setIsLoading(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Don't render until client-side mounted to prevent hydration issues
  if (!mounted) return null;

  // Tab options for the leaderboard
  const tabOptions = [
    { id: "global", label: "Global Rankings" },
    { id: "number-logic", label: "Numerical" },
    { id: "word-logic", label: "Verbal" },
    { id: "memory", label: "Memory" },
    { id: "mixed", label: "Mixed" },
  ];

  // Get the content based on active tab
  const renderTabContent = () => {
    if (isLoading) {
      return <LeaderboardSkeleton />;
    }

    if (activeTab === "global") {
      return <GlobalRankTable userData={userData} />;
    }

    // For test specific tabs
    return <TestSpecificRankTable testType={activeTab} userData={userData} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black text-black dark:text-white">
      <Header />

      <main className="flex flex-col items-center pt-8 pb-16 px-4">
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <LeaderboardHeader />

          {/* User ranking summary */}
          {!isLoading && (
            <UserRankingSummary userData={userData} activeTab={activeTab} />
          )}

          {/* Tab navigation */}
          <LeaderboardTabs
            options={tabOptions}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main content card with glass effect */}
          <motion.div
            className="relative bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 
                      rounded-2xl backdrop-blur-md shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* Content based on selected tab */}
            <div className="p-6 sm:p-8">{renderTabContent()}</div>

            {/* Decorative bottom border gradient */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

// Skeleton loading state for the leaderboard
const LeaderboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"></div>
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg"
          ></div>
        ))}
      </div>
    </div>
  );
};
