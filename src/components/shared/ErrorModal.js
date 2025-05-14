"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

// Global error state management
let errorListener = null;
let setGlobalError = null;

// Function to show error from anywhere in the app
export const showError = (message) => {
  // Don't show errors on home page or if we're about to redirect
  if (typeof window !== 'undefined' && 
      (window.location.pathname === '/' || message === 'Authentication required')) {
    return;
  }
  
  if (setGlobalError) {
    setGlobalError(message);
  } else {
    // Queue the error if component is not ready yet
    setTimeout(() => showError(message), 100);
  }
};

export default function ErrorModal() {
  const [error, setError] = useState(null);

  // Set up global error handling
  useEffect(() => {
    setGlobalError = setError;

    return () => {
      setGlobalError = null;
    };
  }, []);

  const handleClose = () => setError(null);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-md w-full border border-red-200 dark:border-red-800"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start mb-4">
              <div className="mr-4 bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Error Occurred
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{error}</p>
              </div>

              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <motion.button
              className="w-full py-2 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClose}
            >
              Dismiss
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
