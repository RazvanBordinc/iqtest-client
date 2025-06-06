"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Trophy,
  Medal,
  Award,
  Crown,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function GlobalRankTable({
  userData,
  leaderboardData: propLeaderboardData,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "asc",
  });

  // Wrap leaderboardData in its own useMemo to prevent it from changing on every render
  const leaderboardData = useMemo(() => {
    // Return empty array if no data
    if (!propLeaderboardData || propLeaderboardData.length === 0) {
      return [];
    }

    // Map the backend data to the expected format
    const mappedData = propLeaderboardData.map((user) => ({
      id: user.userId,
      rank: user.rank,
      username: user.username,
      iqScore: user.score,
      testsCompleted: user.testsTaken || 0,
      percentile: user.percentile || 0,
      percentileDisplay: user.percentileDisplay,
      country: user.country || "Unknown",
      isCurrentUser: userData && user.userId === userData.userId,
    }));

    // If userData exists and isn't already in the list, add it
    const hasUserData = mappedData.some((user) => user.isCurrentUser);
    
    if (!hasUserData && userData) {
      mappedData.push({
        id: userData.userId,
        rank: userData.globalRank || mappedData.length + 1,
        username: userData.username,
        iqScore: userData.score || 0,
        testsCompleted: userData.testsTaken || 0,
        percentile: userData.percentile || 0,
        country: userData.country || "Unknown",
        isCurrentUser: true,
      });
    }

    return mappedData;
  }, [userData, propLeaderboardData]);

  // Sort function for the table
  const sortedData = useMemo(() => {
    let sortableItems = [...leaderboardData];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [leaderboardData, sortConfig]);

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter based on search query
  const filteredData = sortedData.filter(
    (item) =>
      item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
          placeholder="Search by username or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {/* Rank column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("rank")}
              >
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-1" />
                  <span>Rank</span>
                  {getSortIndicator("rank")}
                </div>
              </th>

              {/* Username column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("username")}
              >
                <div className="flex items-center">
                  <span>User</span>
                  {getSortIndicator("username")}
                </div>
              </th>

              {/* IQ Score column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("iqScore")}
              >
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  <span>IQ Score</span>
                  {getSortIndicator("iqScore")}
                </div>
              </th>

              {/* Tests column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("testsCompleted")}
              >
                <div className="flex items-center">
                  <span>Tests</span>
                  {getSortIndicator("testsCompleted")}
                </div>
              </th>

              {/* Percentile column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("percentile")}
              >
                <div className="flex items-center">
                  <span>Percentile</span>
                  {getSortIndicator("percentile")}
                </div>
              </th>

              {/* Country column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("country")}
              >
                <div className="flex items-center">
                  <span>Country</span>
                  {getSortIndicator("country")}
                </div>
              </th>
            </tr>
          </thead>

          <motion.tbody
            className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredData.map((user) => (
              <motion.tr
                key={user.id}
                variants={tableRowVariants}
                className={
                  user.isCurrentUser
                    ? "bg-purple-50 dark:bg-purple-900/20 relative z-10"
                    : ""
                }
              >
                {/* Special styling for top 3 ranks */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.rank === 1 ? (
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold shadow-md">
                        <Crown className="w-4 h-4" />
                      </span>
                    ) : user.rank === 2 ? (
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-white font-bold shadow-md">
                        <Medal className="w-4 h-4" />
                      </span>
                    ) : user.rank === 3 ? (
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-600 to-yellow-700 text-white font-bold shadow-md">
                        <Award className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {user.rank}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        user.isCurrentUser
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          user.isCurrentUser
                            ? "text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.username?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                      {user.isCurrentUser && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <motion.div
                    className="text-sm font-medium text-gray-900 dark:text-white flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Brain className="w-4 h-4 text-purple-500 mr-1" />
                    {user.iqScore}
                  </motion.div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.testsCompleted}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.percentileDisplay ? 
                      (user.percentileDisplay === "0.01" ? "0.01 or less" : `${user.percentileDisplay}%`) : 
                      `${user.percentile?.toFixed(2)}%`}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.country}
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
