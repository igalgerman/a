#!/usr/bin/env python3
"""Bundle the website (index.html, manifest, icons) and the save API into one Pages _worker.js.
Used for deploys where the asset-upload step is not available."""
import base64,json,pathlib
d=pathlib.Path(__file__).resolve().parent.parent
pub=d/'public'
html=(pub/'index.html').read_text(encoding='utf-8')
man=(pub/'manifest.webmanifest').read_text(encoding='utf-8')
i192=base64.b64encode((pub/'icon-192.png').read_bytes()).decode()
i512=base64.b64encode((pub/'icon-512.png').read_bytes()).decode()
js='''const HTML=%s;const MAN=%s;const IC={'/icon-192.png':'%s','/icon-512.png':'%s'};
const JH={'content-type':'application/json','cache-control':'no-store'};
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function api(req,env,id){if(!/^[a-f0-9]{32}$/.test(id))return new Response('{"error":"bad id"}',{status:400,headers:JH});
 if(req.method==='GET'){const v=await env.SAVES.get(id);return v?new Response(v,{headers:JH}):new Response('{}',{status:404,headers:JH});}
 if(req.method==='PUT'){const t=await req.text();if(t.length>300000)return new Response('{"error":"too big"}',{status:413,headers:JH});
  try{const o=JSON.parse(t);if(!o||typeof o!=='object'||o.v!==4)throw 0;}catch(e){return new Response('{"error":"bad json"}',{status:400,headers:JH});}
  await env.SAVES.put(id,t);return new Response('{"ok":true}',{headers:JH});}
 return new Response('{"error":"method"}',{status:405,headers:JH});}
/* Google voice (game voice: Chirp3-HD Kore at 0.9), every sentence created once and kept forever in KV,
   plus a monthly character cap far below Google's free tier. */
const TTS_CAP=250000;const GAME_VOICE='he-IL-Chirp3-HD-Kore',GAME_RATE=0.9;const VOICES=/^he-IL-((Standard|Wavenet)-[A-D]|Chirp3-HD-[A-Za-z]+)$/;
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
async function tts(req,env,u){if(!env.GOOGLE_TTS_KEY)return new Response('{"ok":false,"why":"no key"}',{status:503,headers:JH});
 if(u.pathname==='/api/tts/status')return new Response('{"ok":true}',{headers:JH});
 if(u.pathname==='/api/tts/top3'){/* final 3, blind, longer real passages */
  const F=['Kore','Sulafat','Leda'];
  const S=[['סיפור','לפני הרבה זמן, בממלכה רחוקה, גר דרקון קטן בשם ניצוץ. ניצוץ אהב מאוד מספרים. בכל בוקר הוא ספר את הכוכבים שנשארו בשמיים: אחד, שתיים, שלוש. יום אחד הוא גילה שכוכב אחד חסר. אתה מוכן לעזור לו למצוא אותו?'],['עידוד','כמעט! זה לא נורא לטעות, ככה לומדים. בוא ננסה עוד פעם ביחד. יופי! הצלחת! אני גאה בך.']];
  const html=`<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>גמר קולות</title><style>body{font-family:system-ui,Arial;margin:0;padding:16px;background:#f6f2e8;text-align:center}main{max-width:560px;margin:auto}h1{font-size:24px;margin:8px 0}.st{color:#555;font-size:16px;margin-bottom:12px}.c{background:#fff;border-radius:14px;padding:14px;margin:12px 0;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center}.c h2{width:100%%;margin:0;font-size:22px}.big{font-size:19px;padding:12px 16px;border:0;border-radius:12px;cursor:pointer;color:#fff}.pl{background:#3a8fc4}.pl.on{background:#f5a623}.ch{background:#4fbf63;width:100%%}.w{font-size:34px;font-weight:900;color:#2e7d32}</style><main id="m"></main>
<script>const F=${JSON.stringify(F)},S=${JSON.stringify(S)};let a;const m=document.getElementById('m');const L=F.slice().sort(()=>Math.random()-.5);
function url(v,i){return '/api/tts?t='+encodeURIComponent(S[i][1])+'&v=he-IL-Chirp3-HD-'+v+'&r=0.9';}
function play(v,i,b){if(a)a.pause();document.querySelectorAll('.pl').forEach(x=>x.classList.remove('on'));b.classList.add('on');a=new Audio(url(v,i));a.onended=()=>b.classList.remove('on');a.play();}
F.forEach(v=>S.forEach((x,i)=>fetch(url(v,i))));
m.innerHTML='<h1>גמר: 3 קולות</h1><div class="st">השמות מוסתרים. שמע כל קול בסיפור ארוך ובעידוד, כמו במשחק אמיתי, ובחר אחד.</div>'+L.map((v,n)=>'<div class="c"><h2>קול '+'אבג'[n]+'</h2>'+S.map((x,i)=>'<button class="big pl" data-n="'+n+'" data-i="'+i+'">▶ '+x[0]+'</button>').join('')+'<button class="big ch" data-n="'+n+'">זה הקול</button></div>').join('');
m.querySelectorAll('.pl').forEach(b=>b.onclick=()=>play(L[b.dataset.n],+b.dataset.i,b));
m.querySelectorAll('.ch').forEach(b=>b.onclick=()=>{if(a)a.pause();m.innerHTML='<h1>בחרת:</h1><div class="w">'+L[b.dataset.n]+'</div><p>כתוב לי את השם בצ׳אט.</p><p>אם אתה מתלבט בין שניים, השמע את שניהם לאורן ותן לו לבחור.</p><button class="big pl" onclick="location.reload()">להתחיל מחדש</button>';});
</script></html>`;
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});}
 if(u.pathname==='/api/tts/final'){/* blind "which is nicer, A or B" process: the winner stays, a new voice challenges it */
  const F=['Sulafat','Leda','Achernar','Despina','Aoede','Laomedeia','Kore'];
  const S=['שלום אורן! היום נצא יחד למסע בממלכת המספרים. מוכן?','כמה זה שבע ועוד חמש? נסה לספור על האצבעות.','החתול הקטן ישן על הכיסא, ואז קפץ אל החלון.'];
  const html=`<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>בחירת קול</title><style>body{font-family:system-ui,Arial;margin:0;padding:16px;background:#f6f2e8;text-align:center}main{max-width:520px;margin:auto}h1{font-size:24px;margin:8px 0}.st{color:#666;font-size:16px}.s{background:#fff;border-radius:12px;padding:12px;margin:14px 0;font-size:18px}.pair{display:flex;gap:12px}.pair>div{flex:1;background:#fff;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:10px}.big{font-size:22px;padding:14px;border:0;border-radius:12px;cursor:pointer;color:#fff}.pl{background:#3a8fc4}.ch{background:#4fbf63}.pl.on{background:#f5a623}h2{margin:0;font-size:22px}.w{font-size:34px;font-weight:900;color:#2e7d32}.lnk{background:none;border:0;color:#3a8fc4;font-size:16px;text-decoration:underline;cursor:pointer;margin-top:12px}</style><main id="m"></main>
<script>const F=${JSON.stringify(F)},S=${JSON.stringify(S)};let champ=F[0],k=1,a,hist=[];const m=document.getElementById('m');
function url(v,i){return '/api/tts?t='+encodeURIComponent(S[i])+'&v=he-IL-Chirp3-HD-'+v+'&r=0.9';}
function play(v,i,b){if(a)a.pause();document.querySelectorAll('.pl').forEach(x=>x.classList.remove('on'));if(b)b.classList.add('on');a=new Audio(url(v,i));a.onended=()=>b&&b.classList.remove('on');a.play();}
F.forEach(v=>S.forEach((x,i)=>fetch(url(v,i))));/* warm up so every button plays at once */
function step(){if(k>=F.length)return done();const ch=F[k],i=(k-1)%%3;const L=Math.random()<.5?[champ,ch]:[ch,champ];
  m.innerHTML='<h1>איזה קול יותר נעים לאורן?</h1><div class="st">שלב '+k+' מתוך '+(F.length-1)+' · השמות מוסתרים כדי לבחור רק לפי האוזן</div><div class="s">'+S[i]+'</div><div class="pair">'+L.map((v,n)=>'<div><h2>קול '+'אב'[n]+'</h2><button class="big pl" data-n="'+n+'">▶ השמעה</button><button class="big ch" data-n="'+n+'">זה יותר טוב</button></div>').join('')+'</div>'+(hist.length?'<button class="lnk" id="bk">חזרה שלב אחד</button>':'');
  m.querySelectorAll('.pl').forEach(b=>b.onclick=()=>play(L[b.dataset.n],i,b));m.querySelectorAll('.ch').forEach(b=>b.onclick=()=>{hist.push(champ);champ=L[b.dataset.n];k++;step();});
  const bk=document.getElementById('bk');if(bk)bk.onclick=()=>{champ=hist.pop();k--;step();};}
function done(){m.innerHTML='<h1>הקול שבחרת:</h1><div class="w">'+champ+'</div><p>האזן לו עוד פעם בשלושת המשפטים:</p>'+S.map((x,i)=>'<button class="big pl" style="width:100%%;margin:6px 0" data-i="'+i+'">▶ '+['סיפור','תרגיל','קריאה'][i]+'</button>').join('')+'<p>אם הוא מתאים, כתוב לי בצ׳אט: <b>'+champ+'</b></p><button class="lnk" id="re">להתחיל מחדש</button>';
  m.querySelectorAll('.pl').forEach(b=>b.onclick=()=>play(champ,+b.dataset.i,b));document.getElementById('re').onclick=()=>{champ=F[0];k=1;hist=[];step();};}
step();</script></html>`;
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});}
 if(u.pathname==='/api/tts/page'){const r=await fetch('https://texttospeech.googleapis.com/v1/voices?languageCode=he-IL',{headers:{'x-goog-api-key':env.GOOGLE_TTS_KEY}});const j=await r.json();
  const T='שלום אורן! היום נלמד יחד. החתול ישן על הכיסא. כמה זה שלוש ועוד ארבע? נכון, שבע!';
  const vs=(j.voices||[]).filter(v=>/Chirp3-HD|Wavenet/.test(v.name)).sort((a,b)=>(a.ssmlGender>b.ssmlGender?-1:1)||a.name.localeCompare(b.name));
  const row=v=>`<div class="r" data-v="${v.name}"><button onclick="p('${v.name}',this)">▶</button><b>${v.name.replace('he-IL-','').replace('Chirp3-HD-','')}</b><span>${v.ssmlGender==='MALE'?'גבר':'אישה'} · ${/Chirp3/.test(v.name)?'חדש':'WaveNet'}${v.name==='he-IL-Wavenet-D'?' · גבר 2':''}</span><i class="st">${[1,2,3,4,5].map(n=>`<a onclick="rate('${v.name}',${n})" data-n="${n}">★</a>`).join('')}</i></div>`;
  const html=`<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>בחירת קול</title><style>body{font-family:system-ui,Arial;margin:16px;background:#f6f2e8}h1{font-size:22px}.r{display:flex;gap:12px;align-items:center;background:#fff;margin:6px 0;padding:8px 12px;border-radius:10px}button{font-size:20px;width:48px;height:40px;border:0;border-radius:8px;background:#4fbf63;color:#fff;cursor:pointer}b{min-width:120px}span{color:#666;min-width:110px}.st{margin-inline-start:auto;font-style:normal;white-space:nowrap}.st a{font-size:26px;color:#ccc;cursor:pointer;padding:0 2px}.st a.on{color:#f5b400}#sum{background:#fff;border-radius:10px;padding:12px;margin-top:16px}#sum textarea{width:100%%;height:120px;font-size:14px;direction:rtl}#sum button{width:auto;padding:0 16px;font-size:16px}@media(max-width:600px){.r{flex-wrap:wrap}.st{width:100%%}}</style>
<h1>בחירת קול — לחצו ▶ להאזנה</h1><p>המשפט: ${T}</p>${vs.map(row).join('')}<div id="sum"><b>הדירוג שלך</b> (נשמר בדפדפן הזה)<textarea id="out" readonly></textarea><button onclick="navigator.clipboard.writeText(document.getElementById('out').value).then(()=>this.textContent='הועתק ✓')">העתקת הדירוג</button></div><script>let R={};try{R=JSON.parse(localStorage.getItem('voiceRate')||'{}')}catch(e){}function draw(){document.querySelectorAll('.r').forEach(r=>{const n=R[r.dataset.v]|0;r.querySelectorAll('.st a').forEach(x=>x.classList.toggle('on',+x.dataset.n<=n));});const L=Object.entries(R).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).map(([v,n])=>'★'.repeat(n)+' '+v.replace('he-IL-','').replace('Chirp3-HD-',''));document.getElementById('out').value=L.length?'דירוג קולות:'+String.fromCharCode(10)+L.join(String.fromCharCode(10)):'עוד לא דירגת';}function rate(v,n){R[v]=R[v]===n?0:n;try{localStorage.setItem('voiceRate',JSON.stringify(R))}catch(e){}draw();}draw();let a;function p(v,b){if(a)a.pause();b.textContent='…';a=new Audio('/api/tts?t='+encodeURIComponent(${JSON.stringify(T)})+'&v='+v+'&r=1');a.onplaying=()=>b.textContent='▶';a.onerror=()=>b.textContent='✕';a.play();}</script></html>`;
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});}
 if(u.pathname==='/api/tts/voices'){const r=await fetch('https://texttospeech.googleapis.com/v1/voices?languageCode=he-IL',{headers:{'x-goog-api-key':env.GOOGLE_TTS_KEY}});return new Response(await r.text(),{status:r.status,headers:JH});}
 if(u.pathname==='/api/tts/pregen')return pregen(req,env);
 const text=(u.searchParams.get('t')||'').slice(0,400).trim(),voice=u.searchParams.get('v')||GAME_VOICE,rate=Math.min(1.3,Math.max(.7,+u.searchParams.get('r')||GAME_RATE));
 if(!text||!VOICES.test(voice))return new Response('{"error":"bad request"}',{status:400,headers:JH});
 const key=await ttsKey(voice,rate,text);
 const hit=await env.SAVES.get(key,'arrayBuffer');if(hit)return new Response(hit,{headers:AH});
 const month=monthKey();const used=+(await env.SAVES.get(month))||0;
 if(used+text.length>TTS_CAP)return new Response('{"ok":false,"why":"monthly cap"}',{status:429,headers:JH});
 const bin=await synth(env,voice,rate,text);if(!bin.length)return new Response(JSON.stringify({ok:false,why:'google '+bin.status}),{status:502,headers:JH});
 await env.SAVES.put(key,bin);await env.SAVES.put(month,String(used+text.length),{expirationTtl:60*60*24*62});
 return new Response(bin,{headers:AH});}
const AH={'content-type':'audio/mpeg','cache-control':'public, max-age=31536000, immutable'};
const monthKey=()=>'ttsuse:'+new Date().toISOString().slice(0,7);
const ttsKey=async(voice,rate,text)=>'tts:'+await sha(voice+'|'+rate.toFixed(2)+'|'+text);
async function synth(env,voice,rate,text){const r=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize',{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':env.GOOGLE_TTS_KEY},
   body:JSON.stringify({input:{text},voice:{languageCode:'he-IL',name:voice},audioConfig:{audioEncoding:'MP3',speakingRate:rate}})});
 if(!r.ok)return {length:0,status:r.status};
 const s=atob((await r.json()).audioContent);const bin=new Uint8Array(s.length);for(let i=0;i<s.length;i++)bin[i]=s.charCodeAt(i);return bin;}
/* Create game sentences in advance (game voice only): POST {texts:[...]} up to 15; cached ones are skipped,
   one KV write per new sentence and the month counter written once per call. */
async function pregen(req,env){if(req.method!=='POST')return new Response('{"error":"method"}',{status:405,headers:JH});
 let L;try{L=(await req.json()).texts;if(!Array.isArray(L)||L.length>15||L.some(t=>typeof t!=='string'))throw 0;}catch(e){return new Response('{"error":"bad request"}',{status:400,headers:JH});}
 const month=monthKey();let used=+(await env.SAVES.get(month))||0;const u0=used;const out=[];
 for(const t of L){const text=t.slice(0,400).trim();if(!text){out.push('empty');continue;}
  const key=await ttsKey(GAME_VOICE,GAME_RATE,text);
  if(await env.SAVES.get(key,'arrayBuffer')){out.push('hit');continue;}
  if(used+text.length>TTS_CAP){out.push('cap');continue;}
  const bin=await synth(env,GAME_VOICE,GAME_RATE,text);if(!bin.length){out.push('google '+bin.status);continue;}
  await env.SAVES.put(key,bin);used+=text.length;out.push('new');}
 if(used!==u0)await env.SAVES.put(month,String(used),{expirationTtl:60*60*24*62});
 return new Response(JSON.stringify({ok:true,res:out,used,cap:TTS_CAP}),{headers:JH});}
export default{async fetch(req,env){const u=new URL(req.url);const p=u.pathname;
 if(p.startsWith('/api/tts'))return tts(req,env,u);
 const m=/^\\/api\\/save\\/([^/]+)$/.exec(p);if(m)return api(req,env,m[1]);
 if(p==='/manifest.webmanifest')return new Response(MAN,{headers:{'content-type':'application/manifest+json'}});
 if(IC[p])return new Response(b64(IC[p]),{headers:{'content-type':'image/png','cache-control':'public, max-age=86400'}});
 if(p==='/'||p==='/index.html')return new Response(HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}});
 return new Response('Not found',{status:404});}};
'''%(json.dumps(html,ensure_ascii=False),json.dumps(man,ensure_ascii=False),i192,i512)
out=d/'dist';out.mkdir(exist_ok=True)
(out/'_worker.js').write_text(js,encoding='utf-8')
print('worker',len(js.encode()))
