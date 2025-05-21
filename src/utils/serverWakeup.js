// src/utils/serverWakeup.js
import logger from '@/utils/logger';

const BACKEND_URL = process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL || 'https://iqtest-server-tkhl.onrender.com';

// Wake up the server and return status
export const wakeUpServer = async (onProgress = null) => {
  const startTime = Date.now();
  const maxAttempts = 12; // Try for up to 60 seconds (12 attempts * 5 second intervals)
  let attempt = 0;
  
  logger.info('Starting server wake-up process', {
    event: 'server_wake_start',
    backend: BACKEND_URL
  });

  while (attempt < maxAttempts) {
    attempt++;
    const attemptStart = Date.now();
    
    try {
      // Update progress
      if (onProgress) {
        onProgress({
          attempt,
          maxAttempts,
          message: attempt === 1 ? 'Connecting to server...' : `Waking up server... (${attempt}/${maxAttempts})`,
          percentage: (attempt / maxAttempts) * 100
        });
      }

      // Try to wake up the server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout per attempt
      
      const response = await fetch(`${BACKEND_URL}/api/health/wake`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        const totalTime = Date.now() - startTime;
        
        logger.info('Server wake-up successful', {
          event: 'server_wake_success',
          attempt,
          totalTime: `${totalTime}ms`,
          isColdStart: data.IsColdStart
        });
        
        if (onProgress) {
          onProgress({
            attempt,
            maxAttempts,
            message: data.IsColdStart ? 'Server awakened successfully!' : 'Server was already active!',
            percentage: 100,
            success: true
          });
        }
        
        return {
          success: true,
          attempts: attempt,
          totalTime,
          isColdStart: data.IsColdStart,
          message: data.Message
        };
      }
    } catch (error) {
      const attemptTime = Date.now() - attemptStart;
      
      logger.warn('Server wake-up attempt failed', {
        event: 'server_wake_attempt_failed',
        attempt,
        attemptTime: `${attemptTime}ms`,
        error: error.message
      });
      
      // Wait before next attempt (progressive backoff)
      if (attempt < maxAttempts) {
        const delay = Math.min(2000 + (attempt * 500), 5000); // 2-5 second delay, increasing
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All attempts failed
  const totalTime = Date.now() - startTime;
  
  logger.error('Server wake-up failed after all attempts', {
    event: 'server_wake_failed',
    totalAttempts: maxAttempts,
    totalTime: `${totalTime}ms`
  });
  
  if (onProgress) {
    onProgress({
      attempt: maxAttempts,
      maxAttempts,
      message: 'Server wake-up failed. Using offline mode.',
      percentage: 100,
      success: false
    });
  }
  
  return {
    success: false,
    attempts: maxAttempts,
    totalTime,
    message: 'Server wake-up failed after all attempts'
  };
};

// Quick server availability check
export const isServerAwake = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${BACKEND_URL}/api/health/ping`, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Get server status information
export const getServerStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        available: true,
        ...data
      };
    }
    
    return { available: false };
  } catch (error) {
    return { available: false, error: error.message };
  }
};