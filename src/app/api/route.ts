import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests to /api
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
}

// Handle HEAD requests to /api
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': '0',
    }
  });
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, HEAD, OPTIONS',
      'Content-Length': '0',
    }
  });
}