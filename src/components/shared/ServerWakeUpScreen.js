"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { wakeUpServer } from "@/utils/serverWakeup";
import logger from "@/utils/logger";

export default function ServerWakeUpScreen({ onComplete, showImmediately = false }) {
  const [isVisible, setIsVisible] = useState(showImmediately);
  const [progress, setProgress] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Waking up server...");

  useEffect(() => {
    if (!isVisible) return;

    const performWakeUp = async () => {
      logger.info('Starting server wake-up process', {
        event: 'server_wake_start',
        showImmediately
      });

      setStatusMessage("Starting server...");
      setProgress(10);

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev < 80) return prev + 10;
            return prev;
          });
        }, 2000);

        const result = await wakeUpServer();

        clearInterval(progressInterval);

        if (result.success) {
          setProgress(100);
          setStatusMessage("Server is ready!");
          
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.(result);
          }, 1000);
        } else {
          setStatusMessage("Server wake-up failed. You may experience slower response times.");
          setProgress(100);
          
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.(result);
          }, 2000);
        }
      } catch (error) {
        logger.exception(error, {
          event: 'server_wake_error'
        });
        
        setStatusMessage("Server wake-up encountered an error.");
        setProgress(100);
        
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.({ success: false, error: error.message });
        }, 2000);
      }
    };

    performWakeUp();
  }, [isVisible, onComplete, showImmediately]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Server Icon Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white text-2xl"
          >
            🚀
          </motion.div>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Starting Server
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {statusMessage}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
          >
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/30 w-8 skew-x-12"
            />
          </motion.div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-500">
          {progress}% complete
        </p>

        {/* Dots Animation */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}