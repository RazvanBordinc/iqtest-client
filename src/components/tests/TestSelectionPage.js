"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Brain,
  Calculator,
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  BarChart3,
  Trophy,
  Zap,
} from "lucide-react";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import FullScreenLoader from "@/components/shared/FullScreenLoader";
import TestSelectionLoadingAnimation from "./TestSelectionLoadingAnimation";
import Header from "@/components/start/Header";
import { TEST_TYPES } from "../constants/testTypes";
import TestAvailability from "./TestAvailability";
import { isAuthenticated, getCurrentUser } from "@/fetch/auth";

// Enhanced test category card with hover effects
const TestCategoryCard = ({ category, onSelect, index, isDisabled, isSelecting = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get icon based on category
  const getIcon = () => {
    switch (category.id) {
      case "number-logic":
        return <Calculator className="w-8 h-8" />;
      case "word-logic":
        return <BookOpen className="w-8 h-8" />;
      case "memory":
        return <Brain className="w-8 h-8" />;
      case "mixed":
        return <Sparkles className="w-8 h-8" />;
      default:
        return <Brain className="w-8 h-8" />;
    }
  };

  // Different card gradients for each category
  const getGradient = () => {
    switch (category.id) {
      case "number-logic":
        return "from-blue-500 to-cyan-500";
      case "word-logic":
        return "from-emerald-500 to-green-500";
      case "memory":
        return "from-amber-500 to-yellow-500";
      case "mixed":
        return "from-purple-500 to-indigo-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <motion.div
      className={`relative group ${isDisabled || isSelecting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onHoverStart={() => !isDisabled && !isSelecting && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => !isDisabled && !isSelecting && onSelect(category)}
      whileHover={!isDisabled && !isSelecting ? { scale: 1.02 } : {}}
      whileTap={!isDisabled && !isSelecting ? { scale: 0.98 } : {}}
      animate={isDisabled ? { opacity: 0.6 } : { opacity: 1 }}
      style={{ pointerEvents: isSelecting ? "none" : "auto" }}
    >
      {/* Card background with gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r rounded-2xl p-[2px]">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${getGradient()} rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300`}
        />
        <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-2xl" />
      </div>

      {/* Card content */}
      <div className="relative z-10 p-6 rounded-2xl">
        {/* Icon with animation */}
        <motion.div
          className={`mb-4 inline-flex p-3 rounded-xl bg-gradient-to-r ${getGradient()} text-white`}
          animate={{
            rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          {getIcon()}
        </motion.div>

        {/* Title and description */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {category.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
          {category.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              {category.stats.minutes}{" "}
              min
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BarChart3 className="w-4 h-4" />
            <span>
              {category.stats.questionsCount}{" "}
              questions
            </span>
          </div>
        </div>

        {/* Difficulty indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Difficulty:
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < (category.id === "mixed" ? 5 : 3)
                    ? `bg-gradient-to-r ${getGradient()}`
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action button */}
        <motion.button
          className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${getGradient()} text-white font-medium flex items-center justify-center gap-2 overflow-hidden relative ${isDisabled || isSelecting ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
          whileHover={!isDisabled && !isSelecting ? { scale: 1.02 } : {}}
          whileTap={!isDisabled && !isSelecting ? { scale: 0.98 } : {}}
          disabled={isDisabled || isSelecting}
        >
          <span>Start Test</span>
          <ArrowRight className="w-4 h-4" />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-25"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </div>

      {/* Loading overlay */}
      {isSelecting && (
        <motion.div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-2xl flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl border border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Animated spinner */}
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className={`w-16 h-16 border-4 border-transparent rounded-full mx-auto`}
                style={{
                  borderTopColor: `${category.id === "number-logic" ? "#3b82f6" : category.id === "word-logic" ? "#10b981" : category.id === "memory" ? "#f59e0b" : "#8b5cf6"}`
                }}
              />
              {/* Inner spinner */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-2 border-2 border-transparent rounded-full`}
                style={{
                  borderRightColor: `${category.id === "number-logic" ? "#60a5fa" : category.id === "word-logic" ? "#34d399" : category.id === "memory" ? "#fbbf24" : "#a78bfa"}40`
                }}
              />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Starting {category.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Preparing your test questions...
            </p>
            
            {/* Progress dots */}
            <motion.div className="flex justify-center space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                  className={`w-3 h-3 rounded-full`}
                  style={{
                    backgroundColor: `${category.id === "number-logic" ? "#3b82f6" : category.id === "word-logic" ? "#10b981" : category.id === "memory" ? "#f59e0b" : "#8b5cf6"}`
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Hover glow effect */}
      <AnimatePresence>
        {isHovered && !isDisabled && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${getGradient()} rounded-2xl opacity-20 blur-xl`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Background animated shapes
const BackgroundShapes = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating shapes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${
            i % 2 === 0
              ? "from-purple-400/20 to-indigo-400/20"
              : "from-blue-400/20 to-cyan-400/20"
          } backdrop-blur-3xl`}
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default function TestSelectionPage({ initialTests = TEST_TYPES }) {
  const router = useRouter();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [username, setUsername] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState({
    testsCompleted: 0,
    bestCategory: null,
    averageScore: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Refresh when page gains focus or after navigation
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Get user data from cookie
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const authenticated = isAuthenticated();

      if (!authenticated) {
        router.push("/");
        return;
      }

      // Get user data if available
      const userData = getCurrentUser();
      if (userData?.username) {
        setUsername(userData.username);
      }

      // Get test stats from local storage
      const testHistory = JSON.parse(
        localStorage.getItem("testHistory") || "{}"
      );
      let totalTests = 0;
      let totalScore = 0;
      let bestCategory = { category: null, score: 0 };

      Object.entries(testHistory).forEach(([category, tests]) => {
        if (Array.isArray(tests)) {
          totalTests += tests.length;
          tests.forEach((test) => {
            const score = test.score || 0;
            totalScore += score;
            if (score > bestCategory.score) {
              bestCategory = { category, score };
            }
          });
        }
      });

      setStats({
        testsCompleted: totalTests,
        bestCategory: bestCategory.category,
        averageScore: totalTests > 0 ? Math.round(totalScore / totalTests) : 0,
      });

      setAuthChecked(true);
    };

    checkAuth();

    // Simulate a short loading state for smooth animation
    setTimeout(() => {
      setIsAnimationComplete(true);
    }, 800);
  }, [router]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedTest(category);
    setIsNavigating(true);
    
    // Give time for the animation to show before navigating
    setTimeout(() => {
      router.push(`/tests/start?category=${category.id}`);
    }, 1200);
  };


  // Show brief loading animation
  if (!authChecked || !isAnimationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black relative">
        <BackgroundShapes />
        <Header />
        <main className="relative z-10 flex flex-col items-center pt-8 pb-16 px-4 min-h-[calc(100vh-64px)]">
          <TestSelectionLoadingAnimation />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black relative">
      {/* Animated background */}
      <BackgroundShapes />
      
      <Header />

      <main className="relative z-10 flex flex-col items-center pt-8 pb-16 px-4 min-h-[calc(100vh-64px)]">
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Hero section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <Brain className="w-10 h-10 text-purple-500" />
              <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                Test Your IQ
              </h1>
              <Zap className="w-10 h-10 text-indigo-500" />
            </motion.div>

            {username && (
              <motion.p
                className="text-xl text-gray-600 dark:text-gray-300 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome back,{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {username}
                </span>
                !
              </motion.p>
            )}

            {/* User stats */}
            {stats.testsCompleted > 0 && (
              <motion.div
                className="flex items-center justify-center gap-6 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.testsCompleted} tests completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Average: {stats.averageScore}%
                  </span>
                </div>
                {stats.bestCategory && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Best: {stats.bestCategory}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>


          {/* Test categories grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {initialTests.map((category, index) => (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.9
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }
                  }
                }}
              >
                <TestAvailability 
                  testTypeId={category.id}
                  isSelecting={isNavigating && selectedTest?.id === category.id}
                >
                  <TestCategoryCard
                    category={category}
                    onSelect={handleCategorySelect}
                    index={index}
                    isDisabled={isNavigating}
                    isSelecting={isNavigating && selectedTest?.id === category.id}
                  />
                </TestAvailability>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA section */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Challenge yourself and discover your cognitive strengths
            </p>
            <motion.button
              className="inline-flex px-6 py-3 cursor-pointer rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(168, 85, 247, 0.4)",
                  "0 0 0 20px rgba(168, 85, 247, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              onClick={() => router.push("/leaderboard")}
            >
              <span className="text-purple-600 dark:text-purple-400 font-medium uppercase">
                see how you rank among others
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
      
      {/* Full screen loader when selecting a test */}
      <FullScreenLoader 
        isLoading={isNavigating} 
        text={selectedTest ? `Preparing ${selectedTest.title}...` : "Loading test..."}
      />
    </div>
  );
}
