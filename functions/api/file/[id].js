const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function onRequest({ request, env, params }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method === 'GET') {
    const obj = await env.TRIP_FILES.get(params.id);
    if (!obj) {
      return new Response('File not found', { status: 404, headers: CORS });
    }
    const headers = new Headers(CORS);
    obj.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'private, max-age=3600');
    return new Response(obj.body, { headers });
  }

  if (request.method === 'DELETE') {
    await env.TRIP_FILES.delete(params.id);
    return new Response('ok', { headers: CORS });
  }

  return new Response('Method not allowed', { status: 405, headers: CORS });
}
