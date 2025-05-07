// app/start/components/TimeUpMessage.js
"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function TimeUpMessage({ setTestComplete }) {
  return (
    <motion.div
      className="bg-gray-900/80 rounded-xl border border-red-600/50 backdrop-blur-md p-10 text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="relative inline-block">
          <AlertTriangle className="w-20 h-20 mx-auto text-red-500 mb-4" />
          <motion.div
            className="absolute inset-0 text-red-500 opacity-30 blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <AlertTriangle className="w-20 h-20" />
          </motion.div>
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-4">Time"s Up!</h2>
      <p className="text-gray-300 mb-8 text-lg">
        Your answers have been automatically submitted for evaluation.
      </p>

      <motion.button
        className="px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 shadow-xl shadow-purple-900/20"
        onClick={() => setTestComplete(true)}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px rgba(138, 43, 226, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        View Your Results
      </motion.button>
    </motion.div>
  );
}
