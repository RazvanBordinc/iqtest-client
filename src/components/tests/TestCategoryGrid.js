"use client";

import React from "react";
import { motion } from "framer-motion";
import TestCategoryButton from "./TestCategoryButton";
import { Calculator, BookText, Brain, Sparkles } from "lucide-react";

// Test category data with better labels
const categories = [
  {
    id: "number-logic",
    title: "Numerical Reasoning",
    description:
      "Test your ability to analyze numerical patterns and solve mathematical puzzles",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
  },
  {
    id: "word-logic",
    title: "Verbal Intelligence",
    description:
      "Challenge your vocabulary, word relationships, and language comprehension",
    icon: BookText,
    color:
      "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
  },
  {
    id: "memory",
    title: "Memory & Recall",
    description:
      "Evaluate your short-term memory and information retention abilities",
    icon: Brain,
    color:
      "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
  },
  {
    id: "mixed",
    title: "Comprehensive IQ",
    description:
      "A balanced assessment combining multiple cognitive domains for a complete evaluation",
    icon: Sparkles,
    color:
      "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
  },
];

export default function TestCategoryGrid({ onCategorySelect }) {
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        <TestCategoryButton
          key={category.id}
          category={category}
          onSelect={() => onCategorySelect(category)}
        />
      ))}
    </motion.div>
  );
}
