import logger from '@/utils/logger';

const BACKEND_URL = process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL || 'https://iqtest-server-tkhl.onrender.com';

export async function isServerAwake() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      credentials: 'omit', // Don't include credentials for health checks
      mode: 'cors'
    });
    
    return response.ok;
  } catch (error) {
    logger.warn('Server health check failed', {
      event: 'server_health_check_failed',
      error: error.message
    });
    return false;
  }
}

export async function wakeUpServer() {
  const maxAttempts = 5;
  const baseDelay = 2000; // Start with 2 seconds
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const startTime = performance.now();
      
      logger.info('Attempting server wake-up', {
        event: 'server_wake_attempt',
        attempt,
        maxAttempts
      });
      
      const response = await fetch(`${BACKEND_URL}/api/health/wake`, {
        method: 'GET',
        credentials: 'omit',
        mode: 'cors',
        signal: AbortSignal.timeout(60000) // 60 second timeout per attempt for Render cold starts
      });
      
      const duration = performance.now() - startTime;
      
      if (response.ok) {
        logger.info('Server wake-up successful', {
          event: 'server_wake_success',
          attempt,
          duration: `${Math.round(duration)}ms`
        });
        
        return { 
          success: true, 
          attempt, 
          duration: Math.round(duration),
          message: 'Server is awake and ready'
        };
      } else {
        logger.warn('Server wake-up attempt failed', {
          event: 'server_wake_attempt_failed',
          attempt,
          status: response.status,
          attemptTime: `${Math.round(duration)}ms`
        });
      }
    } catch (error) {
      const duration = performance.now ? performance.now() - performance.now() : 0;
      
      logger.warn('Server wake-up attempt failed', {
        event: 'server_wake_attempt_failed',
        attempt,
        error: error.message,
        attemptTime: `${Math.round(duration)}ms`
      });
    }
    
    // Wait before next attempt (exponential backoff)
    if (attempt < maxAttempts) {
      const delay = baseDelay * Math.pow(1.5, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  logger.error('Server wake-up failed after all attempts', {
    event: 'server_wake_failed',
    maxAttempts
  });
  
  return { 
    success: false, 
    attempts: maxAttempts,
    message: 'Unable to wake server after multiple attempts'
  };
}