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
      'Request timed out',
      'Server is starting up',
      'sleep'
    ];

    const errorMessage = error?.message?.toLowerCase() || '';
    const hasServerSleepFlag = error?.isServerSleep === true;
    const isTimeoutError = error?.status === 408;
    
    return hasServerSleepFlag || isTimeoutError || 
           coldStartIndicators.some(indicator => errorMessage.includes(indicator));
  }, []);

  const withServerWakeUp = useCallback(async (apiFunction, ...args) => {
    let lastError;
    const maxAttempts = 2; // Original attempt + 1 retry after wake-up
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Try the API function
        return await apiFunction(...args);
      } catch (error) {
        lastError = error;
        
        // If error indicates cold start and this is first attempt, try wake-up
        if (attempt === 0 && detectColdStartFromError(error)) {
          logger.info('Cold start detected, attempting server wake-up', {
            event: 'cold_start_retry',
            originalError: error.message,
            status: error.status
          });

          const wakeUpResult = await checkAndWakeServer(true);
          
          if (wakeUpResult.success) {
            // Server is awake, continue to retry
            logger.info('Server wake-up successful, retrying API call', {
              event: 'cold_start_retry_success'
            });
            continue;
          } else {
            // Wake-up failed, log but still try one more time
            logger.warn('Server wake-up failed, but will try API call once more', {
              event: 'cold_start_retry_failed',
              wakeUpError: wakeUpResult.error
            });
          }
        } else {
          // Not a cold start error or final attempt, break
          break;
        }
      }
    }
    
    // All attempts failed, throw the last error
    throw lastError;
  }, [checkAndWakeServer, detectColdStartFromError]);

  return {
    isWaking,
    wakeUpProgress,
    checkAndWakeServer,
    detectColdStartFromError,
    withServerWakeUp
  };
};