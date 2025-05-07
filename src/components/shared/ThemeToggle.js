"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  // Don't render anything until mounted on client to avoid hydration errors
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md border border-yellow-300/50 dark:border-purple-400/50 backdrop-blur-sm cursor-pointer group"
      whileHover={{
        scale: 1.1,
        boxShadow: isDark
          ? "0 0 15px rgba(168, 85, 247, 0.4)"
          : "0 0 15px rgba(252, 211, 77, 0.4)",
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <motion.div
              className="absolute inset-0 blur-sm opacity-40"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <motion.div
              className="absolute inset-0 blur-sm opacity-40"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
