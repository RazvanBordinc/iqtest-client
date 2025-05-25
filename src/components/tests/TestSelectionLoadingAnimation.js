"use client";
import React from "react";
import { motion } from "framer-motion";
import { Brain, Calculator, BookOpen, Sparkles, Zap } from "lucide-react";

const TestSelectionLoadingAnimation = () => {
  const testCards = [
    { icon: Calculator, color: "from-blue-500 to-cyan-500", delay: 0 },
    { icon: BookOpen, color: "from-emerald-500 to-green-500", delay: 0.1 },
    { icon: Brain, color: "from-amber-500 to-yellow-500", delay: 0.2 },
    { icon: Sparkles, color: "from-purple-500 to-indigo-500", delay: 0.3 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Animated header skeleton */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-10 h-10 text-purple-500" />
          </motion.div>
          
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-10 h-10 text-indigo-500" />
          </motion.div>
        </div>
        
        {/* User welcome skeleton */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-24 bg-purple-200 dark:bg-purple-800 rounded animate-pulse" />
        </div>
      </motion.div>

      {/* Test cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: card.delay,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="relative"
            >
              {/* Card container */}
              <div className="relative rounded-2xl p-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Gradient overlay animation */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`}
                  animate={{
                    opacity: [0.05, 0.1, 0.05],
                  }}
                  transition={{
                    duration: 2,
                    delay: card.delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Icon */}
                <motion.div
                  className={`mb-4 inline-flex p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    y: { duration: 2, delay: card.delay, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 3, delay: card.delay, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                
                {/* Title skeleton */}
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                
                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                
                {/* Stats skeleton */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                
                {/* Button skeleton */}
                <motion.div
                  className={`w-full py-3 rounded-lg bg-gradient-to-r ${card.color} opacity-20`}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: card.delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              {/* Availability check animation */}
              <motion.div
                className="absolute top-3 right-3 flex items-center gap-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: card.delay + 0.5, type: "spring" }}
              >
                <motion.div
                  className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    delay: card.delay + 0.6,
                    repeat: Infinity,
                  }}
                />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Stats skeleton */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex items-center gap-8 bg-gray-100 dark:bg-gray-800 rounded-full px-8 py-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TestSelectionLoadingAnimation;