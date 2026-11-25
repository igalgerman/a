// Family save storage for "המסע של אורן" (Cloudflare Pages Function + KV binding SAVES).
// The id is a random 128-bit family code that only family devices know.
const H = { 'content-type': 'application/json', 'cache-control': 'no-store' };
export async function onRequest({ request, env, params }) {
  const id = String(params.id || '');
  if (!/^[a-f0-9]{32}$/.test(id)) return new Response('{"error":"bad id"}', { status: 400, headers: H });
  if (request.method === 'GET') {
    const v = await env.SAVES.get(id);
    return v ? new Response(v, { headers: H }) : new Response('{}', { status: 404, headers: H });
  }
  if (request.method === 'PUT') {
    const t = await request.text();
    if (t.length > 300000) return new Response('{"error":"too big"}', { status: 413, headers: H });
    try { const o = JSON.parse(t); if (!o || typeof o !== 'object' || o.v !== 4) throw 0; } catch (e) { return new Response('{"error":"bad json"}', { status: 400, headers: H }); }
    await env.SAVES.put(id, t);
    return new Response('{"ok":true}', { headers: H });
  }
  return new Response('{"error":"method"}', { status: 405, headers: H });
}
