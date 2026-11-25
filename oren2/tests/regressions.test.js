// Regression tests for specific bugs: kingdom badges button, avatar default + one-time migration, cap hat rendering.
const L = require('./lib');
const { chromium } = require('playwright');
(async () => {
  const res = []; const ok = (n, c, i = '') => res.push((c ? 'PASS ' : 'FAIL ') + n + (i ? ' — ' + i : ''));
  const b = await chromium.launch();
  // 1. kingdom → "my badges" button must open the badges wall without errors
  {
    const ctx = await b.newContext(L.VIEWPORT);
    await ctx.addInitScript(() => { try { localStorage.clear(); } catch (e) {} window.__fast = true; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(L.URL); await L.noCoach(p);
    await p.evaluate(() => { const O = window.OREN, T = window.TAL; O.save.story.intro = 1; T.S().prof = { an: 'cat', col: '#3a8fc4', love: 'art' }; O.kingdom(); });
    const btn = p.locator('.kmine .tool', { hasText: 'הַתַּגִּים' });
    await btn.waitFor({ timeout: 5000 }).catch(() => {});
    ok('kingdom has the badges button', await btn.count() === 1);
    if (await btn.count()) await btn.click();
    await p.waitForSelector('#sTal .bdgg', { timeout: 5000 }).catch(() => {});
    ok('badges wall opens from the kingdom', await p.locator('#sTal .bdgg').count() === 1);
    ok('no page errors (kingdom badges)', !errs.length, errs.join(' | '));
    await ctx.close();
  }
  // 2. avatar default look + one-time migration that keeps Oren's later choices
  {
    const ctx = await b.newContext(L.VIEWPORT);
    await ctx.addInitScript(() => { window.__fast = true; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(L.URL);
    await p.evaluate(() => { localStorage.clear(); localStorage.setItem('oren4-v1', JSON.stringify({ v: 4, t: 1, s: {}, m: {}, seen: {}, story: { intro: 1 }, rq: [], days: [], ans: 0, ok: 0, trains: 0, gems: 0, av: { hair: 'black', skin: 'light', shirt: 'green', hat: 'none', pet: 'cat' }, owned: { none: 1, cap: 1 }, k: {}, tc: [], sp: {}, made: {} })); });
    await p.reload(); await p.waitForFunction(() => window.OREN && window.OREN.save);
    const a = await p.evaluate(() => { const s = window.OREN.save; return { av: s.av, f: s.avOren }; });
    ok('old save migrated to the new default look', a.av.hair === 'lightbrown' && a.av.pants === 'olive' && a.f === 1, JSON.stringify(a));
    await p.evaluate(() => { const O = window.OREN; O.save.av.shirt = 'red'; O.persist(); });
    await p.reload(); await p.waitForFunction(() => window.OREN && window.OREN.save);
    const sh = await p.evaluate(() => window.OREN.save.av.shirt);
    ok("Oren's later choice survives reload (migration runs once)", sh === 'red', sh);
    const cap = await p.evaluate(() => { const O = window.OREN; O.save.av.hat = 'cap'; const svg = O.AV(); return typeof svg === 'string' && svg.includes('<svg'); });
    ok('avatar with cap renders', cap);
    ok('no page errors (avatar)', !errs.length, errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  L.finish('regressions', res);
})().catch(e => { console.log('FAIL crashed — ' + e.message.split('\n')[0]); console.log('RESULT regressions 0 1'); process.exitCode = 1; });
