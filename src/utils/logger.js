// src/utils/logger.js

/**
 * Centralized logging utility for the IQ Test frontend application
 * This integrates with Vercel's logging system when deployed
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
};

// Get the current environment
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isVercel = typeof process.env.VERCEL_ENV !== 'undefined';

/**
 * Send logs to Vercel Analytics when running on Vercel
 */
const sendToVercel = async (level, message, meta = {}) => {
  if (!isVercel) return;
  
  try {
    // Add timestamp for Vercel logs correlation
    const timestamp = new Date().toISOString();
    
    // Prepare log payload
    const payload = {
      level,
      message,
      ...meta,
      timestamp,
      source: 'frontend'
    };
    
    // Use Vercel's edge runtime logging capabilities
    if (typeof fetch !== 'undefined') {
      // Post to Vercel log endpoint
      // When in production, we use _vercel/insights API endpoint
      const url = '/api/log';
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // Don't wait for the log to complete to avoid slowing down the app
        keepalive: true
      }).catch(() => {
        // Silent catch - we don't want logging failures to break the app
      });
    }
  } catch (error) {
    // Fallback to console if Vercel logging fails
    console.error('Vercel logging failed:', error);
  }
};

/**
 * Format logs consistently
 */
const formatLog = (level, message, meta = {}) => {
  // Add user session/context information when available
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
    ...(userId ? { userId } : {}),
    environment: isProduction ? 'production' : (isDevelopment ? 'development' : 'unknown')
  };
};

/**
 * Main logger functions
 */
const logger = {
  error: (message, meta = {}) => {
    const formattedLog = formatLog(LOG_LEVELS.ERROR, message, meta);
    
    // Always log errors to console
    console.error(message, formattedLog);
    
    // Send to Vercel
    sendToVercel(LOG_LEVELS.ERROR, message, meta);
    
    return formattedLog;
  },
  
  warn: (message, meta = {}) => {
    const formattedLog = formatLog(LOG_LEVELS.WARN, message, meta);
    
    console.warn(message, formattedLog);
    sendToVercel(LOG_LEVELS.WARN, message, meta);
    
    return formattedLog;
  },
  
  info: (message, meta = {}) => {
    const formattedLog = formatLog(LOG_LEVELS.INFO, message, meta);
    
    // Only log info in development to console
    if (isDevelopment) {
      console.info(message, formattedLog);
    }
    
    // But always send to Vercel 
    sendToVercel(LOG_LEVELS.INFO, message, meta);
    
    return formattedLog;
  },
  
  debug: (message, meta = {}) => {
    const formattedLog = formatLog(LOG_LEVELS.DEBUG, message, meta);
    
    // Only log debug in development
    if (isDevelopment) {
      console.debug(message, formattedLog);
    }
    
    // Only send debug logs to Vercel in non-production environments
    if (!isProduction) {
      sendToVercel(LOG_LEVELS.DEBUG, message, meta);
    }
    
    return formattedLog;
  },
  
  // Log errors with stack traces (for exceptions)
  exception: (error, meta = {}) => {
    const message = error?.message || 'Unknown error';
    const stack = error?.stack || new Error().stack;
    
    return logger.error(message, { ...meta, stack });
  },
  
  // Log user actions (for analytics)
  userAction: (action, metadata = {}) => {
    return logger.info(`User Action: ${action}`, { 
      ...metadata, 
      type: 'user_action'
    });
  },
  
  // Log API calls (for debugging)
  api: (endpoint, status, metadata = {}) => {
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    const message = `API ${metadata.method || 'GET'} ${endpoint}: ${status}`;
    
    return logger[level === LOG_LEVELS.ERROR ? 'error' : 'info'](
      message, 
      { ...metadata, type: 'api_call' }
    );
  },
  
  // Log page transitions
  pageView: (page, metadata = {}) => {
    return logger.info(`Page View: ${page}`, { 
      ...metadata, 
      type: 'page_view'
    });
  },
  
  // Log test submissions
  testAction: (testType, action, metadata = {}) => {
    return logger.info(`Test ${action}: ${testType}`, { 
      ...metadata, 
      type: 'test_action'
    });
  },
  
  // Log authentication events
  auth: (event, metadata = {}) => {
    return logger.info(`Auth: ${event}`, { 
      ...metadata, 
      type: 'auth_event'
    });
  }
};

export default logger;