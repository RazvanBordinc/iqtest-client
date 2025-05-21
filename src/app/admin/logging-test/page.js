// src/app/admin/logging-test/page.js
import { Suspense } from 'react';
import LoggingTestComponent from '@/components/tests/LoggingTestComponent';

export const metadata = {
  title: 'Logging Test Page',
  description: 'Test page for logging functionality',
};

export default function LoggingTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Logging System Test
      </h1>
      
      <div className="max-w-3xl mx-auto">
        <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">
          This page allows you to test the frontend and backend logging systems.
          Results will be visible in both client-side console and server-side logs.
        </p>
        
        <Suspense fallback={<div className="text-center">Loading test component...</div>}>
          <LoggingTestComponent />
        </Suspense>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
            Logging Details
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Frontend Logging:</strong> Uses custom logger utility with structured logging, 
            includes Vercel integration for production logs.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Backend Logging:</strong> Uses structured logging with Render integration 
            for production logs. Captures HTTP requests with detailed timing.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Redis Logging:</strong> Tracks Redis operations with Upstash integration,
            including timing metrics and operation success.
          </p>
        </div>
      </div>
    </div>
  );
}