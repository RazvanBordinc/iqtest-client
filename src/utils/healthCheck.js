// Health Check Utility
// Use this file to diagnose API connectivity issues

// Helper to fetch the health endpoint
export async function checkHealth() {
  try {
    // Frontend health check
    console.log('Checking frontend health...');
    const frontendResponse = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!frontendResponse.ok) {
      console.error('❌ Frontend health check failed:', frontendResponse.status, frontendResponse.statusText);
      return {
        frontend: { status: 'down', message: frontendResponse.statusText },
        backend: { status: 'unknown' }
      };
    }
    
    console.log('✅ Frontend health check successful');
    const frontendData = await frontendResponse.json();
    
    // Extract backend status from frontend health response
    return {
      frontend: { 
        status: 'up',
        environment: frontendData.environment,
        timestamp: frontendData.timestamp
      },
      backend: frontendData.backend || { status: 'unknown' }
    };
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return {
      frontend: { status: 'error', message: error.message },
      backend: { status: 'unknown' }
    };
  }
}

// Get the current API configuration
export function getApiConfiguration() {
  return {
    clientApiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    serverApiUrl: process.env.NEXT_SERVER_API_URL || 'http://backend:5164',
    environment: process.env.NODE_ENV || 'development'
  };
}

// Function to run a simple connectivity test
export async function runConnectivityTest() {
  const results = {
    config: getApiConfiguration(),
    health: await checkHealth(),
    endpoints: {},
    timestamp: new Date().toISOString()
  };
  
  // Try to fetch the test types as a connectivity test
  try {
    const testTypesResponse = await fetch('/api/test/types', {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (testTypesResponse.ok) {
      results.endpoints['test/types'] = {
        status: 'ok',
        statusCode: testTypesResponse.status
      };
      
      // Try to parse the response
      try {
        const testTypes = await testTypesResponse.json();
        results.endpoints['test/types'].data = 
          Array.isArray(testTypes) ? `Array with ${testTypes.length} items` : typeof testTypes;
      } catch (parseError) {
        results.endpoints['test/types'].parseError = parseError.message;
      }
    } else {
      results.endpoints['test/types'] = {
        status: 'error',
        statusCode: testTypesResponse.status,
        statusText: testTypesResponse.statusText
      };
    }
  } catch (error) {
    results.endpoints['test/types'] = {
      status: 'error',
      message: error.message
    };
  }
  
  // Try to fetch a second endpoint to confirm
  try {
    const healthResponse = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-store',
    });
    
    results.endpoints['health'] = {
      status: healthResponse.ok ? 'ok' : 'error',
      statusCode: healthResponse.status,
      statusText: healthResponse.statusText
    };
  } catch (error) {
    results.endpoints['health'] = {
      status: 'error',
      message: error.message
    };
  }
  
  return results;
}