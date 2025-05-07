"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Calculator, BookText, Brain, Sparkles } from "lucide-react";

export default function LeaderboardTabs({ options, activeTab, setActiveTab }) {
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [activeTabEl, setActiveTabEl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
    if (activeTabEl) {
      const { offsetWidth, offsetLeft } = activeTabEl;
      setIndicatorWidth(offsetWidth);
      setIndicatorLeft(offsetLeft);
    }
  }, [activeTabEl, activeTab]);

  // Get icon based on tab id
  const getTabIcon = (id) => {
    switch (id) {
      case "global":
        return <Trophy className="w-4 h-4 mr-2" />;
      case "number-logic":
        return <Calculator className="w-4 h-4 mr-2" />;
      case "word-logic":
        return <BookText className="w-4 h-4 mr-2" />;
      case "memory":
        return <Brain className="w-4 h-4 mr-2" />;
      case "mixed":
        return <Sparkles className="w-4 h-4 mr-2" />;
      default:
        return <Trophy className="w-4 h-4 mr-2" />;
    }
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Custom styles based on which tab is active
  const getActiveStyles = (tabId) => {
    switch (tabId) {
      case "global":
        return "text-amber-600 dark:text-amber-400";
      case "number-logic":
        return "text-blue-600 dark:text-blue-400";
      case "word-logic":
        return "text-emerald-600 dark:text-emerald-400";
      case "memory":
        return "text-amber-600 dark:text-amber-400";
      case "mixed":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-purple-600 dark:text-purple-400";
    }
  };

  // Indicator color based on active tab
  const getIndicatorColor = () => {
    switch (activeTab) {
      case "global":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600";
      case "number-logic":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600";
      case "word-logic":
        return "bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600";
      case "memory":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600";
      case "mixed":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600";
      default:
        return "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600";
    }
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
      <div className="flex overflow-x-auto hide-scrollbar py-2 px-1">
        {options.map((option) => (
          <button
            key={option.id}
            ref={(el) => {
              if (option.id === activeTab) {
                setActiveTabEl(el);
              }
            }}
            onClick={() => handleTabChange(option.id)}
            className={`relative px-4 py-2 rounded-lg flex items-center whitespace-nowrap font-medium text-gray-600 dark:text-gray-300 transition-colors cursor-pointer ${
              activeTab === option.id
                ? getActiveStyles(option.id)
                : "hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {getTabIcon(option.id)}
            {option.label}

            {/* Tab glow effect when active */}
            {activeTab === option.id && (
              <motion.div
                className="absolute inset-0 -z-10 rounded-lg opacity-10"
                layoutId="tab-glow"
                transition={{ duration: 0.3 }}
                initial={false}
              />
            )}
          </button>
        ))}
      </div>

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
