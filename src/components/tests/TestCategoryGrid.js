"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TestCategoryButton from "./TestCategoryButton";
import { Calculator, BookText, Brain, Sparkles } from "lucide-react";

export default function TestCategoryGrid({ categories, onCategorySelect }) {
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

  // Map string icon names to actual components
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "Calculator":
        return Calculator;
      case "BookText":
        return BookText;
      case "Brain":
        return Brain;
      case "Sparkles":
        return Sparkles;
      default:
        return Sparkles;
    }
  };

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

  // Process categories to include actual icon components
  const processedCategories = categories.map((category) => ({
    ...category,
    icon: getIconComponent(category.icon),
  }));

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {processedCategories.map((category) => (
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
