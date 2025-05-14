"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import TestCategoryGrid from "./TestCategoryGrid";
import Header from "@/components/start/Header";
import { TEST_TYPES } from "../constants/testTypes";
import { isAuthenticated, getCurrentUser } from "@/fetch/auth";

export default function TestSelectionPage({ initialTests = TEST_TYPES }) {
  const router = useRouter();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [username, setUsername] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

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
      
      setAuthChecked(true);
    };
    
    checkAuth();
    
    // Simulate a short loading state for smooth animation
    setTimeout(() => {
      setIsAnimationComplete(true);
    }, 800);
  }, []); // Remove router dependency to prevent infinite loop

  // Handle category selection
  const handleCategorySelect = (category) => {
    // Redirect to test start page with selected category
    router.push(`/tests/start?category=${category.id}`);
  };

  // Background decoration elements for visual appeal
  const BackgroundDecorations = () => (
    <>
      <motion.div
        className="fixed top-20 right-20 w-72 h-72 rounded-full bg-purple-200 dark:bg-purple-900/20 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />

      <motion.div
        className="fixed bottom-20 left-10 w-60 h-60 rounded-full bg-blue-200 dark:bg-blue-900/20 blur-3xl opacity-70"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />
    </>
  );

  // Show brief loading animation
  if (!authChecked || !isAnimationComplete) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-center">
          <LoadingAnimation />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black relative overflow-hidden">
      {/* Background decorations */}
      <BackgroundDecorations />

      <Header />

      <main className="relative z-10 flex flex-col items-center pt-8 pb-16 px-4 min-h-[calc(100vh-64px)]">
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* User greeting */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400"
              initial={{ letterSpacing: "0px" }}
              animate={{ letterSpacing: "1px" }}
              transition={{ duration: 1 }}
            >
              {username ? `Welcome, ${username}!` : "Welcome to TestIQ"}
            </motion.h1>

            <motion.div
              className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mt-3 mb-6"
              initial={{ width: 0 }}
              animate={{ width: "5rem" }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.div>

          {/* Main content with test categories */}
          <motion.div
            className="relative bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="p-6 sm:p-10">
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Choose Your Test
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 dark:text-gray-300 text-center mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Select a test category to challenge different aspects of your
                intelligence and discover your cognitive strengths
              </motion.p>

              <TestCategoryGrid
                categories={initialTests}
                onCategorySelect={handleCategorySelect}
              />
            </div>

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
