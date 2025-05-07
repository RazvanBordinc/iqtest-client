"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles, Loader2 } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";
import Header from "@/components/start/Header";
import TestCategoryGrid from "./TestCategoryGrid";
import TestScoreDisplay from "./TestScoreDisplay";

export default function ClientWrapper() {
  const { mounted, theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Get username from localStorage on mount
  useEffect(() => {
    if (mounted) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        setUsername(userData.username || "");
      } catch (error) {
        console.error("Error reading user data:", error);
      }

      // Simulate loading for a smooth entrance
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      // Detect if on mobile for performance optimization
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", checkMobile);
      };
    }
  }, [mounted]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Don't render until client-side mounted to prevent hydration issues
  if (!mounted) return null;

  // Loading animation
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mx-auto mb-6 relative"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <BrainCircuit className="h-20 w-20 text-purple-600 dark:text-purple-500" />
            <motion.div
              className="absolute inset-0 blur-lg opacity-70"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <BrainCircuit className="h-20 w-20 text-purple-500" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-xl font-medium text-gray-800 dark:text-gray-200"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Preparing your tests...
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black text-black dark:text-white">
      {/* Animated background elements - only on desktop for performance */}
      {!isMobile && (
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

          <motion.div
            className="fixed top-1/3 left-1/4 w-40 h-40 rounded-full bg-indigo-200 dark:bg-indigo-900/20 blur-3xl opacity-60"
            animate={{
              x: [0, 40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Floating sparkles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="fixed"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            >
              <Sparkles className="w-4 h-4 text-purple-400 dark:text-purple-600" />
            </motion.div>
          ))}
        </>
      )}

      <Header showTimer={false} />

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

          {/* Main content card with glass effect */}
          <motion.div
            className="relative bg-white/90 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 
                      rounded-2xl backdrop-blur-md shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* Card inner content */}
            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory ? "detail" : "grid"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {selectedCategory ? (
                    <TestScoreDisplay
                      category={selectedCategory}
                      onBack={() => setSelectedCategory(null)}
                    />
                  ) : (
                    <>
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
                        Select a test category to challenge different aspects of
                        your intelligence and discover your cognitive strengths
                      </motion.p>

                      <TestCategoryGrid
                        onCategorySelect={handleCategorySelect}
                      />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
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
