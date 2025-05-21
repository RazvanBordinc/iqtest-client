#!/usr/bin/env node

/**
 * API Health Check Script
 * 
 * This script checks the connectivity between the frontend and backend APIs.
 * 
 * Usage:
 *   node scripts/check-api.js
 * 
 * Options:
 *   --url <url>   Backend URL to check (default: http://localhost:5164)
 *   --help        Show this help message
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Parse command line arguments
const args = process.argv.slice(2);
let backendUrl = 'http://localhost:5164';
let help = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && i + 1 < args.length) {
    backendUrl = args[i + 1];
    i++;
  } else if (args[i] === '--help') {
    help = true;
  }
}

if (help) {
  console.log(`
API Health Check Script

This script checks the connectivity between the frontend and backend APIs.

Usage:
  node scripts/check-api.js

Options:
  --url <url>   Backend URL to check (default: http://localhost:5164)
  --help        Show this help message
  `);
  process.exit(0);
}

// Function to make an HTTP request with a timeout
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = protocol.get(url, {
      timeout: 5000,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = data.length > 0 ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            data: data,
            parseError: error.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

async function checkHealth() {
  console.log('API Health Check');
  console.log('================');
  console.log(`\nChecking backend API at: ${backendUrl}`);
  
  try {
    // Check if the backend has a health endpoint
    console.log('\n1. Backend Health Check:');
    try {
      const healthResponse = await makeRequest(`${backendUrl}/api/health`);
      console.log(`   Status: ${healthResponse.statusCode} ${healthResponse.statusMessage}`);
      
      if (healthResponse.statusCode === 200) {
        console.log('   ✅ Backend health endpoint is responding');
        console.log(`   Result: ${JSON.stringify(healthResponse.data, null, 2)}`);
      } else {
        console.log('   ❌ Backend health endpoint returned an error');
        console.log(`   Error: ${healthResponse.statusCode} ${healthResponse.statusMessage}`);
      }
    } catch (error) {
      console.log(`   ❌ Could not connect to backend health endpoint: ${error.message}`);
    }
    
    // Check if the test types endpoint works
    console.log('\n2. Test Types Endpoint:');
    try {
      const testTypesResponse = await makeRequest(`${backendUrl}/api/test/types`);
      console.log(`   Status: ${testTypesResponse.statusCode} ${testTypesResponse.statusMessage}`);
      
      if (testTypesResponse.statusCode === 200) {
        console.log('   ✅ Test types endpoint is responding');
        if (Array.isArray(testTypesResponse.data)) {
          console.log(`   Found ${testTypesResponse.data.length} test types`);
        } else {
          console.log(`   Unexpected response format: ${typeof testTypesResponse.data}`);
        }
      } else {
        console.log('   ❌ Test types endpoint returned an error');
        console.log(`   Error: ${testTypesResponse.statusCode} ${testTypesResponse.statusMessage}`);
      }
    } catch (error) {
      console.log(`   ❌ Could not connect to test types endpoint: ${error.message}`);
    }
    
    // Check CORS headers
    console.log('\n3. CORS Headers Check:');
    try {
      const corsResponse = await makeRequest(`${backendUrl}/api/health`, {
        headers: {
          'Origin': 'https://example.com'
        }
      });
      
      const corsHeaders = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers',
        'access-control-allow-credentials'
      ];
      
      const foundCorsHeaders = corsHeaders.filter(header => 
        Object.keys(corsResponse.headers).some(h => h.toLowerCase() === header)
      );
      
      if (foundCorsHeaders.length > 0) {
        console.log('   ✅ CORS headers detected:');
        corsHeaders.forEach(header => {
          const headerValue = Object.entries(corsResponse.headers)
            .find(([key]) => key.toLowerCase() === header)?.[1];
          
          if (headerValue) {
            console.log(`   - ${header}: ${headerValue}`);
          }
        });
      } else {
        console.log('   ⚠️ No CORS headers detected. Cross-origin requests may fail.');
      }
    } catch (error) {
      console.log(`   ❌ Could not check CORS headers: ${error.message}`);
    }
    
    console.log('\n4. Environment Check:');
    try {
      const env = {
        'Node.js version': process.version,
        'Platform': process.platform,
        'Backend URL': backendUrl,
      };
      
      console.log('   Environment details:');
      for (const [key, value] of Object.entries(env)) {
        console.log(`   - ${key}: ${value}`);
      }
    } catch (error) {
      console.log(`   ❌ Could not get environment details: ${error.message}`);
    }
    
    console.log('\n===================================');
    console.log('Health check completed');
    
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// Run the health check
checkHealth();