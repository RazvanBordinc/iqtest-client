"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Clock, CheckCircle, Loader2 } from "lucide-react";
import { checkTestAvailability } from "@/fetch/tests";

const TestAvailability = ({ testTypeId, children, isSelecting = false }) => {
  const [isAvailable, setIsAvailable] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [testTypeId]);

  const checkAvailability = async () => {
    try {
      // Add a minimum loading time to prevent flash
      const startTime = Date.now();
      const availability = await checkTestAvailability(testTypeId);
      
      setIsAvailable(availability.canTake);
      if (!availability.canTake && availability.timeUntilNext) {
        setTimeRemaining(availability.timeUntilNext);
      }
      
      // Ensure minimum loading time of 800ms for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsedTime);
      
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
      
    } catch (error) {
      console.error("Error checking test availability:", error);
      setIsAvailable(true); // Allow test in case of error
      
      // Still respect minimum loading time even on error
      const remainingTime = 800;
      
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  const formatTimeRemaining = (seconds) => {
    if (!seconds) return "";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Show loading skeleton only for availability check, not for test selection
  // (test selection has its own fancy loading overlay in TestCategoryCard)
  if (loading && !isSelecting) {
    return (
      <div className="relative">
        {children}
        <motion.div 
          className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="relative">
        {/* Apply blur filter to the children content */}
        <div className="filter blur-[2px] pointer-events-none">
          {children}
        </div>
        {/* Overlay with lock indicator */}
        <motion.div 
          className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl flex items-center justify-center cursor-not-allowed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.5,
                delay: 0.3
              }}
            >
              <Lock className="w-10 h-10 text-gray-500 dark:text-gray-400 mx-auto mb-3" />
            </motion.div>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Test Locked</p>
            {timeRemaining && (
              <motion.p 
                className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-4 h-4" />
                </motion.div>
                {formatTimeRemaining(timeRemaining)}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      {/* Small indicator for available tests */}
      <AnimatePresence>
        <motion.div 
          className="absolute top-3 right-3 flex items-center gap-1"
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 0.6,
              delay: 0.5
            }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
          <motion.span 
            className="text-xs text-green-600 dark:text-green-400 font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            Available
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestAvailability;