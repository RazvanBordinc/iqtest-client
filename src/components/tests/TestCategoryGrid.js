"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TestCategoryButton from "./TestCategoryButton";
import { Calculator, BookText, Brain, Sparkles } from "lucide-react";

// Enhanced test category data with better labels and descriptions
const categories = [
  {
    id: "number-logic",
    title: "Numerical Reasoning",
    description:
      "Analyze patterns, solve equations, and demonstrate mathematical intelligence",
    longDescription:
      "Test your ability to recognize numerical patterns, solve complex mathematical puzzles, and think quantitatively under time constraints.",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
    stats: {
      questionsCount: 24,
      timeLimit: "25 minutes",
      difficulty: "Adaptive",
    },
  },
  {
    id: "word-logic",
    title: "Verbal Intelligence",
    description:
      "Process language, understand relationships between words, and analyze text",
    longDescription:
      "Challenge your vocabulary knowledge, comprehension of word relationships, and ability to extract meaning from complex language structures.",
    icon: BookText,
    color:
      "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
    stats: {
      questionsCount: 28,
      timeLimit: "30 minutes",
      difficulty: "Adaptive",
    },
  },
  {
    id: "memory",
    title: "Memory & Recall",
    description:
      "Test working memory capacity, recall accuracy, and information retention",
    longDescription:
      "Evaluate your short-term memory capacity, information retention abilities, and recall accuracy across various cognitive challenges.",
    icon: Brain,
    color:
      "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
    stats: {
      questionsCount: 20,
      timeLimit: "22 minutes",
      difficulty: "Adaptive",
    },
  },
  {
    id: "mixed",
    title: "Comprehensive IQ",
    description:
      "Full cognitive assessment combining all major intelligence domains",
    longDescription:
      "A balanced assessment combining multiple cognitive domains for a complete evaluation of general intelligence and cognitive capability.",
    icon: Sparkles,
    color:
      "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
    stats: {
      questionsCount: 40,
      timeLimit: "45 minutes",
      difficulty: "Adaptive",
    },
  },
];

export default function TestCategoryGrid({ onCategorySelect }) {
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device to optimize animations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        <TestCategoryButton
          key={category.id}
          category={category}
          onSelect={() => onCategorySelect(category)}
          isMobile={isMobile}
        />
      ))}
    </motion.div>
  );
}
