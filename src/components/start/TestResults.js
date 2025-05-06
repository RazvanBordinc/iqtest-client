// app/start/components/TestResults.js
"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function TestResults({
  answers,
  totalQuestions,
  calculateScore,
}) {
  return (
    <motion.div
      className="bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800 shadow-[0_0_30px_rgba(79,70,229,0.2)] p-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative inline-block"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full opacity-40 blur-md bg-green-500"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-white mt-6 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Test Completed!
        </motion.h2>
        <motion.p
          className="text-gray-300 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Thank you for completing the IQ assessment.
        </motion.p>
      </div>

      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Sparkles className="w-6 h-6 text-yellow-400 mr-3" />
          Your Results
        </h3>

        <div className="bg-black/40 p-8 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-300 text-lg">Questions Answered</span>
            <span className="font-medium text-white text-xl bg-gray-800 px-4 py-1 rounded-lg">
              {Object.keys(answers).length}{" "}
              <span className="text-gray-400 text-sm">/ {totalQuestions}</span>
            </span>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-lg">Your Score</span>
              <div className="relative">
                <motion.span
                  className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  {calculateScore()}%
                </motion.span>
                <motion.div
                  className="absolute -inset-4 rounded-lg opacity-20 blur-md"
                  animate={{
                    background: [
                      "radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(0,0,0,0) 70%)",
                      "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(0,0,0,0) 70%)",
                      "radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(0,0,0,0) 70%)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>

            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${calculateScore()}%` }}
                transition={{ duration: 1.5, delay: 1.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    delay: 2.7,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              Want to improve your score? Challenge yourself again with our
              adaptive IQ test.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-lg shadow-lg"
              onClick={() => window.location.reload()}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(138, 43, 226, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
