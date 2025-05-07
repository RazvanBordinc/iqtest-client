"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TestCategoryButton({ category, onSelect }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const Icon = category.icon;

  // Conditional rendering based on device type
  if (isMobile) {
    // Mobile version - simplified animations
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 cursor-pointer"
        variants={itemVariants}
        onClick={onSelect}
        style={{ touchAction: "manipulation" }}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {category.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {category.description}
          </p>
        </div>
      </motion.div>
    );
  }

  // Desktop version - with full animations
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 cursor-pointer relative overflow-hidden"
      variants={itemVariants}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        borderColor: `rgb(139, 92, 246)`,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 bg-gradient-to-r from-indigo-500 to-purple-500"
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1.1, opacity: 0.15 }}
        transition={{ duration: 1 }}
      />

      <div className="flex flex-col items-center relative z-10">
        <motion.div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 shadow-lg`}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px rgba(104, 58, 175, 0.5)",
          }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {category.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          {category.description}
        </p>
      </div>

      {/* Bottom accent */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
