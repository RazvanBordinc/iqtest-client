"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Trophy,
  Award,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Clock,
  Calculator,
  BookText,
  Brain,
  Sparkles,
  Users,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Medal,
} from "lucide-react";
import { cn } from "@/app/utils/cn";

export default function TestSpecificRankTable({ testType, userData, leaderboardData: propLeaderboardData, testStats, currentPage, setCurrentPage }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "asc",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Get icon and styling based on test type
  const getTestInfo = () => {
    switch (testType) {
      case "number-logic":
        return {
          icon: <Calculator className="w-4 h-4 mr-1" />,
          title: "Numerical Reasoning",
          color: "bg-blue-500",
          gradient:
            "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
        };
      case "word-logic":
        return {
          icon: <BookText className="w-4 h-4 mr-1" />,
          title: "Verbal Intelligence",
          color: "bg-emerald-500",
          gradient:
            "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
        };
      case "memory":
        return {
          icon: <Brain className="w-4 h-4 mr-1" />,
          title: "Memory & Recall",
          color: "bg-amber-500",
          gradient:
            "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
        };
      case "mixed":
        return {
          icon: <Sparkles className="w-4 h-4 mr-1" />,
          title: "Comprehensive IQ",
          color: "bg-purple-500",
          gradient:
            "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
        };
      default:
        return {
          icon: <Trophy className="w-4 h-4 mr-1" />,
          title: "Test Rankings",
          color: "bg-gray-500",
          gradient:
            "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700",
        };
    }
  };

  // Get predefined row class for current user based on test type
  const getUserRowClass = (testType) => {
    switch (testType) {
      case "number-logic":
        return "bg-blue-50 dark:bg-blue-900/10 relative z-10";
      case "word-logic":
        return "bg-emerald-50 dark:bg-emerald-900/10 relative z-10";
      case "memory":
        return "bg-amber-50 dark:bg-amber-900/10 relative z-10";
      case "mixed":
        return "bg-purple-50 dark:bg-purple-900/10 relative z-10";
      default:
        return "bg-gray-50 dark:bg-gray-800/50 relative z-10";
    }
  };

  // Get predefined badge class for "You" label
  const getUserBadgeClass = (testType) => {
    switch (testType) {
      case "number-logic":
        return "ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "word-logic":
        return "ml-2 px-2 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200";
      case "memory":
        return "ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200";
      case "mixed":
        return "ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  // Get predefined avatar background class for user avatar
  const getUserAvatarClass = (testType, isCurrentUser) => {
    if (!isCurrentUser) {
      return "bg-gray-100 dark:bg-gray-800";
    }

    switch (testType) {
      case "number-logic":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600";
      case "word-logic":
        return "bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600";
      case "memory":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600";
      case "mixed":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700";
    }
  };

  // Get rank indicator styling for top 3 ranks
  const getRankIndicatorClass = (rank, testType) => {
    if (rank === 1) {
      return "bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 text-white shadow-lg ring-2 ring-yellow-400/20";
    } else if (rank === 2) {
      return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300 text-white shadow-lg ring-2 ring-gray-300/20";
    } else if (rank === 3) {
      return "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-600 text-white shadow-lg ring-2 ring-amber-400/20";
    }
    return "";
  };

  const testInfo = getTestInfo();

  // Process leaderboard data from backend
  const leaderboardData = React.useMemo(() => {
    // Return empty array if no data
    if (!propLeaderboardData || propLeaderboardData.length === 0) {
      return [];
    }

    // Map the backend data to the expected format
    const userIdToCheck = userData ? (userData.UserId || userData.userId) : null;
    
    const mappedData = propLeaderboardData.map((user) => {
      const userId = user.UserId || user.userId;
      
      // Determine if this is the current user - important for highlighting
      // First check if backend already marked it as current user
      let isCurrentUser = user.IsCurrentUser || user.isCurrentUser || false;
      
      // If not already marked and we have userData to compare against
      if (!isCurrentUser && userIdToCheck && userId) {
        isCurrentUser = userId == userIdToCheck;
      }
      
      // Calculate percentile correctly for "top X%" representation
      // Server returns a value representing what percentage of users scored lower
      const percentileValue = user.Percentile || user.percentile || 0;
      
      return {
        id: userId,
        rank: user.Rank || user.rank,
        username: user.Username || user.username || "Unknown",
        score: user.Score || user.score,
        percentile: percentileValue, // Using directly as provided by backend
        time: user.AverageTime || user.averageTime || user.BestTime || user.bestTime || "N/A", 
        iqScore: user.IQScore || user.iqScore,
        country: user.Country || user.country || "Not specified",
        isCurrentUser: isCurrentUser
      };
    });

    // If userData exists and isn't already in the list, add it
    const hasUserData = mappedData.some((user) => user.isCurrentUser);
    
    if (!hasUserData && userData) {
      const testResults = userData.TestResults || userData.testResults;
      const userTestData = testResults?.[testType];
      
      if (userTestData) {
        mappedData.push({
          id: userData.UserId || userData.userId,
          rank: userTestData.Rank || userTestData.rank || mappedData.length + 1,
          username: userData.Username || userData.username || "Unknown",
          score: userTestData.Score || userTestData.score || 0,
          percentile: userTestData.Percentile || userTestData.percentile || 0,
          time: userTestData.AverageTime || userTestData.averageTime || userTestData.BestTime || userTestData.bestTime || userTestData.time || "N/A",
          iqScore: userTestData.IQScore || userTestData.iqScore,
          isCurrentUser: true,
        });
      }
    }

    return mappedData;
  }, [propLeaderboardData, userData, testType]);

  // Sort function for the table
  const sortedData = React.useMemo(() => {
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
  const filteredData = sortedData.filter((item) =>
    item.username?.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex items-center mb-6">
        <div
          className={`p-2 rounded-lg bg-gradient-to-r ${testInfo.gradient} mr-3`}
        >
          {testInfo.icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {testInfo.title} Rankings
        </h2>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 text-sm sm:text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-shadow duration-200 focus:shadow-md"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr>
              {/* Rank column */}
              <th
                scope="col"
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("rank")}
              >
                <div className="flex items-center">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Rank</span>
                  <span className="sm:hidden">#</span>
                  {getSortIndicator("rank")}
                </div>
              </th>

              {/* Username column */}
              <th
                scope="col"
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("username")}
              >
                <div className="flex items-center">
                  <span>User</span>
                  {getSortIndicator("username")}
                </div>
              </th>

              {/* Country column */}
              <th
                scope="col"
                className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("country")}
              >
                <div className="flex items-center">
                  <span>Country</span>
                  {getSortIndicator("country")}
                </div>
              </th>

              {/* Score column */}
              <th
                scope="col"
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("score")}
              >
                <div className="flex items-center">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>Score</span>
                  {getSortIndicator("score")}
                </div>
              </th>

              {/* Percentile column */}
              <th
                scope="col"
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("percentile")}
              >
                <div className="flex items-center">
                  <span>Top %</span>
                  {getSortIndicator("percentile")}
                </div>
              </th>

              {/* Time column - hidden on mobile */}
              <th
                scope="col"
                className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("time")}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Time</span>
                  {getSortIndicator("time")}
                </div>
              </th>

              {/* IQ Score column - only for comprehensive test */}
              {testType === "mixed" && (
                <th
                  scope="col"
                  className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("iqScore")}
                >
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-1" />
                    <span>IQ</span>
                    {getSortIndicator("iqScore")}
                  </div>
                </th>
              )}
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
                onMouseEnter={() => setHoveredRow(user.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={cn(
                  "transition-all duration-200 cursor-pointer group",
                  user.isCurrentUser
                    ? getUserRowClass(testType)
                    : hoveredRow === user.id
                    ? "bg-gray-50 dark:bg-gray-800/50"
                    : ""
                )}
              >
                {/* Handle top 3 ranks specially */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: user.rank <= 3 ? 1.05 : 1 }}
                  >
                    {user.rank <= 3 ? (
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${getRankIndicatorClass(
                          user.rank,
                          testType
                        )} flex items-center justify-center shadow-md`}
                      >
                        {user.rank === 1 ? (
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-100" />
                        ) : user.rank === 2 ? (
                          <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-100" />
                        ) : (
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-amber-100" />
                        )}
                      </div>
                    ) : (
                      <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                        {user.rank}
                      </span>
                    )}
                  </motion.div>
                </td>

                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <motion.div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${getUserAvatarClass(
                        testType,
                        user.isCurrentUser
                      )} ${user.isCurrentUser ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-current" : ""}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <span
                        className={
                          user.isCurrentUser
                            ? "text-xs sm:text-sm font-medium text-white"
                            : "text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                        }
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </motion.div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                        {user.isCurrentUser && (
                          <motion.span 
                            className={getUserBadgeClass(testType)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            You
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.country || "Not specified"}
                  </div>
                </td>

                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <motion.div
                    className="flex items-center text-sm sm:text-base font-medium text-gray-900 dark:text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg sm:text-xl font-bold">{user.score}</span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">/100</span>
                  </motion.div>
                </td>

                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className={cn(
                    "text-sm sm:text-base font-medium",
                    parseFloat(user.percentile || 0) <= 1 
                      ? "text-green-600 dark:text-green-400" 
                      : parseFloat(user.percentile || 0) <= 5 
                      ? "text-blue-600 dark:text-blue-400"
                      : parseFloat(user.percentile || 0) <= 10
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400"
                  )}>
                    {/* Calculate percentile as 100 - percentile to show "top X%" correctly */}
                    Top {parseFloat(user.percentile || 0) < 0.01 
                      ? "0.01" 
                      : parseFloat(user.percentile || 0) < 1 
                      ? parseFloat(user.percentile || 0).toFixed(2) 
                      : parseFloat(user.percentile || 0) < 10 
                      ? parseFloat(user.percentile || 0).toFixed(1) 
                      : Math.round(parseFloat(user.percentile || 0))}%
                  </div>
                </td>

                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400 dark:text-gray-500" />
                    <span>{user.time}</span>
                  </div>
                </td>

                {/* IQ Score - only for comprehensive test */}
                {testType === "mixed" && (
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.iqScore || "N/A"}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
        </div>
        
        {/* No data message */}
        {filteredData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="text-center p-6">
              <Trophy className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {searchQuery 
                  ? `No users found matching "${searchQuery}"`
                  : "No rankings available yet"
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {testStats && testStats.pageSize && (
        <motion.div 
          className="mt-6 flex items-center justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.ceil(testStats.testCompletedCount / testStats.pageSize) }, (_, i) => i + 1)
              .filter(page => {
                const totalPages = Math.ceil(testStats.testCompletedCount / testStats.pageSize);
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                return false;
              })
              .map((page, index, array) => {
                // Add ellipsis
                if (index > 0 && array[index - 1] < page - 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="text-gray-500 dark:text-gray-400">...</span>
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsAnimating(true);
                          setCurrentPage(page);
                          setTimeout(() => setIsAnimating(false), 300);
                        }}
                        className={`px-3 py-1 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? `bg-gradient-to-r ${testInfo.gradient} text-white shadow-md`
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </motion.button>
                    </React.Fragment>
                  );
                }
                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsAnimating(true);
                      setCurrentPage(page);
                      setTimeout(() => setIsAnimating(false), 300);
                    }}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? `bg-gradient-to-r ${testInfo.gradient} text-white shadow-md`
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(Math.ceil(testStats.testCompletedCount / testStats.pageSize), currentPage + 1))}
            disabled={currentPage >= Math.ceil(testStats.testCompletedCount / testStats.pageSize)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage >= Math.ceil(testStats.testCompletedCount / testStats.pageSize)
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
