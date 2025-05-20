"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CloudCog, Server, Clock } from 'lucide-react';
import api from '@/fetch/api';

export default function BackendStatusModal() {
  const [showModal, setShowModal] = useState(false);
  const [timerInSeconds, setTimerInSeconds] = useState(60);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(60);
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  // Listen for backend status changes
  useEffect(() => {
    let timerInterval = null;
    let checkInterval = null;
    
    const checkBackendStatus = async () => {
      setCheckingStatus(true);
      const isActive = await api.checkBackendStatus();
      setCheckingStatus(false);
      
      if (isActive) {
        // Backend is active, hide modal
        setShowModal(false);
        clearInterval(timerInterval);
      }
    };
    
    // Set up status listener
    const unsubscribe = api.addBackendStatusListener(({ isActive, spinUpInProgress }) => {
      setShowModal(spinUpInProgress && !isActive);
      
      if (spinUpInProgress && !isActive) {
        // Start countdown timer
        if (!timerInterval) {
          setTimerInSeconds(60);
          timerInterval = setInterval(() => {
            setTimerInSeconds(prev => {
              if (prev <= 1) {
                // When timer reaches 0, check status again
                checkBackendStatus();
                return 60; // Reset timer
              }
              return prev - 1;
            });
          }, 1000);
          
          // Also check status periodically
          checkInterval = setInterval(() => {
            checkBackendStatus();
          }, 5000); // Check every 5 seconds
        }
      } else {
        // Clear intervals when not needed
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }
    });
    
    // Initial check
    checkBackendStatus();
    
    return () => {
      unsubscribe();
      if (timerInterval) clearInterval(timerInterval);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);
  
  // Update estimated time based on timer
  useEffect(() => {
    setEstimatedTimeLeft(timerInSeconds);
  }, [timerInSeconds]);
  
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-6 mx-4 bg-white rounded-xl shadow-xl dark:bg-gray-800"
          >
            <div className="text-center">
              <motion.div 
                className="mx-auto flex justify-center mb-4 text-purple-600 dark:text-purple-500"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <CloudCog className="h-16 w-16" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Backend Service Starting
              </h2>
              
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                The backend service is spinning up on Render. This may take up to 60 seconds due to free tier limitations.
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Server className="h-5 w-5 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {checkingStatus ? 'Checking status...' : `Estimated time: ~${estimatedTimeLeft} seconds`}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
                <motion.div 
                  className="bg-purple-600 h-2.5 rounded-full dark:bg-purple-500"
                  style={{ width: `${100 - (timerInSeconds / 60 * 100)}%` }}
                />
              </div>
              
              {/* Loading spinner */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="flex justify-center mb-4"
              >
                <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-500" />
              </motion.div>
              
              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>Checking every 5 seconds</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}