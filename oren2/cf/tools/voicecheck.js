#!/usr/bin/env node
/* Pronunciation check of every game sentence in the game voice (Kore 0.9). Run after pregen.js.
   Lessons so far: Gemini that is told the intended text "hears" what it expects (it passed אחדות read as אַחְדוּת),
   and Chirp mostly ignores nikud — respellings work (אחדות → אחאדות). So:
   1. Gemini vocalizes every sentence by its meaning (text only, /api/tts/nikud, 25 a call) = the intended reading.
   2. Gemini transcribes the stored audio BLIND, with nikud (/api/tts/verify blind). Each word is compared by sound
      with the intended reading; a word that differs in two blind listens is a suspect.
   3. A suspect word that already has a chosen spelling in the dictionary is fixed at once (/api/tts/fix: the
      sentence made again under its original URL). Otherwise respelling variants go to the parent's page
      https://oren-game.pages.dev/api/tts/listen ("which one sounds right") — never applied on Gemini's word alone.
   4. The parent's choices (KV ttsvote) and the words he marked while listening (KV ttsmarks) are read on every run:
      choices are applied (word = dictionary + all its sentences made again; word#n = that sentence only),
      marked words get variants on the page.
   5. The summary goes to /api/tts/review (one KV write).
   Resumable: state in ~/.cache/oren-voicecheck/ (state.json, log.txt). Gemini paced to 8 a minute.
   Usage:  node oren2/cf/tools/voicecheck.js           apply choices, check new sentences, update both pages
           node oren2/cf/tools/voicecheck.js --pages   only apply choices + update the listening page and the review
           node oren2/cf/tools/voicecheck.js --again   check every sentence again
   Env: SITE, PER_MIN (default 8), WRITES (KV writes this script may use a day, default 250)                    */
