const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method === 'GET') {
    const data = await env.TRIP_DATA.get('trip_data');
    return new Response(data ?? 'null', {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  if (request.method === 'PUT') {
    const body = await request.text();
    try {
      JSON.parse(body);
    } catch {
      return new Response('Invalid JSON', { status: 400, headers: CORS });
    }
    await env.TRIP_DATA.put('trip_data', body);
    return new Response('ok', { headers: CORS });
  }

  return new Response('Method not allowed', { status: 405, headers: CORS });
}
