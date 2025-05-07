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
} from "lucide-react";

export default function TestSpecificRankTable({ testType, userData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "asc",
  });

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
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-sm";
    } else if (rank === 2) {
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-sm";
    } else if (rank === 3) {
      return "bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-sm";
    }
    return "";
  };

  const testInfo = getTestInfo();

  // Sample leaderboard data - in real app this would come from API
  const generateLeaderboardData = () => {
    // Generate different data based on test type to simulate variety
    const baseData = [
      {
        id: 1,
        rank: 1,
        username: "MathWizard",
        score: 98,
        accuracy: 99.2,
        time: "12:45",
        date: "2 days ago",
      },
      {
        id: 2,
        rank: 2,
        username: "QuizMaster",
        score: 97,
        accuracy: 98.5,
        time: "13:20",
        date: "1 day ago",
      },
      {
        id: 3,
        rank: 3,
        username: "TestAce",
        score: 95,
        accuracy: 97.8,
        time: "14:15",
        date: "4 days ago",
      },
      {
        id: 4,
        rank: 4,
        username: "BrainBox",
        score: 94,
        accuracy: 96.3,
        time: "15:10",
        date: "1 week ago",
      },
      {
        id: 5,
        rank: 5,
        username: "LogicMaster",
        score: 92,
        accuracy: 95.7,
        time: "12:30",
        date: "2 days ago",
      },
      {
        id: 6,
        rank: 6,
        username: "MindHacker",
        score: 91,
        accuracy: 94.8,
        time: "14:50",
        date: "3 days ago",
      },
      {
        id: 7,
        rank: 7,
        username: "GeniusMode",
        score: 90,
        accuracy: 93.5,
        time: "16:25",
        date: "5 days ago",
      },
      {
        id: 8,
        rank: 8,
        username: "IQChamp",
        score: 89,
        accuracy: 92.6,
        time: "13:45",
        date: "1 week ago",
      },
      {
        id: 9,
        rank: 9,
        username: "SmartAlec",
        score: 88,
        accuracy: 91.9,
        time: "15:30",
        date: "2 days ago",
      },
      {
        id: 10,
        rank: 10,
        username: "BrainiacPro",
        score: 87,
        accuracy: 90.8,
        time: "17:15",
        date: "4 days ago",
      },
    ];

    if (testType && userData?.testResults?.[testType]) {
      // Add current user data
      const userTestData = userData.testResults[testType];
      baseData.push({
        id: userData.userId,
        rank: userTestData.rank,
        username: userData.username,
        score: userTestData.score,
        accuracy: userTestData.percentile,
        time: "14:22", // Example time
        date: "Today",
        isCurrentUser: true,
      });
    }

    return baseData;
  };

  const leaderboardData = generateLeaderboardData();

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
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
          placeholder="Search by username..."
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

              {/* Score column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("score")}
              >
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  <span>Score</span>
                  {getSortIndicator("score")}
                </div>
              </th>

              {/* Accuracy column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("accuracy")}
              >
                <div className="flex items-center">
                  <span>Accuracy</span>
                  {getSortIndicator("accuracy")}
                </div>
              </th>

              {/* Time column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("time")}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Time</span>
                  {getSortIndicator("time")}
                </div>
              </th>

              {/* Date column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {getSortIndicator("date")}
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
                className={user.isCurrentUser ? getUserRowClass(testType) : ""}
              >
                {/* Handle top 3 ranks specially */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.rank <= 3 ? (
                      <div
                        className={`w-8 h-8 rounded-full ${getRankIndicatorClass(
                          user.rank
                        )} flex items-center justify-center`}
                      >
                        {user.rank === 1 ? (
                          <Trophy className="w-4 h-4" />
                        ) : (
                          <Award className="w-4 h-4" />
                        )}
                      </div>
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getUserAvatarClass(
                        testType,
                        user.isCurrentUser
                      )}`}
                    >
                      <span
                        className={
                          user.isCurrentUser
                            ? "text-sm font-medium text-white"
                            : "text-sm font-medium text-gray-700 dark:text-gray-300"
                        }
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                      {user.isCurrentUser && (
                        <span className={getUserBadgeClass(testType)}>You</span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <motion.div
                    className="text-sm font-medium text-gray-900 dark:text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    {testInfo.icon}
                    {user.score}/100
                  </motion.div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.accuracy}%
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    {user.time}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.date}
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
