"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/shared/ThemeProvider";
import Header from "@/components/start/Header";
import TestCategoryGrid from "./TestCategoryGrid";
import TestScoreDisplay from "./TestScoreDisplay";

export default function ClientWrapper() {
  const { mounted } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Don't render until client-side mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
      <Header showTimer={false} />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          <motion.div
            className="bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-800 rounded-xl backdrop-blur-md border shadow-lg p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Choose Your Test
            </motion.h1>

            <motion.p
              className="text-gray-600 dark:text-gray-300 text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Select a test category to challenge different aspects of your
              intelligence
            </motion.p>

            {selectedCategory ? (
              <TestScoreDisplay
                category={selectedCategory}
                onBack={() => setSelectedCategory(null)}
              />
            ) : (
              <TestCategoryGrid onCategorySelect={handleCategorySelect} />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
