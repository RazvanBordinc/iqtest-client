"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, BookText, Brain, Sparkles } from "lucide-react";
import { TEST_TYPES } from "../constants/testTypes";

export default function LeaderboardTabs({ activeTab, setActiveTab }) {
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [tabRefs, setTabRefs] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Create tab options from test types
  const options = TEST_TYPES.map((type) => {
    let icon;
    switch (type.icon) {
      case "Calculator":
        icon = Calculator;
        break;
      case "BookText":
        icon = BookText;
        break;
      case "Brain":
        icon = Brain;
        break;
      case "Sparkles":
        icon = Sparkles;
        break;
      default:
        icon = Calculator;
        break;
    }

    return {
      id: type.id,
      label: type.shortTitle || type.title,
      icon: icon,
      gradient: type.color,
    };
  });

  // Detect mobile devices for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeEl = tabRefs[activeTab];
    if (activeEl) {
      const { offsetWidth, offsetLeft } = activeEl;
      setIndicatorWidth(offsetWidth);
      setIndicatorLeft(offsetLeft);
    }
  }, [activeTab, tabRefs, isMobile]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Custom styles based on which tab is active
  const getActiveStyles = (tabId) => {
    const testType = TEST_TYPES.find((type) => type.id === tabId);
    if (!testType) return "text-purple-600 dark:text-purple-400";

    // Extract color from test type gradient classes
    if (testType.id === "number-logic") {
      return "text-blue-600 dark:text-blue-400";
    } else if (testType.id === "word-logic") {
      return "text-emerald-600 dark:text-emerald-400";
    } else if (testType.id === "memory") {
      return "text-amber-600 dark:text-amber-400";
    } else if (testType.id === "mixed") {
      return "text-purple-600 dark:text-purple-400";
    }

    return "text-purple-600 dark:text-purple-400";
  };

  // Indicator color based on active tab
  const getIndicatorColor = () => {
    const testType = TEST_TYPES.find((type) => type.id === activeTab);
    return (
      testType?.color ||
      "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600"
    );
  };

  // For mobile devices, show a dropdown instead of tabs
  if (isMobile) {
    return (
      <div className="mb-6 relative">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer text-gray-800 dark:text-white font-medium"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version with animated tabs
  return (
    <div className="relative mb-6">
      <motion.div 
        className="flex overflow-x-auto hide-scrollbar py-2 px-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              ref={(el) => {
                if (el) {
                  setTabRefs(prev => {
                    if (prev[option.id] !== el) {
                      return {
                        ...prev,
                        [option.id]: el
                      };
                    }
                    return prev;
                  });
                }
              }}
              onClick={() => handleTabChange(option.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-4 py-2 rounded-lg flex items-center whitespace-nowrap font-medium transition-all duration-300 cursor-pointer ${
                activeTab === option.id
                  ? getActiveStyles(option.id)
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <option.icon className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5 transition-colors duration-300 ${
                activeTab === option.id ? '' : 'text-gray-500'
              }`} />
              <span className="hidden sm:inline">{option.label}</span>

              {/* Tab background effect when active */}
              <AnimatePresence>
                {activeTab === option.id && (
                  <motion.div
                    className={`absolute inset-0 -z-10 rounded-lg bg-gradient-to-r ${option.gradient}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Animated indicator */}
      <motion.div
        className={`absolute bottom-0 h-1 rounded-full ${getIndicatorColor()}`}
        style={{
          width: indicatorWidth,
          left: indicatorLeft,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        layoutId="tab-indicator"
      />
    </div>
  );
}
