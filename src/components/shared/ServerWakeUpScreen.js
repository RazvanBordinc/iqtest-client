"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Coffee, Zap, Clock } from "lucide-react";
import { wakeUpServer } from "@/utils/serverWakeup";

const ServerWakeUpScreen = ({ onComplete, showImmediately = false }) => {
  const [isVisible, setIsVisible] = useState(showImmediately);
  const [progress, setProgress] = useState(null);
  const [stage, setStage] = useState('detecting'); // 'detecting', 'waking', 'completed', 'failed'

  useEffect(() => {
    if (isVisible) {
      startWakeUpProcess();
    }
  }, [isVisible]);

  const startWakeUpProcess = async () => {
    setStage('waking');
    
    const result = await wakeUpServer((progressInfo) => {
      setProgress(progressInfo);
    });

    if (result.success) {
      setStage('completed');
      setTimeout(() => {
        onComplete?.(result);
      }, 1500); // Show success message for 1.5 seconds
    } else {
      setStage('failed');
      setTimeout(() => {
        onComplete?.(result);
      }, 2000); // Show error message for 2 seconds
    }
  };

  const triggerWakeUp = () => {
    setIsVisible(true);
  };

  // If not visible and not showing immediately, render trigger button
  if (!isVisible && !showImmediately) {
    return (
      <motion.button
        onClick={triggerWakeUp}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Coffee className="w-4 h-4" />
        Wake Up Server
      </motion.button>
    );
  }

  if (!isVisible) return null;

  const getStageIcon = () => {
    switch (stage) {
      case 'detecting':
      case 'waking':
        return Coffee;
      case 'completed':
        return Zap;
      case 'failed':
        return WifiOff;
      default:
        return Coffee;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'detecting':
      case 'waking':
        return 'text-purple-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-purple-500';
    }
  };

  const getStageMessage = () => {
    switch (stage) {
      case 'detecting':
        return 'Checking server status...';
      case 'waking':
        return progress?.message || 'Waking up server...';
      case 'completed':
        return 'Server is ready!';
      case 'failed':
        return 'Server wake-up failed. Continuing in offline mode...';
      default:
        return 'Initializing...';
    }
  };

  const StageIcon = getStageIcon();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700"
        >
          {/* Icon and Status */}
          <div className="text-center mb-6">
            <motion.div
              animate={{
                rotate: stage === 'waking' ? 360 : 0,
                scale: stage === 'completed' ? [1, 1.2, 1] : 1
              }}
              transition={{
                rotate: { duration: 2, repeat: stage === 'waking' ? Infinity : 0, ease: "linear" },
                scale: { duration: 0.5 }
              }}
              className={`w-16 h-16 mx-auto mb-4 ${getStageColor()}`}
            >
              <StageIcon className="w-full h-full" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {stage === 'detecting' && "Connecting..."}
              {stage === 'waking' && "Waking Up Server"}
              {stage === 'completed' && "Ready!"}
              {stage === 'failed' && "Connection Issues"}
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
              {getStageMessage()}
            </p>
          </div>

          {/* Progress Bar */}
          {progress && stage === 'waking' && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {progress.attempt && (
                <div className="text-center text-xs text-gray-500 mt-2">
                  Attempt {progress.attempt} of {progress.maxAttempts}
                </div>
              )}
            </div>
          )}

          {/* Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                {stage === 'waking' && "The server may take up to 60 seconds to wake up on the first request."}
                {stage === 'detecting' && "Checking if the server is responsive..."}
                {stage === 'completed' && "Server is now active and ready to handle requests."}
                {stage === 'failed' && "The application will continue to work in offline mode."}
              </span>
            </div>
          </div>

          {/* Cancel button for long waits */}
          {stage === 'waking' && progress && progress.attempt > 3 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setStage('failed');
                setTimeout(() => onComplete?.({ success: false, cancelled: true }), 1000);
              }}
              className="w-full mt-4 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Continue in Offline Mode
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServerWakeUpScreen;