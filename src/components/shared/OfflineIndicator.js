"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if we're in offline mode
    const offlineMode = localStorage.getItem('offline_mode') === 'true';
    setIsOffline(offlineMode);
    
    // Only show banner if we're offline
    if (offlineMode) {
      setShowBanner(true);
      
      // Auto-hide banner after 5 seconds
      const timerId = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      
      return () => clearTimeout(timerId);
    }
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <>
      {/* Fixed indicator that always shows */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-full shadow-md"
        >
          <CloudOff className="h-4 w-4" />
          <span className="text-sm font-medium">Offline Mode</span>
        </motion.div>
      </div>
      
      {/* Banner notification that auto-hides */}
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-amber-100 border-b border-amber-300 p-3 z-50"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800">
              <CloudOff className="h-5 w-5" />
              <p>
                <span className="font-bold">Offline Mode Active:</span> Some features may be limited and your progress won't be saved to the server.
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-amber-600 hover:text-amber-800"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}