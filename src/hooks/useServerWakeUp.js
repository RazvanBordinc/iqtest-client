// src/hooks/useServerWakeUp.js
import { useState, useCallback } from 'react';
import { isServerAwake, wakeUpServer } from '@/utils/serverWakeup';
import logger from '@/utils/logger';

export const useServerWakeUp = () => {
  const [isWaking, setIsWaking] = useState(false);
  const [wakeUpProgress, setWakeUpProgress] = useState(null);

  const checkAndWakeServer = useCallback(async (forceWakeUp = false) => {
    try {
      // If not forcing wake-up, check if server is already awake
      if (!forceWakeUp) {
        const serverAwake = await isServerAwake();
        if (serverAwake) {
          return { success: true, alreadyAwake: true };
        }
      }

      // Server needs wake-up
      setIsWaking(true);
      setWakeUpProgress({ message: 'Starting server wake-up...', percentage: 0 });

      const result = await wakeUpServer((progress) => {
        setWakeUpProgress(progress);
      });

      setIsWaking(false);
      setWakeUpProgress(null);

      return result;
    } catch (error) {
      logger.error('Server wake-up hook error', {
        event: 'hook_wake_up_error',
        error: error.message
      });

      setIsWaking(false);
      setWakeUpProgress(null);

      return { success: false, error: error.message };
    }
  }, []);

  const detectColdStartFromError = useCallback((error) => {
    // Check if error indicates a cold start scenario
    const coldStartIndicators = [
      'timeout',
      'aborted',
      'fetch',
      'network',
      'Failed to fetch',
      'Request timed out'
    ];

    const errorMessage = error?.message?.toLowerCase() || '';
    return coldStartIndicators.some(indicator => errorMessage.includes(indicator));
  }, []);

  const withServerWakeUp = useCallback(async (apiFunction, ...args) => {
    try {
      // Try the API function first
      return await apiFunction(...args);
    } catch (error) {
      // If error indicates cold start, wake up server and retry
      if (detectColdStartFromError(error)) {
        logger.info('Cold start detected, attempting server wake-up', {
          event: 'cold_start_retry',
          originalError: error.message
        });

        const wakeUpResult = await checkAndWakeServer(true);
        
        if (wakeUpResult.success) {
          // Server is awake, retry the original function
          logger.info('Server wake-up successful, retrying API call', {
            event: 'cold_start_retry_success'
          });
          return await apiFunction(...args);
        } else {
          // Wake-up failed, throw original error
          logger.warn('Server wake-up failed, throwing original error', {
            event: 'cold_start_retry_failed',
            wakeUpError: wakeUpResult.error
          });
          throw error;
        }
      } else {
        // Not a cold start error, throw original error
        throw error;
      }
    }
  }, [checkAndWakeServer, detectColdStartFromError]);

  return {
    isWaking,
    wakeUpProgress,
    checkAndWakeServer,
    detectColdStartFromError,
    withServerWakeUp
  };
};