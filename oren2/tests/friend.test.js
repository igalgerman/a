// The friend on activity screens: says a short warm line on every right answer (varied, streaks, effort after a fixed mistake),
// a gentle line on mistakes, says the word a picture stands for, never covers the answers; the day's path strip in the top bar,
// the story line at the start / end of each step, and the two clear choices when the whole day is done.
const L = require('./lib');
const { chromium } = require('playwright'); const sleep = L.sleep;
const res = []; const ok = (n, c, i = '') => res.push((c ? 'PASS ' : 'FAIL ') + n + (i ? ' — ' + i : ''));
const NIK = /[ְ-ׇּׁׂ]/, HEB = /[א-ת]/;
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext(L.VIEWPORT);
  await ctx.addInitScript(() => { try { localStorage.clear(); } catch (e) {} window.__fast = true; window.__noFamily = true;
    const fake = { log: [], speaking: false, speak(u) { this.log.push(u.text); }, cancel() {}, getVoices() { return []; }, onvoiceschanged: null, addEventListener() {} };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true }); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(L.URL); await L.noCoach(p);
  if (!await p.evaluate(() => !!window.FRIEND)) { await p.addStyleTag({ path: L.ROOT + '/friend.css' }); await p.addScriptTag({ path: L.ROOT + '/friend.js' }); }
  await p.evaluate(() => { const O = window.OREN, T = window.TAL; O.save.story.intro = 1; T.S().prof = { an: 'cat', col: '#3a8fc4', love: 'art' }; O.showMap(); });
  await sleep(300);
  // --- the lines ---
  const lines = await p.evaluate(() => window.FRIEND.speakList());
  const bad = lines.filter(t => HEB.test(t) && !NIK.test(t));
  ok('friend lines: 25+ right-answer lines, all with nikud', lines.length >= 40 && !bad.length, bad.join(' | '));
  ok('no "you are smart" praise', !lines.some(t => /גָּאוֹן|חָכָם/.test(t)));
  // --- a day path: math done, now "first letter" ---
  await p.evaluate(() => { const T = window.TAL, d = T.dailyEnsure(); d.t = ['math', 'read-first', 'read-wp', 'eng-word']; d.done = [1, 0, 0, 0]; d.ch = 'readg'; window.OREN.persist(); });
  const said = async (f, ms = 700) => { await p.evaluate(() => { speechSynthesis.log = []; window.__fast = false; }); await f(); await sleep(ms);
    return p.evaluate(() => { window.__fast = true; return speechSynthesis.log.slice(); }); };
  let s = await said(() => p.evaluate(() => window.TAL_step(1)), 900);
  const w = await p.evaluate(() => window.FRIEND.word || '');
  ok('"first letter": the picture\'s word is said', !!w && s.some(x => x.includes(w)), JSON.stringify({ w, s }));
  ok('step start: the friend ties it to the day\'s story', s.some(x => /בּוֹא|מַתְחִילִים|עוֹד צַעַד/.test(x)), JSON.stringify(s));
  const ui = await p.evaluate(() => { const f = document.querySelector('.frc'), pb = document.querySelector('#hudMid #frPath');
    return { fr: !!f && !f.hidden, dots: pb ? pb.querySelectorAll('i').length : 0, on: pb ? pb.querySelectorAll('i.on').length : 0, cur: pb ? pb.querySelectorAll('i.cur').length : 0, pic: !!document.querySelector('#sTal .tqc .pic.frpic') }; });
  ok('friend is on the activity screen', ui.fr);
  ok('path strip in the top bar: one dot per step, done + current marked', ui.dots === 4 && ui.on === 1 && ui.cur === 1, JSON.stringify(ui));
  ok('tapping the picture says the word again', ui.pic);
  const overlap = () => p.evaluate(() => { const f = document.querySelector('.frc'); if (!f || f.hidden) return false; const a = f.getBoundingClientRect();
    return [...document.querySelectorAll('#screens .chb, #screens .tqc, #screens .bigbtn')].some(x => { const r = x.getBoundingClientRect(); return r.width && a.left < r.right && a.right > r.left && a.top < r.bottom && a.bottom > r.top; }); });
  ok('friend does not cover the question or the answers', !await overlap());
  // right answer: a spoken line; wrong: a gentle line; fixed: effort praise
  const pickAns = right => p.evaluate(r => { const q = window.__quiz, ch = q.wrap.querySelector('.chs').children; const k = r ? q.ans : [...ch].findIndex((x, j) => j !== q.ans && !x.disabled); ch[k].click(); }, right);
  const OKL = await p.evaluate(() => window.FRIEND._lines);
  s = await said(() => pickAns(true), 300);
  let last = await p.evaluate(() => window.FRIEND.last);
  ok('right answer: the friend says a short line', OKL.ok.includes(last) && s.some(x => x.includes(last)), JSON.stringify({ last, s }));
  ok('friend hops', await p.evaluate(() => document.querySelector('.frc').classList.contains('joy')));
  await sleep(1300);
  s = await said(() => pickAns(false), 300); last = await p.evaluate(() => window.FRIEND.last);
  ok('wrong answer: a gentle line', OKL.wrong.includes(last) && s.some(x => x.includes(last)), last);
  ok('friend looks sad', await p.evaluate(() => document.querySelector('.frc').classList.contains('sad')));
  await pickAns(true); await sleep(100); last = await p.evaluate(() => window.FRIEND.last);
  ok('fixed after a mistake: praise for trying again', OKL.effort.includes(last), last);
  // streak + variety
  await sleep(1300); const got = [];
  for (let k = 0; k < 4; k++) { await pickAns(true); await sleep(80); got.push(await p.evaluate(() => window.FRIEND.last)); await sleep(1300); }
  ok('three in a row: a streak line', got[2] === 'שָׁלֹשׁ בְּרֶצֶף!', JSON.stringify(got));
  ok('lines are not repeated back to back', new Set(got).size === got.length, JSON.stringify(got));
  // end of the step: one story line on the result card
  await p.waitForSelector('#ov:not([hidden]) .frstory', { timeout: 15000 }).catch(() => {});
  const st = await p.evaluate(() => { const e = document.querySelector('#ov:not([hidden]) .frstory'); return e && e.textContent; });
  ok('step done: a story line on the result card', !!st && NIK.test(st), String(st));
  // leaving: no friend on home, no strip
  await p.evaluate(() => window.OREN.showMap()); await sleep(200);
  ok('home: no corner friend, no strip', await p.evaluate(() => { const f = document.querySelector('.frc'); return (!f || f.hidden) && !document.querySelector('#frPath'); }));
  // a reading question (try to read first): only the word is said, not the question
  s = await said(() => p.evaluate(() => window.TAL_step(2)), 900);
  ok('"which picture": the word to read is not said', !s.some(x => x.includes(window.__w || '§')) && await p.evaluate(() => !window.FRIEND.word), JSON.stringify(s));
  await p.evaluate(() => window.OREN.showMap()); await sleep(200);
  // --- math: the friend is there and reacts ---
  await p.evaluate(() => { const O = window.OREN; const lv = O.ALLLV.find(x => x.type !== 'learn' && x.type !== 'train'); O.save.story[lv.w.id + '-in'] = 1; O.startLevel(lv); });
  await sleep(400);
  ok('math screen: the friend is there (or the math friend already is)', await p.evaluate(() => { const f = document.querySelector('.frc'); return (f && !f.hidden) || !!document.querySelector('#sPlay #pet'); }));
  const ansMath = async () => { const a = await p.evaluate(() => { const P = window.__oren4.play; if (P.choice) { P.choice.row.children[P.choice.ans].click(); return null; } return (P.boxes || []).filter(x => !x.done).map(x => String(x.ans)); });
    if (a) { for (const v of a) { await p.keyboard.type(v); } await p.keyboard.press('Enter'); } };
  s = await said(ansMath, 300); last = await p.evaluate(() => window.FRIEND.last);
  ok('math right answer: the friend says a line', OKL.ok.concat(OKL.streak).includes(last) && s.some(x => x.includes(last)), JSON.stringify({ last, s }));
  ok('math: friend does not cover the answer pad', !await overlap());
  // --- the whole day done: one sentence, exactly two choices ---
  await p.evaluate(() => { const O = window.OREN, d = window.TAL.dailyEnsure(); d.done = d.t.map(() => 1); d.claimed = 1; O.persist(); O.showMap(); }); await sleep(300);
  const hd = await p.evaluate(() => ({ say: document.querySelector('#sHome .hbub2').textContent, ch: document.querySelectorAll('#sHome .frdone .bigbtn').length, badge: !!document.querySelector('#sHome .frbadge'), more: !!document.querySelector('#sHome .dmore'), doors: !!document.querySelector('#sHome .doors2') }));
  ok('day done: "you finished all of today\'s missions", a done badge, two choices only', /סִיַּמְתָּ אֶת כָּל הַמְּשִׂימוֹת/.test(hd.say) && hd.ch === 2 && hd.badge && !hd.more && !hd.doors, JSON.stringify(hd));
  await p.click('#sHome .frdone .bigbtn.blue'); await sleep(300);
  ok('free time: the doors', await p.evaluate(() => !!document.querySelector('#sHome .doors2') && !document.querySelector('#sHome .frdone')));
  await p.evaluate(() => window.OREN.showMap()); await sleep(200);
  ok('free time: the friend reminds once that tapping it brings another path', /גַּע בִּי/.test(await p.evaluate(() => document.querySelector('#sHome .hbub2').textContent)));
  await p.evaluate(() => window.OREN.showMap()); await sleep(200);
  ok('...only once', !/גַּע בִּי/.test(await p.evaluate(() => document.querySelector('#sHome .hbub2').textContent)));
  await p.click('#sHome .hpair'); await sleep(300);
  const bn = await p.evaluate(() => ({ cards: document.querySelectorAll('#sHome .dchoice .dcard').length }));
  ok('tapping the friend in free time: the choice cards for another path', bn.cards >= 2, JSON.stringify(bn));
  await p.click('#sHome .dchoice .dcard:not(.cont)'); await sleep(300);
  const bp = await p.evaluate(() => { const d = window.TAL.dailyEnsure(); return { n: d.t.length - (d.bs | 0), circles: document.querySelectorAll('#sHome .tpath .tstep2').length, go: !!document.querySelector('#sHome .bigbtn.huge') }; });
  ok('another path: 2-3 new steps, only they are on the path', bp.n >= 2 && bp.n <= 3 && bp.circles === bp.n && bp.go, JSON.stringify(bp));
  await L.shot(p, { path: L.SHOTDIR + '/friend-' + L.variant + '.png' });
  ok('no page errors', !errs.length, errs.join(' | '));
  await b.close(); L.finish('friend', res);
})().catch(e => { console.log('FAIL crashed — ' + e.message); console.log('RESULT friend 0 1'); process.exitCode = 1; });