const path = require('path'), fs = require('fs'), os = require('os');
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {   // Node's fetch reads the proxy only with this flag
  const c = require('child_process').spawn(process.execPath, process.argv.slice(1), { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' } });
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => c.kill(sig));
  c.on('exit', code => process.exit(code == null ? 1 : code)); return;
}
const SITE = (process.env.SITE || 'https://oren-game.pages.dev').replace(/\/$/, '');
const MODELS = ['gemini-3-flash-preview', 'gemini-3.5-flash', 'gemini-flash-latest'], MODEL = MODELS[0];  let mi = 0; const VOICE = 'he-IL-Chirp3-HD-Kore', RATE = 0.9;
const PER_MIN = +process.env.PER_MIN || 8, WRITES = +process.env.WRITES || 250;
const DIR = path.join(os.homedir(), '.cache', 'oren-voicecheck'); fs.mkdirSync(DIR, { recursive: true });
const STATE = path.join(DIR, 'state.json'), LOG = path.join(DIR, 'log.txt');
const PRE = path.join(os.homedir(), '.cache', 'oren-pregen');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arg = a => process.argv.includes(a);
const today = () => new Date().toISOString().slice(0, 10);
const log = m => { const l = new Date().toISOString().slice(11, 19) + ' ' + m; console.log(l); fs.appendFileSync(LOG, l + '\n'); };
let S = { items: {}, nik: {}, applied: {}, queue: [], day: '', writes: 0 };
try { S = { ...S, ...JSON.parse(fs.readFileSync(STATE, 'utf8')) }; } catch (e) {}
const save = () => fs.writeFileSync(STATE, JSON.stringify(S));
if (S.day !== today()) { S.day = today(); S.writes = 0; }

/* ---- Hebrew helpers ---- */
const plain = s => s.replace(/[֑-ׇ]/g, '');
const tokens = s => (s.match(/[֐-׿]+/g) || []).filter(t => /[א-ת]/.test(t));
const mat = s => plain(s).replace(/[^א-ת]/g, '').replace(/[וי]/g, '').replace(/[ךםןףץ]/g, c => 'כמנפצ'['ךםןףץ'.indexOf(c)]);
const VW = { 'ִ': 'i', 'ֵ': 'e', 'ֶ': 'e', 'ַ': 'a', 'ָ': 'a', 'ֹ': 'o', 'ֺ': 'o', 'ֻ': 'u', 'ֱ': 'e', 'ֲ': 'a', 'ֳ': 'o', 'ׇ': 'o' };
const CN = { 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ו': 'v', 'ז': 'z', 'ח': 'k', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm', 'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'פ': 'p', 'ף': 'p', 'צ': 'c', 'ץ': 'c', 'ק': 'k', 'ר': 'r', 'ת': 't' };
/* rough sound of a vocalized word; b/v k/kh p/f, ח/כ, ט/ת, א/ע/ה and shva are not told apart (transcription noise) */
function phon(w) {
  const n = w.normalize('NFD'), g = n.match(/[א-ת][֑-ׇ]*/g) || []; let out = '';
  g.forEach((x, i) => { const l = x[0], k = x.slice(1), v = [...k].map(c => VW[c] || '').join('');
    if (l === 'ו' && k.includes('ּ') && !v) { out += 'u'; return; }
    if (l === 'ו' && v === 'o') { out += 'o'; return; }
    if (l === 'י' && !v && i > 0) return;
    out += (l === 'ש' ? (k.includes('ׂ') ? 's' : 'S') : CN[l] || '') + v; });
  if (n[0] === 'ו') out = out.replace(/^(va|ve|vi|u)/, 'u');
  return out.replace(/(.)\1+/g, '$1');
}
/* the words whose sound differs between the intended reading and what was heard (tokens matched by their letters) */
function diff(intended, heard) {
  const A = tokens(intended), B = tokens(heard); const out = []; let j = 0;
  for (const a of A) { const k = B.slice(j, j + 4).findIndex(b => mat(b) === mat(a)); if (k < 0) continue;
    const b = B[j + k]; j += k + 1; if (phon(a) !== phon(b)) out.push({ word: plain(a), want: a.normalize('NFC'), heard: b }); }
  return out;
}
/* Gemini's vocalized text keeps every word of the game text in order (numbers may become words) */
function sameWords(t, v) { const B = tokens(v).map(mat); let j = 0; for (const a of tokens(t).map(mat)) { while (j < B.length && B[j] !== a) j++; if (j++ >= B.length) return false; } return true; }
/* number words: checked and reported, never respelled (synth() makes them from digits) */
const NUMW = new Set('אפס אחד אחת שניים שתיים שתים שני שתי שלוש שלושה שלושת ארבע ארבעה ארבעת חמש חמישה חמשת שש שישה ששת שבע שבעה שבעת שמונה שמונת תשע תשעה תשעת עשר עשרה עשרים שלושים ארבעים חמישים שישים שבעים שמונים תשעים מאה מאות מאתיים אלף אלפים אלפיים'.split(' '));
const isNum = w => NUMW.has(w) || (w[0] === 'ו' && NUMW.has(w.slice(1)));
/* respelling variants for the parent: plain, vowel letters (a → א in an open syllable, like אחאדות; i → י; o/u → ו), nikud */
function variants(word, want) {
  const g = want.normalize('NFD').match(/[א-ת][֑-ׇ]*/g) || [];
  const isV = k => /[ִ-ׇֻ]/.test(k);
  const mk = all => g.map((x, i) => { const l = x[0], k = x.slice(1), n = g[i + 1]; if (!n || l === 'ו' || l === 'י') return l;
    const open = isV(n.slice(1)) || 'וי'.includes((g[i + 2] || ' ')[0]);
    if (/[ַָ]/.test(k) && !'אהע'.includes(n[0]) && (all || open)) return l + 'א';
    if (/ִ/.test(k) && n[0] !== 'י') return l + 'י';
    if (/[ֹֻ]/.test(k) && n[0] !== 'ו') return l + 'ו';
    return l; }).join('');
  const L = [word, mk(false), mk(true), want.normalize('NFC')].filter(v => v && /^[֑-״'\- ]{1,60}$/.test(v));
  return [...new Set(L)].slice(0, 4);
}

/* ---- site calls ---- */
let lastG = 0, gStreak = 0;
async function call(p, body) {
  for (let i = 0; ; i++) {
    try { const r = await fetch(SITE + p, body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const tx = await r.text(); let j = null; try { j = JSON.parse(tx); } catch (e) {} return { status: r.status, j, tx };
    } catch (e) { if (i >= 3) return { status: 0, j: null, tx: String(e) }; await sleep(5000 * (i + 1)); }
  }
}
class Stop extends Error {}
async function gemini(p, body) {      // paced; waits on overload, stops on a daily quota
  for (let i = 0; i < 8; i++) {
    const w = lastG + 60000 / PER_MIN - Date.now(); if (w > 0) await sleep(w); lastG = Date.now();
    const { status, j, tx } = await call(p, { ...body, m: MODELS[mi] });
    if (j && j.res) { gStreak = 0; return j.res; }
    const why = String((j && (j.err || j.why || j.raw)) || tx).slice(0, 200);
    if (j && (j.status === 429 || j.status === 503)) {
      if (/per ?day|PerDay|daily/i.test(why) || ++gStreak > 12) throw new Stop('Gemini quota: ' + why);
      if (j.status === 503 && i >= 1) { mi = (mi + 1) % MODELS.length; log(`  gemini busy, trying ${MODELS[mi]}`); continue; }   // overloaded: another model
      log(`  gemini ${j.status}, waiting… ${why.slice(0, 80)}`); await sleep(30000 * Math.min(4, i + 1)); continue;
    }
    log(`  ${p} failed (${status}): ${why.slice(0, 160)}`);
    if (status >= 500 || status === 0 || (j && j.status >= 500)) { await sleep(20000); continue; }
    return null;
  }
  return null;
}
async function fix(t, words, only) {
  for (let i = 0; i < 4; i++) {
    const { status, j, tx } = await call('/api/tts/fix', { t, words: words || {}, only: only || {} });
    if (j && j.ok) { S.writes += 1 + (j.changed ? 1 : 0); save(); await sleep(3500); return j; }   // Google: 20 a minute, shared
    log(`  fix failed (${status}): ${(j && j.why) || tx.slice(0, 160)}`);
    if (status === 502 || status === 429 || status === 0 || status >= 500) { await sleep(60000); continue; }
    return null;
  }
  return null;
}

/* ---- words known to be risky (homographs in a 1st-2nd grade game): the parent chooses, not Gemini ---- */
const RISKY = [
  { w: 'עשרת', want: 'עֲשֶׂרֶת', vars: ['עשרת', 'עֲשֶׂרֶת', 'אשרת'] },
  { w: 'ספרתי', want: 'סִפְרָתִי', vars: ['ספרתי', 'סִפְרָתִי', 'ספראתי'] },
  { w: 'ספרת', want: 'סִפְרַת', vars: ['ספרת', 'סִפְרַת', 'ספראת'] },
  { w: 'שארית', want: 'שְׁאֵרִית', vars: ['שארית', 'שְׁאֵרִית', 'שאירית'] },
  { w: 'כפול', want: 'כָּפוּל', vars: ['כפול', 'כָּפוּל', 'כאפול'] },
  { w: 'ישן', want: 'יָשֵׁן', vars: ['ישן', 'יָשֵׁן', 'יאשן'] },
  { w: 'פתח', want: 'פָּתַח', vars: ['פתח', 'פָּתַח', 'פאתח'] },
  { w: 'שמה', want: 'שָׂמָה', vars: ['שמה', 'סמה', 'סאמה'] },
  { w: 'רבע', want: 'רֶבַע', vars: ['רבע', 'רֶבַע', 'רעבע'] },
  { w: 'ספר', s: 'באיזו אות מתחילה המילה ספר', want: 'סֵפֶר', vars: ['ספר', 'סֵפֶר', 'סעפר'] },
  { w: 'ספר', s: 'בליילה הריאשון הוא ספר עשרה כוכבים.', want: 'סָפַר', vars: ['ספר', 'סָפַר', 'סאפאר'] },
  { w: 'ספר', s: 'ספר איזו תמונה מתאימה למלה?', want: 'סַפֵּר', vars: ['ספר', 'סַפֵּר', 'ספאר'] },
];

let SAID = [], DICT = {};
const item = x => typeof x === 'string' ? { t: x.slice(0, 400).trim(), v: VOICE, r: RATE } : { t: String(x.t).slice(0, 400).trim(), v: x.v || VOICE, r: +x.r || RATE };
const id = it => it.v + '|' + it.r.toFixed(2) + '|' + it.t;
const has = (t, w) => tokens(t).includes(w);
const rec = t => { const k = id({ t, v: VOICE, r: RATE }); return S.items[k] || (S.items[k] = { t, v: VOICE, r: RATE, n: S.nik[t] || t }); };
function markFix(t, w, v) { const o = rec(t); o.note = (o.st === 'fix' && o.note ? o.note + ', ' : 'תוקן: ') + w + ' → ' + v; o.st = 'fix'; o.pend = (o.pend || []).filter(p => p.word !== w); }

/* the parent's choices: word → that spelling in the dictionary, for every prefixed form, all its sentences made again;
   word#n → that sentence only; '' → none of the variants is right */
async function applyVotes() {
  const { j } = await call('/api/tts/listen/data?marks'); if (!j) return { marks: [], votes: {} };
  for (const [k, raw] of Object.entries(j.votes || {})) {
    const vo = typeof raw === 'string' ? { v: raw, half: [], note: '' } : raw, v = vo.v, sig = String(vo.at || v);
    if (k in S.applied && S.applied[k] === sig) continue;
    const q = (S.queue || []).find(x => x.id === k), w = k.split('#')[0], global = q && 'global' in q ? q.global : !k.includes('#');
    if (!v && q && ((vo.half || []).length || vo.note)) {          // half right / a comment: new respellings that follow it
      const r = await gemini('/api/tts/respell', { w, s: q.s, want: q.want, tried: q.vars, half: vo.half, note: vo.note });
      const fresh = (Array.isArray(r) ? r : []).map(x => String(x).trim()).filter(x => /^[\u05D0-\u05EA'\-]{1,40}$/.test(x) && !q.vars.includes(x));
      const own = tokens(vo.note || '').map(plain).filter(x => x !== w && x[0] === w[0] && Math.abs(x.length - w.length) <= 2);   // a spelling he wrote himself comes first
      const vars = [...new Set([...own, ...(vo.half || []), ...fresh])].slice(0, 4);
      S.retry = S.retry || []; const nid = w + '#' + (100 + S.retry.length);
      if (vars.length) S.retry.push({ id: nid, w, s: q.s, want: q.want, vars, global, hint: vo.note || 'חצי נכון: ' + vo.half.join(', ') });
      S.applied[k] = sig; log(`choice ${k}: half/comment "${vo.note}" → new variants ${vars.join(', ')}`); save(); continue; }
    if (v === w) { S.applied[k] = sig; if (q) { const o = rec(q.s); if (!o.st) o.st = 'ok'; } log(`choice ${k}: as it is`); save(); continue; }   // the plain one is right
    if (!v) { S.applied[k] = sig; if (q) { const o = rec(q.s); o.st = 'bad'; o.note = w + ': אף גרסה לא נשמעה נכון — צריך לבדוק'; } log(`choice ${k}: none is right`); save(); continue; }
    if (S.writes + 3 > WRITES) { log('write budget for today used up; the other choices are applied next run'); break; }
    if (!global) { if (!q) continue; const r = await fix(q.s, {}, { [w]: v }); if (r) { S.applied[k] = sig; markFix(q.s, w, v); log(`choice ${k} → ${v}: ${r.sent}`); } save(); continue; }
    const forms = { [w]: v };
    for (const x of SAID) for (const t of tokens(x.t)) { const p = t.slice(0, t.length - w.length); if (t !== w && t.endsWith(w) && /^[ובהלמשכ]{1,3}$/.test(p)) forms[t] = p + v; }
    const L = SAID.filter(x => x.v.startsWith('he-') && tokens(x.t).some(t => t in forms));
    log(`choice ${w} → ${v}: ${Object.keys(forms).join(', ')} in ${L.length} sentences`);
    let first = true, all = true;
    for (const x of L) { if (S.writes + 1 > WRITES) { all = false; break; } const r = await fix(x.t, first ? forms : {}, {}); if (!r) { all = false; break; } first = false; markFix(x.t, w, v); }
    if (all && L.length) S.applied[k] = sig; save();
  }
  return { marks: j.marks || [], votes: j.votes || {} };
}

/* the listening page: words to choose a spelling for, then sentences to spot-check (risky first) */
async function pages(votes, marks) {
  const old = S.queue || [], choose = [], seen = new Set();
  const add = (w, s, want, vars, ctx, hint) => { const key = ctx ? w + '|' + s : w; if (seen.has(key)) return; seen.add(key);
    if (!ctx && DICT[w]) return;                                          // already in the dictionary
    const o = old.find(x => x.w === w && (!ctx || x.s === s) && !!x.id.includes('#') === ctx);
    if (o && S.applied[o.id]) return;                                    // already chosen and applied
    choose.push({ id: o ? o.id : (ctx ? w + '#' : w), w, s, want, vars, global: !ctx, hint: hint || undefined }); };
  for (const r of RISKY) { const s = r.s || (SAID.find(x => has(x.t, r.w)) || {}).t; if (s) add(r.w, s, r.want, r.vars, !!r.s); }
  for (const x of Object.values(S.items)) for (const p of (x.pend || []).filter(p => !isNum(p.word))) add(p.word, x.t, p.want, variants(p.word, p.want), false);
  for (const m of marks || []) { if (m.ok) continue;
    if (!(m.w || []).length && m.note) { const o = rec(m.t); o.st = 'bad'; o.note = 'הערת ההורה: ' + m.note; }
    for (const w0 of m.w || []) { const w = plain(w0); if (isNum(w)) { const o = rec(m.t); o.st = 'bad'; o.note = 'מספר: ' + w + (m.note ? ' — ' + m.note : ''); continue; }
      const want = (tokens(S.nik[m.t] || '').find(t => plain(t) === w)) || w; add(w, m.t, want, variants(w, want), false, m.note); } }
  for (const r of S.retry || []) if (!(r.id in S.applied)) choose.push(r);
  for (const o of old) if (!choose.some(c => c.id === o.id) && o.id in (votes || {})) choose.push(o);   // keep answered ones findable
  const ids = new Set(choose.filter(c => !c.id.endsWith('#')).map(c => c.id)); let n = 1;
  for (const c of choose) if (c.id.endsWith('#')) { while (ids.has(c.w + '#' + n)) n++; c.id = c.w + '#' + n; ids.add(c.id); }
  S.queue = choose;
  // spot-check: risky sentences first (math words, homographs, numbers, short items, English), then a random sample
  const RISK = /עשרות|אחדות|מאות|ספר|עשר|שארית|כפול|חילוק|חיסור|חיבור|שווה|שוה|זוגי|חצי|רבע|שליש|ישן|פתח|שמה|אחר|שמונה/;
  const score = x => (/\d/.test(x.t) ? 6 : 0) + (x.st === 'bad' ? 9 : 0) + (x.st === 'fix' ? 5 : 0) + (RISK.test(x.t) ? 3 : 0) + (/\d/.test(x.t) ? 1 : 0) + (tokens(x.t).length <= 2 ? 2 : 0) + (/[A-Za-z]/.test(x.t) ? 2 : 0);
  const pool = SAID.map(x => ({ x, s: score({ ...x, ...(S.items[id(x)] || {}) }) + Math.random() })).sort((a, b) => b.s - a.s);
  const risky = pool.filter(p => p.s >= 3).slice(0, 30).map(p => p.x), rest = pool.filter(p => p.s < 3).sort(() => Math.random() - .5).slice(0, 40 - risky.length).map(p => p.x);
  const sample = [...risky, ...rest].map(x => ({ t: x.t, v: x.v, r: x.r }));
  const { j } = await call('/api/tts/listen/q', { choose, sample }); S.writes++; save();
  log(`listening page: ${choose.filter(c => !(c.id in (votes || {}))).length} words to choose, ${sample.length} sentences → ${SITE}/api/tts/listen ${j && j.ok ? '' : '(failed)'}`);
}
async function review() {
  const L = Object.values(S.items).filter(x => ['ok', 'fix', 'bad'].includes(x.st)).map(x => ({ t: x.t, n: x.n || x.t, st: x.st, note: x.note || '', v: x.v, r: x.r }));
  const order = { bad: 0, fix: 1, ok: 2 }; L.sort((a, b) => order[a.st] - order[b.st]);
  const { status, j } = await call('/api/tts/review', L); S.writes++; save();
  log(`review: ${L.length} sentences (${status} ${j && j.ok ? 'ok' : 'failed'}) → ${SITE}/api/tts/review`);
}

/* one sentence: blind listen (twice when something differs), compare with the intended reading */
async function check(it) {
  const want = S.nik[it.t], listen = () => gemini('/api/tts/verify', { t: it.t, v: it.v, r: it.r, blind: 1 });
  const h1 = await listen(); if (!h1 || !h1.heard) return { st: 'err' };
  if (it.v.startsWith('en-')) { const n = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    return n(h1.heard) === n(it.t) ? { st: 'ok', n: h1.heard } : { st: 'bad', n: it.t, note: 'נשמע: ' + h1.heard }; }
  if (!want) return { st: 'ok', n: h1.heard, note: 'לא נבדק מול ניקוד' };
  let d = diff(want, h1.heard); if (!d.length) return { st: 'ok', n: want };
  const h2 = await listen(); if (!h2 || !h2.heard) return { st: 'err' };
  const d2 = diff(want, h2.heard); d = d.filter(x => d2.some(y => y.word === x.word && phon(y.heard) === phon(x.heard)));
  if (!d.length) return { st: 'ok', n: want };                         // the two listens disagree: transcription noise
  const note = d.map(x => `${x.word}: נשמע ${x.heard} במקום ${x.want}`).join('; ');
  if (d.every(x => DICT[x.word]) && S.writes + 1 <= WRITES) {          // the dictionary already knows them: make it again
    if (await fix(it.t, {}, {})) { const h3 = await listen();
      if (h3 && h3.heard && !diff(want, h3.heard).length) return { st: 'fix', n: want, note: 'תוקן: ' + d.map(x => x.word + ' → ' + DICT[x.word]).join(', ') }; }
  }
  return { st: 'bad', n: want, note: note + ' — לבחירה בדף ההאזנה', pend: d.map(x => ({ word: x.word, want: x.want })) };
}

(async () => {
  try { SAID = JSON.parse(fs.readFileSync(path.join(PRE, 'said.json'), 'utf8')).map(item).filter(x => x.t); } catch (e) { log('no said.json — run pregen.js --collect first'); return; }
  let made = {}; try { made = JSON.parse(fs.readFileSync(path.join(PRE, 'state.json'), 'utf8')).done || {}; } catch (e) {}
  DICT = (await call('/api/tts/fix')).j || {};
  let { marks, votes } = await applyVotes(); DICT = (await call('/api/tts/fix')).j || DICT;
  await pages(votes, marks);
  if (arg('--pages')) return review();
  // 0. make again the sentences made before synth() learned numbers in words and dropping emoji (one write each)
  const REGEN = 'num1', R = SAID.filter(x => x.v.startsWith('he-') && made[x.t] && (/\d/.test(x.t) || /\p{Extended_Pictographic}/u.test(x.t)) && !(S.regen || {})[x.t]);
  S.regen = S.regen || {}; let rn = 0;
  for (const x of R) { if (S.writes + 1 > WRITES) { log(`regen: write budget used up, ${R.length - rn} left for the next run`); break; }
    const r = await fix(x.t, {}, {}); if (!r) { log('regen stopped (KV/Google refused)'); break; } S.regen[x.t] = REGEN; rn++;
    const o = S.items[id(x)]; if (o && o.at) o.at = 0; save(); }
  if (R.length) log(`regen: ${rn}/${R.length} sentences with numbers/emoji made again`);
  try {
    // 1. the intended reading of every Hebrew sentence (text only, 25 a call)
    const need = SAID.filter(x => x.v.startsWith('he-') && !S.nik[x.t]).map(x => x.t);
    for (let i = 0; i < need.length; i += 25) { const L = need.slice(i, i + 25); const r = await gemini('/api/tts/nikud', { texts: L });
      if (Array.isArray(r) && r.length === L.length) L.forEach((t, k) => { if (typeof r[k] === 'string' && sameWords(t, r[k])) S.nik[t] = r[k]; });
      save(); log(`nikud ${Math.min(i + 25, need.length)}/${need.length}`); }
    // 2. listen to every sentence (made ones first: listening to one pregen has not made yet costs KV writes)
    const Q = SAID.filter(x => { const o = S.items[id(x)]; return arg('--again') || !o || !o.st || o.st === 'err' || (o.st === 'fix' && !o.at); })
      .sort((a, b) => (made[b.t] ? 1 : 0) - (made[a.t] ? 1 : 0));
    log(`voicecheck: ${Q.length} to check of ${SAID.length}; dictionary ${Object.keys(DICT).length} words; ${S.writes}/${WRITES} writes today`);
    let n = 0; const T0 = Date.now();
    for (const it of Q) {
      n++; if (!made[it.t]) S.writes += 2;
      const r = await check(it); const o = S.items[id(it)] || {};
      S.items[id(it)] = { t: it.t, v: it.v, r: it.r, st: r.st, n: r.n, note: r.note || '', pend: r.pend || [], at: Date.now() };
      if (o.st === 'fix' && r.st === 'ok') { S.items[id(it)].st = 'fix'; S.items[id(it)].note = o.note; }   // fixed by a choice, now heard right
      save(); log(`${n}/${Q.length} ${r.st.padEnd(3)} ${it.t.slice(0, 70)}${r.note ? '  — ' + r.note : ''}`);
      if (n % 20 === 0) { const c = {}; for (const x of Object.values(S.items)) c[x.st] = (c[x.st] || 0) + 1;
        log(`progress ${n}/${Q.length} · ${Math.round((Date.now() - T0) / 60000)} min · ${JSON.stringify(c)} · writes ${S.writes}`);
        const nv = await applyVotes(); DICT = (await call('/api/tts/fix')).j || DICT; marks = nv.marks; votes = nv.votes; await pages(votes, marks); }   // the parent may be choosing right now
    }
  } catch (e) { if (!(e instanceof Stop)) throw e; log('stopped: ' + e.message + ' — run again later to continue'); }
  await pages(votes, marks); await review();
  const c = {}; for (const x of Object.values(S.items)) c[x.st] = (c[x.st] || 0) + 1;
  log('done: ' + JSON.stringify(c) + ' · dictionary: ' + JSON.stringify(DICT));
})().catch(e => { log('crashed: ' + (e && e.stack || e)); save(); process.exitCode = 1; });
