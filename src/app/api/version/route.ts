import { NextResponse } from 'next/server';
import { CURRENT_VERSION } from '@/utils/versionManager';

// API route to provide current version information
export async function GET() {
  try {
    // Return current version info with cache-busting headers
    return NextResponse.json(CURRENT_VERSION, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Version API error:', error);
    return NextResponse.json(
      { error: 'Failed to get version info' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}