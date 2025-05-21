// src/app/api/log/route.js
import { NextResponse } from 'next/server';

// Handler for receiving logs from the client side
export async function POST(request) {
  try {
    const logData = await request.json();
    
    // Add server information to the log
    const enrichedLog = {
      ...logData,
      source: 'frontend',
      serverTimestamp: new Date().toISOString(),
      vercelEnv: process.env.VERCEL_ENV || 'local',
      deploymentUrl: process.env.VERCEL_URL || 'localhost',
      region: process.env.VERCEL_REGION || 'local'
    };
    
    // In production, logs will automatically be collected by Vercel
    // We just need to output them to stdout/stderr with proper formatting
    
    // Format the log based on severity level
    const logString = JSON.stringify(enrichedLog);
    
    switch (logData.level) {
      case 'error':
        console.error(logString);
        break;
      case 'warn':
        console.warn(logString);
        break;
      case 'info':
        console.info(logString);
        break;
      case 'debug':
      case 'trace':
      default:
        console.log(logString);
        break;
    }
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing log:', error);
    return NextResponse.json(
      { error: 'Failed to process log' },
      { status: 500 }
    );
  }
}

// Optional handler for log statistics or status
export async function GET() {
  return NextResponse.json(
    { status: 'Logging system operational' },
    { status: 200 }
  );
}