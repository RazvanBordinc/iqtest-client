"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TestCategoryButton from "./TestCategoryButton";
import { Calculator, BookText, Brain, Sparkles } from "lucide-react";
import { checkBatchTestAvailability } from "@/fetch/tests";

export default function TestCategoryGridWithBatch({ categories, onCategorySelect }) {
  const [isMobile, setIsMobile] = useState(false);
  const [availabilities, setAvailabilities] = useState({});
  const [loading, setLoading] = useState(true);

  // Check for mobile device to optimize animations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Batch check all test availabilities at once
  useEffect(() => {
    async function checkAllAvailabilities() {
      try {
        setLoading(true);
        const testTypeIds = categories.map(cat => cat.id);
        const results = await checkBatchTestAvailability(testTypeIds);
        setAvailabilities(results);
      } catch (error) {
        console.error("Error checking batch test availability:", error);
        // Set all as available on error
        const fallbackAvailabilities = {};
        categories.forEach(cat => {
          fallbackAvailabilities[cat.id] = { canTake: true, timeUntilNext: null };
        });
        setAvailabilities(fallbackAvailabilities);
      } finally {
        setLoading(false);
      }
    }

    checkAllAvailabilities();
    // Refresh every minute
    const interval = setInterval(checkAllAvailabilities, 60000);
    return () => clearInterval(interval);
  }, [categories]);

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

  // Process categories to include actual icon components and availability
  const processedCategories = categories.map((category) => ({
    ...category,
    icon: getIconComponent(category.icon),
    availability: availabilities[category.id] || { canTake: true, timeUntilNext: null },
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
          availability={category.availability}
          loading={loading}
        />
      ))}
    </motion.div>
  );
}