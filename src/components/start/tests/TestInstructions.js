"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Clock,
  ListChecks,
  AlertTriangle,
} from "lucide-react";

export default function TestInstructions({ category, onStart }) {
  // Instructions content based on test category
  const instructionsContent = {
    "number-logic": {
      title: "Numerical Reasoning Test",
      description:
        "This test measures your ability to identify patterns, solve mathematical problems, and think quantitatively.",
      icon: "calculator",
      color: "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
      points: [
        "You'll be presented with mathematical patterns, sequences, and logical problems",
        "For some questions, you'll select from multiple choices",
        "For others, you'll need to type in the correct answer",
        "Work as quickly and accurately as possible",
      ],
      time: "18 minutes",
      questions: 24,
    },
    "word-logic": {
      title: "Verbal Intelligence Test",
      description:
        "This test evaluates your vocabulary, word relationships, and language comprehension skills.",
      icon: "book",
      color:
        "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
      points: [
        "You'll encounter questions about word meanings, analogies, and relationships",
        "Some questions will ask you to select the best option",
        "Others will ask you to complete words or phrases",
        "Focus on understanding the relationships between concepts",
      ],
      time: "20 minutes",
      questions: 28,
    },
    memory: {
      title: "Memory & Recall Test",
      description:
        "This test challenges your ability to memorize information and recall it accurately.",
      icon: "brain",
      color:
        "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
      points: [
        "You'll be shown pairs or triplets of words to memorize",
        "After a brief period, you'll need to recall the missing elements",
        "The test gets progressively more challenging",
        "Try to create mental associations to improve recall",
      ],
      time: "15 minutes",
      questions: 20,
    },
    mixed: {
      title: "Comprehensive IQ Test",
      description:
        "This test provides a complete evaluation of your cognitive abilities across multiple domains.",
      icon: "sparkles",
      color:
        "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
      points: [
        "Combines numerical, verbal, and memory challenges in a single test",
        "Tests a broad spectrum of cognitive abilities",
        "Questions vary in type and difficulty",
        "Provides the most comprehensive assessment of your abilities",
      ],
      time: "35 minutes",
      questions: 40,
    },
  };

  // Get content for the selected category, or fallback to mixed
  const content = instructionsContent[category] || instructionsContent["mixed"];

  // Get the appropriate icon
  const getIcon = () => {
    switch (content.icon) {
      case "calculator":
        return (
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${content.color} flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" x2="16" y1="6" y2="6" />
              <line x1="8" x2="8" y1="10" y2="10" />
              <line x1="12" x2="12" y1="10" y2="10" />
              <line x1="16" x2="16" y1="10" y2="10" />
              <line x1="8" x2="8" y1="14" y2="14" />
              <line x1="12" x2="12" y1="14" y2="14" />
              <line x1="16" x2="16" y1="14" y2="14" />
              <line x1="8" x2="8" y1="18" y2="18" />
              <line x1="12" x2="12" y1="18" y2="18" />
              <line x1="16" x2="16" y1="18" y2="18" />
            </svg>
          </div>
        );
      case "book":
        return (
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${content.color} flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
        );
      case "brain":
        return (
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${content.color} flex items-center justify-center`}
          >
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
        );
      default:
        return (
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${content.color} flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path d="M12 3v10M12 21V13M3 12h10M21 12H13M18.364 5.636l-1.5 1.5M7.05 16.95l-1.5 1.5M7.05 7.05l-1.5-1.5M18.364 18.364l-1.5-1.5" />
            </svg>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {getIcon()}
        </motion.div>

        <motion.h1
          className="text-2xl sm:text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {content.title}
        </motion.h1>

        <motion.p
          className="text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {content.description}
        </motion.p>
      </div>

      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
          <ListChecks className="w-5 h-5 mr-2 text-purple-500" />
          Test Instructions
        </h2>

        <ul className="space-y-3 mb-6">
          {content.points.map((point, index) => (
            <motion.li
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            >
              <span className="text-purple-500 dark:text-purple-400 mr-2 mt-1">
                •
              </span>
              <span className="text-gray-700 dark:text-gray-300">{point}</span>
            </motion.li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              Time: <strong>{content.time}</strong>
            </span>
          </div>

          <div className="flex items-center">
            <ListChecks className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              Questions: <strong>{content.questions}</strong>
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mb-4 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Once you start the test, a timer will begin. Try to answer all
            questions before the time runs out. Your results will be displayed
            at the end.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          onClick={onStart}
          className={`px-8 py-4 rounded-lg bg-gradient-to-r ${content.color} text-white font-medium shadow-lg cursor-pointer inline-flex items-center gap-2`}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 25px rgba(79, 70, 229, 0.35)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Test
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
