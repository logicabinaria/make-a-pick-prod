export async function onRequestPost(context: {
  request: Request;
  env: Record<string, unknown>;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
}) {
  try {
    const body = await context.request.json() as { options: string[] };
    const { options } = body;

    // Validate input
    if (!Array.isArray(options) || options.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 options are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Validate that all options are strings
    if (!options.every(option => typeof option === 'string' && option.trim().length > 0)) {
      return new Response(
        JSON.stringify({ error: 'All options must be non-empty strings' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Randomly select one option
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];

    return new Response(
      JSON.stringify({ pick: selectedOption }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error) {
    console.error('Error in pick API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}