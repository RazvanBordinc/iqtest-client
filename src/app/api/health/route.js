export async function GET() {
  try {
    // Simple health check endpoint
    return Response.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}