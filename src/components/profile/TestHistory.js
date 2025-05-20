"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Brain,
  Clock,
  Target,
  ChevronRight,
  History,
  Award,
  BarChart3,
  Calendar,
  Zap,
  Star,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Medal,
  ChevronLeft,
  Filter,
  RefreshCw,
} from "lucide-react";
import { getTestHistory } from "@/fetch/profile";
import LoadingDots from "@/components/shared/LoadingDots";

const TestHistory = () => {
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchTestHistory();
  }, [page, limit, activeFilter]);

  // Force a refresh on initial load
  useEffect(() => {
    // Initial load - force page 1 to ensure we get data
    setPage(1);
  }, []);

  const fetchTestHistory = async () => {
    try {
      setLoading(true);
      const data = await getTestHistory(page, limit, activeFilter);
      console.log("Test history response:", data); // Debug log

      // The API now always returns the same structure from our fetch function
      // Either a proper response or a well-formed empty response
      if (data && typeof data === "object" && "results" in data) {
        setTestHistory(Array.isArray(data.results) ? data.results : []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);

        // If we're on a page with no results but there are results available,
        // reset to page 1 (this shouldn't happen with our backend but just in case)
        if (
          data.results.length === 0 &&
          data.pagination?.totalItems > 0 &&
          page > 1
        ) {
          setPage(1);
        }
      } else {
        // This should never happen anymore, but just in case
        console.error("Unexpected response format:", data);
        setTestHistory([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      setError("Failed to load test history");
      console.error("Test history fetch error:", err);
      setTestHistory([]); // Set empty array on error
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter === activeFilter ? null : filter);
    setPage(1); // Reset to first page on filter change
    setFilterOpen(false); // Close filter dropdown
  };

  const getTestIcon = (testTypeId) => {
    switch (testTypeId) {
      case "number-logic":
        return <BarChart3 className="w-6 h-6 text-white" />;
      case "word-logic":
        return <Award className="w-6 h-6 text-white" />;
      case "memory":
        return <Brain className="w-6 h-6 text-white" />;
      case "mixed":
        return <Trophy className="w-6 h-6 text-white" />;
      default:
        return <Target className="w-6 h-6 text-white" />;
    }
  };

  const getTestGradient = (testTypeId) => {
    switch (testTypeId) {
      case "number-logic":
        return "from-blue-500 to-cyan-500";
      case "word-logic":
        return "from-emerald-500 to-green-500";
      case "memory":
        return "from-amber-500 to-yellow-500";
      case "mixed":
        return "from-purple-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getBgColor = (testTypeId) => {
    switch (testTypeId) {
      case "number-logic":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "word-logic":
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case "memory":
        return "bg-amber-50 dark:bg-amber-900/20";
      case "mixed":
        return "bg-purple-50 dark:bg-purple-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getBorderColor = (testTypeId) => {
    switch (testTypeId) {
      case "number-logic":
        return "border-blue-200 dark:border-blue-800/30";
      case "word-logic":
        return "border-emerald-200 dark:border-emerald-800/30";
      case "memory":
        return "border-amber-200 dark:border-amber-800/30";
      case "mixed":
        return "border-purple-200 dark:border-purple-800/30";
      default:
        return "border-gray-200 dark:border-gray-800/30";
    }
  };

  const getFilterBgColor = (testTypeId) => {
    // Similar to getBgColor but with stronger colors for filter buttons
    switch (testTypeId) {
      case "number-logic":
        return activeFilter === testTypeId
          ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700"
          : "bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/30";
      case "word-logic":
        return activeFilter === testTypeId
          ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700"
          : "bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/30";
      case "memory":
        return activeFilter === testTypeId
          ? "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700"
          : "bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/30";
      case "mixed":
        return activeFilter === testTypeId
          ? "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700"
          : "bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/30";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getFilterTextColor = (testTypeId) => {
    switch (testTypeId) {
      case "number-logic":
        return "text-blue-700 dark:text-blue-300";
      case "word-logic":
        return "text-emerald-700 dark:text-emerald-300";
      case "memory":
        return "text-amber-700 dark:text-amber-300";
      case "mixed":
        return "text-purple-700 dark:text-purple-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  const getScoreClass = (score) => {
    if (score >= 90) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 75) return "text-blue-500 dark:text-blue-400";
    if (score >= 60) return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  const getPerformanceLabel = (score) => {
    if (score >= 90)
      return {
        text: "Outstanding",
        icon: <Star className="w-4 h-4 mr-1 text-yellow-500" />,
        bgColor: "bg-yellow-50 dark:bg-yellow-900/30",
        textColor: "text-yellow-700 dark:text-yellow-300",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      };
    if (score >= 80)
      return {
        text: "Excellent",
        icon: <Medal className="w-4 h-4 mr-1 text-blue-500" />,
        bgColor: "bg-blue-50 dark:bg-blue-900/30",
        textColor: "text-blue-700 dark:text-blue-300",
        borderColor: "border-blue-200 dark:border-blue-800",
      };
    if (score >= 70)
      return {
        text: "Very Good",
        icon: <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />,
        bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
        textColor: "text-emerald-700 dark:text-emerald-300",
        borderColor: "border-emerald-200 dark:border-emerald-800",
      };
    if (score >= 60)
      return {
        text: "Good",
        icon: <CheckCircle2 className="w-4 h-4 mr-1 text-teal-500" />,
        bgColor: "bg-teal-50 dark:bg-teal-900/30",
        textColor: "text-teal-700 dark:text-teal-300",
        borderColor: "border-teal-200 dark:border-teal-800",
      };
    if (score >= 50)
      return {
        text: "Average",
        icon: <ArrowRight className="w-4 h-4 mr-1 text-amber-500" />,
        bgColor: "bg-amber-50 dark:bg-amber-900/30",
        textColor: "text-amber-700 dark:text-amber-300",
        borderColor: "border-amber-200 dark:border-amber-800",
      };
    return {
      text: "Needs Work",
      icon: <ArrowUpRight className="w-4 h-4 mr-1 text-red-500" />,
      bgColor: "bg-red-50 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-300",
      borderColor: "border-red-200 dark:border-red-800",
    };
  };

  const toggleExpand = (id) => {
    if (expandedTest === id) {
      setExpandedTest(null);
    } else {
      setExpandedTest(id);
    }
  };

  // Filter types for the filter dropdown
  const filterTypes = [
    {
      id: "number-logic",
      name: "Numerical",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    { id: "word-logic", name: "Verbal", icon: <Award className="w-4 h-4" /> },
    { id: "memory", name: "Memory", icon: <Brain className="w-4 h-4" /> },
    {
      id: "mixed",
      name: "Comprehensive",
      icon: <Trophy className="w-4 h-4" />,
    },
  ];

  if (loading) {
    return (
      <motion.div
        className="p-6 bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <History className="w-5 h-5 mr-2 text-purple-500" />
          Test History
        </h3>
        <div className="flex justify-center py-12">
          <LoadingDots />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="p-6 bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <History className="w-5 h-5 mr-2 text-purple-500" />
          Test History
        </h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
        <button
          onClick={fetchTestHistory}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  // Show the empty state only if not loading and we have no test history
  if (!loading && testHistory.length === 0 && !error) {
    return (
      <motion.div
        className="p-6 bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-lg h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <History className="w-5 h-5 mr-2 text-purple-500" />
          Test History
        </h3>
        <div className="text-center py-16 px-4">
          <motion.div
            className="inline-block"
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          </motion.div>
          <h4 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
            No Test History Yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Complete your first test to start building your cognitive profile
            and track your progress over time.
          </p>
          <motion.a
            href="/tests"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 
                     text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Take a Test
          </motion.a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-lg h-full overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap justify-between items-start gap-2 mb-6 ml-8">
        {/* Filter button and dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4 mr-1" />
            <span>
              {activeFilter
                ? `Filter: ${
                    filterTypes.find((f) => f.id === activeFilter)?.name
                  }`
                : "Filter by Type"}
            </span>
          </motion.button>

          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px]"
            >
              <div className="p-2 space-y-1">
                {filterTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleFilterChange(type.id)}
                    className={`flex items-center w-full py-2 px-3 rounded-md text-left cursor-pointer ${getFilterBgColor(
                      type.id
                    )} ${getFilterTextColor(type.id)}`}
                  >
                    {React.cloneElement(type.icon, {
                      className: `w-4 h-4 mr-2 ${getFilterTextColor(type.id)}`,
                    })}
                    {type.name}
                  </button>
                ))}

                {activeFilter && (
                  <button
                    onClick={() => handleFilterChange(null)}
                    className="flex items-center w-full py-2 px-3 rounded-md text-left bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Filter
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pagination info */}
      {totalItems > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalItems)}{" "}
          of {totalItems} tests
          {activeFilter &&
            ` (filtered by ${
              filterTypes.find((f) => f.id === activeFilter)?.name
            })`}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {testHistory &&
          testHistory.map((test, index) => {
            const score =
              test.Score !== undefined ? test.Score : test.score || 0;
            const performance = getPerformanceLabel(score);
            const testTypeId = test.TestTypeId || test.testTypeId;

            return (
              <motion.div
                key={test.Id || test.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.08,
                }}
                className={`border ${getBorderColor(
                  testTypeId
                )} rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-md`}
              >
                {/* Header Bar */}
                <div
                  className={`py-3 px-4 ${getBgColor(
                    testTypeId
                  )} border-b ${getBorderColor(
                    testTypeId
                  )} flex justify-between items-center`}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getTestGradient(
                        testTypeId
                      )} shadow-md 
                               flex items-center justify-center`}
                      animate={{
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }}
                    >
                      {getTestIcon(testTypeId)}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {test.TestTitle || test.testTitle}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {test.TimeAgo || test.timeAgo}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className={`px-3 py-1 ${performance.bgColor} ${performance.textColor} border ${performance.borderColor} text-sm font-medium rounded-full flex items-center cursor-pointer`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {performance.icon}
                    {performance.text}
                  </motion.div>
                </div>

                {/* Main Content */}
                <div className="p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Score
                      </p>
                      <p
                        className={`text-xl font-bold ${getScoreClass(
                          test.Score !== undefined
                            ? test.Score
                            : test.score || 0
                        )}`}
                      >
                        {test.Score !== undefined
                          ? test.Score
                          : test.score || 0}
                        %
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Percentile
                      </p>
                      <p className="font-medium flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-amber-500" />
                        <span className="text-gray-900 dark:text-white">
                          {test.BetterThanPercentage ||
                            test.betterThanPercentage ||
                            "0%"}
                        </span>
                      </p>
                    </div>

                    {(test.IQScore || test.iqScore) && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          IQ Score
                        </p>
                        <motion.p
                          className="font-bold text-xl bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        >
                          {test.IQScore || test.iqScore}
                        </motion.p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Time Taken
                      </p>
                      <p className="font-medium flex items-center text-gray-900 dark:text-white">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" />
                        {test.Duration || test.duration || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 mb-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400">
                        Accuracy
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {test.Accuracy !== undefined
                          ? `${test.Accuracy.toFixed(1)}%`
                          : test.accuracy !== undefined
                          ? `${test.accuracy.toFixed(1)}%`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getTestGradient(
                          test.testTypeId || test.TestTypeId
                        )}`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            test.Accuracy !== undefined
                              ? test.Accuracy
                              : test.accuracy || 0
                          }%`,
                        }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                      />
                    </div>
                  </div>

                  {/* Always show details - no toggle needed */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Questions
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {test.QuestionsCompleted ||
                            test.questionsCompleted ||
                            0}{" "}
                          completed
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Date & Time
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {test.CompletedAt
                            ? new Date(test.CompletedAt).toLocaleString()
                            : test.completedAt
                            ? new Date(test.completedAt).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Performance summary */}
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                      <p className="mb-2">Your performance summary:</p>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 mr-2 rounded-full bg-purple-500"></span>
                          You scored higher than{" "}
                          {test.BetterThanPercentage ||
                            test.betterThanPercentage ||
                            "0%"}{" "}
                          of all test takers
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 mr-2 rounded-full bg-purple-500"></span>
                          You completed{" "}
                          {test.QuestionsCompleted ||
                            test.questionsCompleted ||
                            0}{" "}
                          questions in {test.Duration || test.duration || "N/A"}
                        </li>
                        {(test.IQScore || test.iqScore) && (
                          <li className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 mt-1.5 mr-2 rounded-full bg-purple-500"></span>
                            Your estimated IQ based on this test:{" "}
                            {test.IQScore || test.iqScore}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <motion.button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            whileHover={
              page !== 1
                ? { scale: 1.05, backgroundColor: "rgba(124, 58, 237, 0.1)" }
                : {}
            }
            whileTap={page !== 1 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          {/* Page number indicators */}
          <div className="flex space-x-1.5">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Logic for which page numbers to show
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer ${
                    page === pageNum
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  }`}
                  whileHover={page !== pageNum ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNum}
                </motion.button>
              );
            })}

            {/* Show ellipsis if there are more pages */}
            {totalPages > 5 && page < totalPages - 2 && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
                ...
              </span>
            )}
          </div>

          <motion.button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            whileHover={
              page !== totalPages
                ? { scale: 1.05, backgroundColor: "rgba(124, 58, 237, 0.1)" }
                : {}
            }
            whileTap={page !== totalPages ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default TestHistory;
