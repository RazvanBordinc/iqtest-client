"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  TrendingUp,
  ChevronLeft,
  BarChart3,
  Calendar,
  Clock,
  Medal,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TestScoreDisplay({ category, onBack }) {
  const router = useRouter();
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScore, setSelectedScore] = useState(null);
  const [username, setUsername] = useState("");

  // Get username and simulate loading data
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      setUsername(userData.username || "");
    } catch (error) {
      console.error("Error reading user data:", error);
    }

    // Simulate loading test scores from a database
    const timer = setTimeout(() => {
      // Generate mock data based on category
      const mockScores = Array.from({ length: 3 }).map((_, idx) => ({
        id: idx + 1,
        date: idx === 0 ? "Today" : idx === 1 ? "3 days ago" : "Last week",
        score: Math.floor(Math.random() * 25) + 75, // 75-100
        duration: `${Math.floor(Math.random() * 10) + 15}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, "0")}`,
        percentile: Math.floor(Math.random() * 30) + 70, // 70-100
        completed: Math.floor(Math.random() * 20) + 15, // 15-35 questions
        accuracy: `${Math.floor(Math.random() * 20) + 80}%`, // 80-100%
      }));

      setScores(mockScores);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [category.id]);

  // Start a new test
  const handleStartTest = () => {
    // Navigate to the test starting page with the selected category
    router.push(`/tests/start?category=${category.id}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  // Get gradient color from category
  const gradientClass = category.color;

  // If a specific score is selected, show detailed view
  if (selectedScore) {
    return (
      <AnimatePresence>
        <motion.div
          key="score-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Back button */}
          <motion.button
            onClick={() => setSelectedScore(null)}
            className="absolute -top-2 -left-2 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Score details */}
          <div className="mt-8">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Test Results
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedScore.date} • {category.title}
              </p>
            </motion.div>

            {/* Main score display */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 mb-8 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 opacity-10"
                style={{
                  background: `radial-gradient(circle, rgba(139,92,246,1) 0%, rgba(0,0,0,0) 70%)`,
                }}
              />

              <div className="flex flex-col items-center justify-center">
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.4,
                  }}
                >
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-r ${gradientClass} text-white text-4xl font-bold`}
                  >
                    {selectedScore.score}
                  </div>

                  <motion.div
                    className="absolute -top-2 -right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedScore.score >= 90
                      ? "Exceptional"
                      : selectedScore.score >= 80
                      ? "Above Average"
                      : "Good Performance"}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Better than {selectedScore.percentile}% of test takers
                  </p>
                </motion.div>
              </div>

              {/* Stats grid */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <StatItem
                  icon={<Clock className="w-5 h-5 text-blue-500" />}
                  label="Duration"
                  value={selectedScore.duration}
                />
                <StatItem
                  icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                  label="Questions"
                  value={`${selectedScore.completed}`}
                />
                <StatItem
                  icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
                  label="Accuracy"
                  value={selectedScore.accuracy}
                />
              </motion.div>
            </motion.div>

            {/* Performance comparison */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.button
                className={`px-6 py-3 rounded-lg bg-gradient-to-r ${gradientClass} text-white font-medium shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartTest}
              >
                Try Again
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`scores-${category.id}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative"
      >
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="absolute -top-2 -left-2 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          variants={itemVariants}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-10"
          variants={itemVariants}
        >
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center mb-4 shadow-lg`}
          >
            <category.icon className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {category.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-center max-w-lg">
            {username
              ? `${username}'s previous tests`
              : "View your previous test scores and performance"}
          </p>
        </motion.div>

        {/* Score display */}
        {isLoading ? (
          // Loading skeleton
          <motion.div className="space-y-4" variants={itemVariants}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse h-24"
              />
            ))}
          </motion.div>
        ) : scores.length > 0 ? (
          // Score list
          <motion.div className="space-y-4" variants={itemVariants}>
            {scores.map((score) => (
              <motion.div
                key={score.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 relative overflow-hidden hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedScore(score)}
                whileHover={{
                  y: -2,
                  boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)",
                  borderColor: "rgb(139, 92, 246)",
                }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {/* Background decoration */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientClass}`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-3 sm:mb-0">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-amber-500 mr-2" />
                      <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                        {score.score}
                      </h3>
                      <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                        points
                      </span>
                    </div>

                    <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span className="mr-4">{score.date}</span>

                      <Clock className="w-4 h-4 mr-1.5" />
                      <span>Duration: {score.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1.5" />
                        <span className="text-gray-900 dark:text-white font-semibold text-lg">
                          {score.percentile}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Percentile
                      </span>
                    </div>

                    <motion.div
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm"
                      whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>

                {/* View details hint */}
                <motion.div
                  className="absolute right-4 bottom-2 text-xs text-purple-500 dark:text-purple-400 font-medium opacity-0"
                  whileHover={{ opacity: 1 }}
                >
                  View details
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // No scores message
          <motion.div className="text-center py-12" variants={itemVariants}>
            <Medal className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              No tests completed yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Take your first test to see your results here
            </p>
          </motion.div>
        )}

        {/* Start test button */}
        <motion.div className="mt-10 text-center" variants={itemVariants}>
          <motion.button
            className={`px-6 py-3.5 rounded-lg bg-gradient-to-r ${gradientClass} text-white font-medium shadow-lg cursor-pointer inline-flex items-center gap-2`}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.35)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTest}
          >
            Start New Test
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper component for stat items
function StatItem({ icon, label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/60 rounded-lg p-3 flex flex-col items-center">
      <div className="mb-1">{icon}</div>
      <div className="font-semibold text-gray-900 dark:text-white text-lg">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
