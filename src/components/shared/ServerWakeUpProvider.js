"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isServerAwake } from "@/utils/serverWakeup";
import ServerWakeUpScreen from "./ServerWakeUpScreen";
import logger from "@/utils/logger";

const ServerWakeUpContext = createContext();

export const useServerWakeUp = () => {
  const context = useContext(ServerWakeUpContext);
  if (!context) {
    throw new Error("useServerWakeUp must be used within ServerWakeUpProvider");
  }
  return context;
};

export function ServerWakeUpProvider({ children }) {
  const [isServerReady, setIsServerReady] = useState(true); // Assume ready initially
  const [showWakeUpScreen, setShowWakeUpScreen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Check server status on mount
  useEffect(() => {
    const checkInitialServerStatus = async () => {
      logger.info('Checking initial server status', {
        event: 'server_status_initial_check'
      });
      
      const awake = await isServerAwake();
      setIsServerReady(awake);
      
      if (!awake) {
        logger.warn('Server appears to be sleeping, may need wake-up', {
          event: 'server_status_sleeping'
        });
      }
    };

    checkInitialServerStatus();
  }, []);

  const triggerWakeUp = async () => {
    if (isChecking) return false;
    
    setIsChecking(true);
    
    // First check if server is already awake
    const awake = await isServerAwake();
    if (awake) {
      setIsServerReady(true);
      setIsChecking(false);
      return true;
    }
    
    // Server needs wake-up
    setShowWakeUpScreen(true);
    return false;
  };

  const handleWakeUpComplete = (result) => {
    setShowWakeUpScreen(false);
    setIsServerReady(result.success);
    setIsChecking(false);
    
    logger.info('Server wake-up process completed', {
      event: 'server_wake_completed',
      success: result.success,
      attempts: result.attempts || result.attempt
    });
  };

  const contextValue = {
    isServerReady,
    isChecking,
    triggerWakeUp,
    checkServerStatus: async () => {
      const awake = await isServerAwake();
      setIsServerReady(awake);
      return awake;
    }
  };

  return (
    <ServerWakeUpContext.Provider value={contextValue}>
      {children}
      {showWakeUpScreen && (
        <ServerWakeUpScreen 
          onComplete={handleWakeUpComplete}
          showImmediately={true}
        />
      )}
    </ServerWakeUpContext.Provider>
  );
}