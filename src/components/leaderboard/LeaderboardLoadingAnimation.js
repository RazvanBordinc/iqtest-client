"use client";
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";

const LeaderboardLoadingAnimation = () => {
  const positions = [
    { icon: Crown, color: "from-yellow-400 to-amber-500", delay: 0 },
    { icon: Trophy, color: "from-gray-400 to-gray-500", delay: 0.1 },
    { icon: Medal, color: "from-orange-400 to-orange-600", delay: 0.2 },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Podium animation */}
      <div className="flex items-end gap-4 mb-8">
        {positions.map((position, index) => {
          const Icon = position.icon;
          const height = index === 0 ? "h-24" : index === 1 ? "h-20" : "h-16";
          
          return (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: position.delay, duration: 0.6 }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: index === 0 ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: position.delay },
                  rotate: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: position.delay },
                }}
                className="mb-2"
              >
                <div className={`p-3 rounded-full bg-gradient-to-br ${position.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                className={`w-16 ${height} bg-gradient-to-b ${position.color} rounded-t-lg`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: position.delay + 0.3, duration: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Loading text with animated dots */}
      <motion.div
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-lg font-medium">Loading rankings</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"
              animate={{
                y: ["0%", "-50%", "0%"],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Skeleton table rows */}
      <motion.div
        className="w-full max-w-2xl mt-8 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            {/* Rank skeleton */}
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            
            {/* Name skeleton */}
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
            </div>
            
            {/* Score skeleton */}
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Star className="w-4 h-4 text-yellow-500" />
              </motion.div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LeaderboardLoadingAnimation;