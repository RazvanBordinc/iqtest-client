"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Trophy, User } from "lucide-react";
import Link from "next/link";
import Timer from "./Timer";
import ThemeToggle from "../shared/ThemeToggle";
import { useTheme } from "../shared/ThemeProvider";

export default function Header({
  totalSeconds,
  onTimeFinish,
  showTimer = true,
}) {
  const { mounted } = useTheme();

  if (!mounted) return null;

  return (
    <motion.header
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo and title */}
        <div className="flex items-center">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <BrainCircuit className="w-7 h-7 text-purple-500 mr-3" />
          </motion.div>
          <h1 className=" text-2xl font-bold text-gray-900 dark:text-white">
            TestIQ
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center flex-wrap gap-1 sm:gap-3">
          <Link href="/leaderboards" passHref>
            <motion.div
              className="flex items-center px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">Leaderboards</span>
            </motion.div>
          </Link>

          <Link href="/account" passHref>
            <motion.div
              className="flex items-center px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">Account</span>
            </motion.div>
          </Link>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* Timer */}
          {showTimer && totalSeconds && (
            <div className="ml-1 sm:ml-2">
              <Timer totalSeconds={totalSeconds} onTimeFinish={onTimeFinish} />
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
