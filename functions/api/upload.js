const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('Invalid form data', { status: 400, headers: CORS });
  }

  const file = formData.get('file');
  const evId = formData.get('evId');

  if (!file || !evId) {
    return new Response('Missing file or evId', { status: 400, headers: CORS });
  }

  const buffer = await file.arrayBuffer();

  await env.TRIP_FILES.put(evId, buffer, {
    httpMetadata: {
      contentType: file.type || 'application/octet-stream',
      contentDisposition: `inline; filename="${file.name}"`,
    },
    customMetadata: {
      originalName: file.name,
      fileSize: String(file.size),
      fileType: file.type,
    },
  });

  return new Response(
    JSON.stringify({ ok: true, name: file.name, size: file.size, type: file.type }),
    { headers: { ...CORS, 'Content-Type': 'application/json' } }
  );
}
