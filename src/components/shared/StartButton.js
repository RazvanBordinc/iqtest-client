"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

// Using memo to prevent unnecessary re-renders
const StartButton = memo(function StartButton({
  showButton,
  genderSelected = true,
}) {
  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2,
          }}
          className="mt-6"
        >
          <Link href="/start" passHref>
            <motion.button
              className={`relative ${
                genderSelected
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700"
                  : "bg-gradient-to-r from-purple-500/70 to-indigo-500/70 dark:from-purple-600/70 dark:to-indigo-600/70"
              } text-white px-8 py-4 rounded-lg text-xl font-bold 
              shadow-[0_0_15px_rgba(138,43,226,0.4)] overflow-hidden`}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(138, 43, 226, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Light shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
              />

              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-3">
                Start IQ Test
                {!genderSelected ? (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <AlertCircle className="w-5 h-5 text-yellow-300" />
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                )}
              </span>
            </motion.button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default StartButton;
