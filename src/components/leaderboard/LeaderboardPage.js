"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/fetch/auth";
import {
  getTestTypeLeaderboard,
  getUserRanking,
} from "@/fetch/leaderboard";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import LeaderboardLoadingAnimation from "@/components/leaderboard/LeaderboardLoadingAnimation";
import Header from "@/components/start/Header";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import LeaderboardTabs from "@/components/leaderboard/LeaderboardTabs";
import UserRankingSummary from "@/components/leaderboard/UserRankingSummary";
import TestSpecificRankTable from "@/components/leaderboard/TestSpecificRankTable";

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("number-logic");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [testStats, setTestStats] = useState(null);
  const [cachedData, setCachedData] = useState({});

  // Tab options for the leaderboard
  const tabOptions = [
    { id: "number-logic", label: "Numerical" },
    { id: "word-logic", label: "Verbal" },
    { id: "memory", label: "Memory" },
    { id: "mixed", label: "Mixed" },
  ];

  // Fetch leaderboard data based on active tab
  const fetchLeaderboardData = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    // Check if we have cached data for this tab and page
    const cacheKey = `${activeTab}-${currentPage}`;
    if (cachedData[cacheKey]) {
      const cachedEntry = cachedData[cacheKey];
      const cacheAge = Date.now() - cachedEntry.timestamp;
      
      // Use cache if it's less than 5 minutes old
      if (cacheAge < 5 * 60 * 1000) {
        setLeaderboardData(cachedEntry.data.entries || []);
        setTestStats({
          testCompletedCount: cachedEntry.data.testCompletedCount,
          totalUsers: cachedEntry.data.totalUsers,
          currentPage: cachedEntry.data.currentPage,
          pageSize: cachedEntry.data.pageSize
        });
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch leaderboard and user data in parallel
      const [leaderboardResponse, userResponse] = await Promise.allSettled([
        getTestTypeLeaderboard(activeTab, currentPage, 10),
        userData ? Promise.resolve(userData) : getUserRanking()
      ]);

      if (leaderboardResponse.status === 'fulfilled') {
        const response = leaderboardResponse.value;
        setLeaderboardData(response.entries || []);
        setTestStats({
          testCompletedCount: response.testCompletedCount,
          totalUsers: response.totalUsers,
          currentPage: response.currentPage,
          pageSize: response.pageSize
        });
        
        // Save to cache
        const cacheKey = `${activeTab}-${currentPage}`;
        setCachedData(prev => ({
          ...prev,
          [cacheKey]: {
            data: response,
            timestamp: Date.now()
          }
        }));
      } else {
        console.error('Failed to fetch leaderboard:', leaderboardResponse.reason);
        setLeaderboardData([]);
      }

      if (userResponse.status === 'fulfilled' && !userData) {
        setUserData(userResponse.value);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      // Only show error if it's not an auth error (those redirect automatically)
      if (error.message !== "Authentication required") {
        showError(error.message || "Failed to load leaderboard data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage, userData, router, cachedData]);

  // Check authentication on mount
  useEffect(() => {
    const authenticated = isAuthenticated();
    setAuthChecked(true);
    if (!authenticated) {
      router.push("/");
      return;
    }
  }, [router]);

  // Fetch leaderboard data when tab changes or auth is checked
  useEffect(() => {
    if (authChecked && isAuthenticated()) {
      setCurrentPage(1); // Reset to first page when changing tabs
      fetchLeaderboardData();
    }
  }, [activeTab, authChecked, fetchLeaderboardData]);
  
  // Fetch when page changes
  useEffect(() => {
    if (authChecked && isAuthenticated() && currentPage > 1) {
      fetchLeaderboardData();
    }
  }, [currentPage, authChecked, fetchLeaderboardData]);

  // Get content based on active tab
  const renderTabContent = () => {
    if (isLoading) {
      return <LeaderboardLoadingAnimation />;
    }

    if (!leaderboardData || leaderboardData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No leaderboard data available yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Be the first to complete a test!</p>
        </div>
      );
    }

    // For test specific tabs
    return (
      <TestSpecificRankTable
        testType={activeTab}
        userData={userData}
        leaderboardData={leaderboardData}
        testStats={testStats}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    );
  };

  // Don't render until auth is checked
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black text-black dark:text-white flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

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
          <LeaderboardHeader activeTest={activeTab} testStats={testStats} />

          {/* User ranking summary */}
          {userData && (
            <UserRankingSummary userData={userData} activeTab={activeTab} />
          )}

          {/* Tab navigation */}
          <LeaderboardTabs
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
