// src/components/tests/LoggingTestComponent.js
'use client';
import { useState } from 'react';
import logger from '@/utils/logger';
import api from '@/fetch/api';

const LoggingTestComponent = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const testFrontendLogging = () => {
    setLoading(true);
    setError(null);
    
    // Test different log levels
    logger.info('Info log test from LoggingTestComponent', {
      component: 'LoggingTestComponent',
      action: 'testFrontendLogging',
      timestamp: new Date().toISOString()
    });
    
    logger.warn('Warning log test from LoggingTestComponent', {
      component: 'LoggingTestComponent',
      action: 'testFrontendLogging',
      severity: 'medium'
    });
    
    logger.error('Error log test from LoggingTestComponent', {
      component: 'LoggingTestComponent',
      action: 'testFrontendLogging',
      simulated: true
    });
    
    logger.debug('Debug log test from LoggingTestComponent', {
      component: 'LoggingTestComponent',
      action: 'testFrontendLogging',
      details: 'This is a debug message'
    });
    
    // Test user action tracking
    logger.userAction('logging_test_clicked', {
      location: 'LoggingTestComponent',
      timestamp: new Date().toISOString()
    });
    
    // Test page view tracking
    logger.pageView('logging-test-page', {
      referrer: window.location.pathname
    });
    
    // Test error capturing
    try {
      throw new Error('Test error for logging');
    } catch (err) {
      logger.exception(err, {
        component: 'LoggingTestComponent',
        action: 'testFrontendLogging'
      });
    }
    
    setResults({
      frontendLogs: {
        info: 'Info log sent',
        warn: 'Warning log sent',
        error: 'Error log sent',
        debug: 'Debug log sent',
        userAction: 'User action log sent',
        pageView: 'Page view log sent',
        exception: 'Exception log sent'
      }
    });
    
    setLoading(false);
  };
  
  const testBackendLogging = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Log the API call attempt
      logger.api('/api/logging-test/frontend', 0, {
        method: 'GET',
        component: 'LoggingTestComponent',
        action: 'testBackendLogging'
      });
      
      const response = await api.get('/logging-test/frontend');
      
      // Log the API call success
      logger.api('/api/logging-test/frontend', 200, {
        method: 'GET',
        component: 'LoggingTestComponent',
        action: 'testBackendLogging',
        responseTime: Date.now() - performance.now()
      });
      
      setResults(prev => ({
        ...prev,
        backendLogs: {
          status: 'Success',
          serverMessage: response.message,
          serverTimestamp: response.timestamp,
          environment: response.environment
        }
      }));
    } catch (err) {
      // Log the API call failure
      logger.api('/api/logging-test/frontend', err.status || 500, {
        method: 'GET',
        component: 'LoggingTestComponent',
        action: 'testBackendLogging',
        error: err.message
      });
      
      setError(err.message || 'Failed to test backend logging');
    } finally {
      setLoading(false);
    }
  };
  
  const testCompleteSystem = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. First log frontend activity
      logger.info('Complete system test started', {
        component: 'LoggingTestComponent',
        action: 'testCompleteSystem'
      });
      
      // 2. Test frontend-to-backend communication
      const response = await api.get('/logging-test/test');
      
      // 3. Log the successful test
      logger.info('Complete system test successful', {
        component: 'LoggingTestComponent',
        action: 'testCompleteSystem',
        serverResponse: response.message
      });
      
      setResults(prev => ({
        ...prev,
        completeSystemTest: {
          status: 'Success',
          message: 'Complete logging system test successful',
          serverResponse: response.message,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (err) {
      logger.error('Complete system test failed', {
        component: 'LoggingTestComponent',
        action: 'testCompleteSystem',
        error: err.message
      });
      
      setError(err.message || 'Failed to complete system test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Logging Test Panel</h2>
      
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <button
            onClick={testFrontendLogging}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Test Frontend Logging
          </button>
          
          <button
            onClick={testBackendLogging}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Test Backend Logging
          </button>
          
          <button
            onClick={testCompleteSystem}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            Test Complete System
          </button>
        </div>
        
        {loading && (
          <div className="text-gray-600 dark:text-gray-300">
            Testing logging system...
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-100">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {results && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Test Results</h3>
            
            {results.frontendLogs && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Frontend Logs</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                  {Object.entries(results.frontendLogs).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {results.backendLogs && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Backend Logs</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                  <li>Status: {results.backendLogs.status}</li>
                  <li>Server Message: {results.backendLogs.serverMessage}</li>
                  <li>Server Environment: {results.backendLogs.environment}</li>
                </ul>
              </div>
            )}
            
            {results.completeSystemTest && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Complete System Test</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                  <li>Status: {results.completeSystemTest.status}</li>
                  <li>Message: {results.completeSystemTest.message}</li>
                  <li>Server Response: {results.completeSystemTest.serverResponse}</li>
                </ul>
              </div>
            )}
            
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Note: Check the browser console and server logs to see the full log output.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoggingTestComponent;