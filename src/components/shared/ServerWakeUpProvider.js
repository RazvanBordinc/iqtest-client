"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import ServerWakeUpScreen from "./ServerWakeUpScreen";
import { wakeUpServer, isServerAwake } from "@/utils/serverWakeup";
import logger from "@/utils/logger";

const ServerWakeUpContext = createContext();

export const useServerWakeUp = () => {
  const context = useContext(ServerWakeUpContext);
  if (!context) {
    throw new Error("useServerWakeUp must be used within ServerWakeUpProvider");
  }
  return context;
};

export const ServerWakeUpProvider = ({ children }) => {
  const [isServerReady, setIsServerReady] = useState(false);
  const [isWaking, setIsWaking] = useState(false);
  const [showWakeUpScreen, setShowWakeUpScreen] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const wakeUpPromiseRef = useRef(null);

  // Check server status on mount
  useEffect(() => {
    const checkInitialServerStatus = async () => {
      // Skip check in development to avoid delays
      if (process.env.NODE_ENV === 'development') {
        setIsServerReady(true);
        setInitialCheckDone(true);
        return;
      }

      try {
        logger.info('Checking initial server status', {
          event: 'initial_server_check'
        });

        const serverAwake = await isServerAwake();
        
        if (serverAwake) {
          logger.info('Server is already awake', {
            event: 'server_already_awake'
          });
          setIsServerReady(true);
        } else {
          logger.info('Server needs wake-up', {
            event: 'server_needs_wakeup'
          });
          setShowWakeUpScreen(true);
        }
      } catch (error) {
        logger.error('Initial server check failed', {
          event: 'initial_server_check_error',
          error: error.message
        });
        // Show wake-up screen on error
        setShowWakeUpScreen(true);
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkInitialServerStatus();
  }, []);

  // Handle wake-up screen completion
  const handleWakeUpComplete = (result) => {
    setShowWakeUpScreen(false);
    setIsWaking(false);
    
    if (result.success) {
      setIsServerReady(true);
      logger.info('Server wake-up completed successfully', {
        event: 'wakeup_success',
        attempts: result.attempts,
        totalTime: result.totalTime
      });
    } else {
      logger.warn('Server wake-up failed, continuing in degraded mode', {
        event: 'wakeup_failed',
        attempts: result.attempts
      });
      // Still set server as "ready" to allow app to function
      setIsServerReady(true);
    }

    wakeUpPromiseRef.current = null;
  };

  // Function to trigger wake-up manually
  const triggerWakeUp = async () => {
    if (isWaking || wakeUpPromiseRef.current) {
      return wakeUpPromiseRef.current;
    }

    setIsWaking(true);
    setShowWakeUpScreen(true);

    wakeUpPromiseRef.current = new Promise((resolve) => {
      // The promise will be resolved when handleWakeUpComplete is called
      const originalHandler = handleWakeUpComplete;
      handleWakeUpComplete = (result) => {
        originalHandler(result);
        resolve(result);
      };
    });

    return wakeUpPromiseRef.current;
  };

  // Function to ensure server is ready before an operation
  const ensureServerReady = async () => {
    if (isServerReady) {
      return true;
    }

    if (isWaking || wakeUpPromiseRef.current) {
      const result = await wakeUpPromiseRef.current;
      return result.success;
    }

    const result = await triggerWakeUp();
    return result.success;
  };

  // Enhanced API wrapper that handles cold starts
  const withServerWakeUp = async (apiFunction, ...args) => {
    try {
      return await apiFunction(...args);
    } catch (error) {
      // Check if error indicates a cold start
      const coldStartIndicators = [
        'timeout',
        'aborted', 
        'fetch',
        'network',
        'Failed to fetch',
        'Service temporarily unavailable',
        'server may be waking up'
      ];

      const errorMessage = error?.message?.toLowerCase() || '';
      const isColdStart = error?.isServerSleep === true ||
                         error?.status === 503 ||
                         error?.status === 408 ||
                         coldStartIndicators.some(indicator => errorMessage.includes(indicator));

      if (isColdStart && !isWaking) {
        logger.info('Cold start detected, triggering wake-up', {
          event: 'cold_start_detected',
          error: error.message,
          status: error.status
        });

        await triggerWakeUp();
        
        // Retry the API call
        try {
          return await apiFunction(...args);
        } catch (retryError) {
          logger.error('API retry failed after wake-up', {
            event: 'retry_failed',
            error: retryError.message
          });
          throw retryError;
        }
      }

      throw error;
    }
  };

  const contextValue = {
    isServerReady,
    isWaking,
    triggerWakeUp,
    ensureServerReady,
    withServerWakeUp
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
};