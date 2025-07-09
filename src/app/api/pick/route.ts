import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { options } = body;

    // Validate input
    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 options are required' },
        { status: 400 }
      );
    }

    // Validate that all options are strings
    if (!options.every(option => typeof option === 'string' && option.trim().length > 0)) {
      return NextResponse.json(
        { error: 'All options must be non-empty strings' },
        { status: 400 }
      );
    }

    // Randomly select one option
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];

    return NextResponse.json({ pick: selectedOption });
  } catch (error) {
    console.error('Error in pick API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}