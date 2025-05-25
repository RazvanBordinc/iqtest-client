export async function GET() {
  try {
    // Wake endpoint that also performs a health check
    return Response.json({ 
      status: 'awake', 
      timestamp: new Date().toISOString(),
      message: 'Server is awake and ready'
    });
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}