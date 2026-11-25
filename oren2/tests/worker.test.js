// The Cloudflare worker bundle (cf/dist/_worker.js): page, icons, manifest and the family save API, with a fake KV.
const L = require('./lib');
const path = require('path');
(async () => {
  const res = []; const ok = (n, c, i = '') => res.push((c ? 'PASS ' : 'FAIL ') + n + (i ? ' — ' + i : ''));
  const m = await import(path.join(L.ROOT, 'cf', 'dist', '_worker.js'));
  const kv = new Map(); const env = { SAVES: { get: async k => kv.get(k) || null, put: async (k, v) => { kv.set(k, v); } } };
  const f = (u, o) => m.default.fetch(new Request('https://oren.test' + u, o), env);
  const id = 'ab'.repeat(16);
  const home = await f('/'); const html = await home.text();
  ok('home page served as html', home.status === 200 && /text\/html/.test(home.headers.get('content-type')) && html.includes('window.OREN'));
  const ic = await f('/icon-192.png'); ok('icon served as png', ic.status === 200 && ic.headers.get('content-type') === 'image/png' && (await ic.arrayBuffer()).byteLength > 500);
  const mf = await f('/manifest.webmanifest'); ok('manifest served', mf.status === 200 && JSON.parse(await mf.text()).start_url === '/');
  ok('unknown path is 404', (await f('/nope')).status === 404);
  ok('bad family id rejected', (await f('/api/save/xyz')).status === 400);
  ok('missing save is 404', (await f('/api/save/' + id)).status === 404);
  const put = await f('/api/save/' + id, { method: 'PUT', body: JSON.stringify({ v: 4, gems: 7 }) });
  ok('save stored', put.status === 200 && JSON.parse(kv.get(id)).gems === 7);
  const get = await f('/api/save/' + id); ok('save read back', get.status === 200 && (await get.json()).gems === 7 && get.headers.get('cache-control') === 'no-store');
  ok('non-game json rejected', (await f('/api/save/' + id, { method: 'PUT', body: '{"hello":1}' })).status === 400);
  ok('oversized save rejected', (await f('/api/save/' + id, { method: 'PUT', body: JSON.stringify({ v: 4, x: 'a'.repeat(310000) }) })).status === 413);
  ok('other methods rejected', (await f('/api/save/' + id, { method: 'DELETE' })).status === 405);
  L.finish('worker', res);
})().catch(e => { console.log('FAIL crashed — ' + e.message); console.log('RESULT worker 0 1'); process.exitCode = 1; });
