"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerWakeUp } from "@/hooks/useServerWakeUp";
import logger from "@/utils/logger";

export default function BackendStatusModal() {
  const { isServerReady, isChecking, triggerWakeUp } = useServerWakeUp();
  const [showModal, setShowModal] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  useEffect(() => {
    // Show modal if server is not ready and we haven't shown warning yet
    if (!isServerReady && !hasShownWarning && !isChecking) {
      setShowModal(true);
      setHasShownWarning(true);
      
      logger.info('Showing backend status modal', {
        event: 'backend_status_modal_shown',
        serverReady: isServerReady
      });
    }
  }, [isServerReady, hasShownWarning, isChecking]);

  const handleWakeUp = async () => {
    logger.info('User triggered manual server wake-up', {
      event: 'manual_server_wake_triggered'
    });
    
    const success = await triggerWakeUp();
    if (success) {
      setShowModal(false);
    }
  };

  const handleContinue = () => {
    logger.info('User chose to continue without server wake-up', {
      event: 'continue_without_wake'
    });
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Warning Icon */}
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
              className="mx-auto mb-4 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center"
            >
              <span className="text-amber-600 dark:text-amber-400 text-2xl">⚠️</span>
            </motion.div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Server Status
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              The server appears to be sleeping. This is normal for free hosting. 
              You can wake it up now or continue - it will start automatically when needed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
              
              <motion.button
                onClick={handleWakeUp}
                disabled={isChecking}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isChecking
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                }`}
              >
                {isChecking ? 'Waking...' : 'Wake Server'}
              </motion.button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-3">
              First-time startup may take up to 60 seconds
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}