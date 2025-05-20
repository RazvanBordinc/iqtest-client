"use client";

import React, { useState, useEffect } from "react";
import { Lock, Clock, CheckCircle } from "lucide-react";
import { checkTestAvailability } from "@/fetch/tests";

const TestAvailability = ({ testTypeId, children }) => {
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
      const availability = await checkTestAvailability(testTypeId);
      setIsAvailable(availability.canTake);
      if (!availability.canTake && availability.timeUntilNext) {
        setTimeRemaining(availability.timeUntilNext);
      }
    } catch (error) {
      console.error("Error checking test availability:", error);
      setIsAvailable(true); // Allow test in case of error
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl" />
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
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl flex items-center justify-center cursor-not-allowed">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <Lock className="w-10 h-10 text-gray-500 dark:text-gray-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Test Locked</p>
            {timeRemaining && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTimeRemaining(timeRemaining)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      {/* Small indicator for available tests */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Available</span>
      </div>
    </div>
  );
};

export default TestAvailability;