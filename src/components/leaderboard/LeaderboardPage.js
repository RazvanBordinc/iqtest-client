"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getGlobalLeaderboard,
  getTestTypeLeaderboard,
  getUserRanking,
} from "@/fetch/leaderboard";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import Header from "@/components/start/Header";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import LeaderboardTabs from "@/components/leaderboard/LeaderboardTabs";
import UserRankingSummary from "@/components/leaderboard/UserRankingSummary";
import GlobalRankTable from "@/components/leaderboard/GlobalRankingTable";
import TestSpecificRankTable from "@/components/leaderboard/TestSpecificRankTable";

export default function LeaderboardPage({
  initialLeaderboard = [],
  initialUserRanking = null,
  error = null,
}) {
  const [activeTab, setActiveTab] = useState("global");
  const [leaderboardData, setLeaderboardData] = useState(initialLeaderboard);
  const [userData, setUserData] = useState(initialUserRanking);
  const [isLoading, setIsLoading] = useState(false);

  // Tab options for the leaderboard
  const tabOptions = [
    { id: "global", label: "Global Rankings" },
    { id: "number-logic", label: "Numerical" },
    { id: "word-logic", label: "Verbal" },
    { id: "memory", label: "Memory" },
    { id: "mixed", label: "Mixed" },
  ];

  // If there was an error from server-side fetching, show it
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Fetch leaderboard data when tab changes
  useEffect(() => {
    fetchLeaderboardData();
  }, [activeTab]);

  // Fetch leaderboard data based on active tab
  const fetchLeaderboardData = async () => {
    if (
      (activeTab === "global" && initialLeaderboard.length > 0) ||
      (activeTab !== "global" && leaderboardData.length > 0)
    ) {
      return; // Skip fetch if we already have data
    }

    setIsLoading(true);

    try {
      let data;
      if (activeTab === "global") {
        data = await getGlobalLeaderboard(50);
      } else {
        data = await getTestTypeLeaderboard(activeTab, 50);
      }

      setLeaderboardData(data);

      // If we don't have user ranking data yet, fetch it
      if (!userData) {
        const rankingData = await getUserRanking();
        setUserData(rankingData);
      }
    } catch (error) {
      showError(error.message || "Failed to load leaderboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Get content based on active tab
  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingAnimation />;
    }

    if (activeTab === "global") {
      return (
        <GlobalRankTable
          userData={userData}
          leaderboardData={leaderboardData}
        />
      );
    }

    // For test specific tabs
    return (
      <TestSpecificRankTable
        testType={activeTab}
        userData={userData}
        leaderboardData={leaderboardData}
      />
    );
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
          {userData && (
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
