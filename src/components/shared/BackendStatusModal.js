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
  const [offlineMode, setOfflineMode] = useState(false);
  const [checkFailures, setCheckFailures] = useState(0);
  
  // Check backend status directly on mount
  useEffect(() => {
    let timerInterval = null;
    let checkInterval = null;
    
    const checkBackendStatus = async () => {
      setCheckingStatus(true);
      
      try {
        // Directly check backend health endpoint
        const response = await fetch(`${api.baseUrl}/api/health`, { 
          method: 'GET',
          cache: 'no-store',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          // Backend is active, hide modal
          setShowModal(false);
          setOfflineMode(false);
          setCheckFailures(0);
          clearInterval(timerInterval);
          clearInterval(checkInterval);
        } else {
          // Backend returned error status, show modal
          setShowModal(true);
          setCheckFailures(prev => prev + 1);
          
          // If we've been checking for a while with no success, enable offline mode
          if (checkFailures > 10) { // After ~50 seconds of failures
            setOfflineMode(true);
          }
        }
      } catch (error) {
        // Connection error, backend might be starting up
        console.warn('Backend connection error:', error);
        setShowModal(true);
        setCheckFailures(prev => prev + 1);
        
        // If we've been checking for a while with no success, enable offline mode
        if (checkFailures > 10) { // After ~50 seconds of failures
          setOfflineMode(true);
        }
      } finally {
        setCheckingStatus(false);
      }
    };

    // Set up status listener (Using the compatibility adapter)
    const unsubscribe = api.addBackendStatusListener(({ isActive }) => {
      // With direct access, isActive should always be true
      // But we'll do a real check to make sure
      if (!isActive) {
        checkBackendStatus();
      }
    });
    
    // Initial check
    checkBackendStatus();
    
    // Set up regular checks if the modal is shown
    if (showModal) {
      // Start countdown timer
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
    
    return () => {
      unsubscribe();
      if (timerInterval) clearInterval(timerInterval);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [checkFailures]);
  
  // Update estimated time based on timer
  useEffect(() => {
    setEstimatedTimeLeft(timerInSeconds);
  }, [timerInSeconds]);
  
  // Handle continue in offline mode
  const handleContinueOffline = () => {
    setShowModal(false);
    // Store a flag that we're in offline mode
    localStorage.setItem('offline_mode', 'true');
    // Set a cookie for server-side awareness
    document.cookie = 'offline_mode=true; path=/; max-age=3600';
  };
  
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
                {offlineMode ? 'Backend Service Unavailable' : 'Backend Service Starting'}
              </h2>
              
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {offlineMode 
                  ? 'The backend service on Render appears to be unreachable. You can continue in offline mode with limited functionality.' 
                  : 'The backend service is spinning up on Render. This may take up to 60 seconds due to free tier limitations.'}
              </p>
              
              {!offlineMode && (
                <>
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
                </>
              )}
              
              {offlineMode && (
                <div className="mt-6">
                  <button
                    onClick={handleContinueOffline}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Continue in Offline Mode
                  </button>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    In offline mode, you can explore the app with sample data and limited functionality.
                    Your progress will not be saved to the backend.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}