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
/* Google voice: classic voices only (Standard/WaveNet), every sentence created once and kept forever in KV,
   plus a monthly character cap far below Google's free tier. */
const TTS_CAP=250000;const VOICES=/^he-IL-((Standard|Wavenet)-[A-D]|Chirp3-HD-[A-Za-z]+)$/;
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
async function tts(req,env,u){if(!env.GOOGLE_TTS_KEY)return new Response('{"ok":false,"why":"no key"}',{status:503,headers:JH});
 if(u.pathname==='/api/tts/status')return new Response('{"ok":true}',{headers:JH});
 if(u.pathname==='/api/tts/final'){const F=['Sulafat','Leda','Achernar','Aoede','Despina','Laomedeia','Kore'];
  const S=[['סיפור','שלום אורן! היום נצא יחד למסע בממלכת המספרים. מוכן?'],['תרגיל','כמה זה שבע ועוד חמש? נסה לספור על האצבעות.'],['קריאה','החתול הקטן ישן על הכיסא, ואז קפץ אל החלון.']];
  const row=v=>`<div class="r"><b>${v}</b>${S.map((x,i)=>`<button onclick="p('${v}',${i},this)">▶ ${x[0]}</button>`).join('')}<button class="all" onclick="all3('${v}',this)">▶ הכל</button></div>`;
  const html=`<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>גמר קולות</title><style>body{font-family:system-ui,Arial;margin:16px;background:#f6f2e8}h1{font-size:22px}.r{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#fff;margin:8px 0;padding:10px 12px;border-radius:10px}b{min-width:110px;font-size:18px}button{font-size:16px;padding:8px 12px;border:0;border-radius:8px;background:#4fbf63;color:#fff;cursor:pointer}button.all{background:#3a8fc4}</style>
<h1>גמר — 7 הקולות שאהבת (מהירות 0.9)</h1><p>לכל קול 3 משפטים מהמשחק. בסוף כתוב לי שם של קול אחד.</p>${F.map(row).join('')}<script>const S=${JSON.stringify(S.map(x=>x[1]))};let a;function play(v,i,b,next){if(a)a.pause();const t=b.textContent;b.textContent='…';a=new Audio('/api/tts?t='+encodeURIComponent(S[i])+'&v=he-IL-Chirp3-HD-'+v+'&r=0.9');a.onplaying=()=>b.textContent=t;a.onerror=()=>b.textContent='✕';a.onended=next||null;a.play();}function p(v,i,b){play(v,i,b);}function all3(v,b){play(v,0,b,()=>play(v,1,b,()=>play(v,2,b)));}</script></html>`;
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});}
 if(u.pathname==='/api/tts/page'){const r=await fetch('https://texttospeech.googleapis.com/v1/voices?languageCode=he-IL',{headers:{'x-goog-api-key':env.GOOGLE_TTS_KEY}});const j=await r.json();
  const T='שלום אורן! היום נלמד יחד. החתול ישן על הכיסא. כמה זה שלוש ועוד ארבע? נכון, שבע!';
  const vs=(j.voices||[]).filter(v=>/Chirp3-HD|Wavenet/.test(v.name)).sort((a,b)=>(a.ssmlGender>b.ssmlGender?-1:1)||a.name.localeCompare(b.name));
  const row=v=>`<div class="r" data-v="${v.name}"><button onclick="p('${v.name}',this)">▶</button><b>${v.name.replace('he-IL-','').replace('Chirp3-HD-','')}</b><span>${v.ssmlGender==='MALE'?'גבר':'אישה'} · ${/Chirp3/.test(v.name)?'חדש':'WaveNet'}${v.name==='he-IL-Wavenet-D'?' · גבר 2':''}</span><i class="st">${[1,2,3,4,5].map(n=>`<a onclick="rate('${v.name}',${n})" data-n="${n}">★</a>`).join('')}</i></div>`;
  const html=`<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>בחירת קול</title><style>body{font-family:system-ui,Arial;margin:16px;background:#f6f2e8}h1{font-size:22px}.r{display:flex;gap:12px;align-items:center;background:#fff;margin:6px 0;padding:8px 12px;border-radius:10px}button{font-size:20px;width:48px;height:40px;border:0;border-radius:8px;background:#4fbf63;color:#fff;cursor:pointer}b{min-width:120px}span{color:#666;min-width:110px}.st{margin-inline-start:auto;font-style:normal;white-space:nowrap}.st a{font-size:26px;color:#ccc;cursor:pointer;padding:0 2px}.st a.on{color:#f5b400}#sum{background:#fff;border-radius:10px;padding:12px;margin-top:16px}#sum textarea{width:100%%;height:120px;font-size:14px;direction:rtl}#sum button{width:auto;padding:0 16px;font-size:16px}@media(max-width:600px){.r{flex-wrap:wrap}.st{width:100%%}}</style>
<h1>בחירת קול — לחצו ▶ להאזנה</h1><p>המשפט: ${T}</p>${vs.map(row).join('')}<div id="sum"><b>הדירוג שלך</b> (נשמר בדפדפן הזה)<textarea id="out" readonly></textarea><button onclick="navigator.clipboard.writeText(document.getElementById('out').value).then(()=>this.textContent='הועתק ✓')">העתקת הדירוג</button></div><script>let R={};try{R=JSON.parse(localStorage.getItem('voiceRate')||'{}')}catch(e){}function draw(){document.querySelectorAll('.r').forEach(r=>{const n=R[r.dataset.v]|0;r.querySelectorAll('.st a').forEach(x=>x.classList.toggle('on',+x.dataset.n<=n));});const L=Object.entries(R).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).map(([v,n])=>'★'.repeat(n)+' '+v.replace('he-IL-','').replace('Chirp3-HD-',''));document.getElementById('out').value=L.length?'דירוג קולות:'+String.fromCharCode(10)+L.join(String.fromCharCode(10)):'עוד לא דירגת';}function rate(v,n){R[v]=R[v]===n?0:n;try{localStorage.setItem('voiceRate',JSON.stringify(R))}catch(e){}draw();}draw();let a;function p(v,b){if(a)a.pause();b.textContent='…';a=new Audio('/api/tts?t='+encodeURIComponent(${JSON.stringify(T)})+'&v='+v+'&r=1');a.onplaying=()=>b.textContent='▶';a.onerror=()=>b.textContent='✕';a.play();}</script></html>`;
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});}
 if(u.pathname==='/api/tts/voices'){const r=await fetch('https://texttospeech.googleapis.com/v1/voices?languageCode=he-IL',{headers:{'x-goog-api-key':env.GOOGLE_TTS_KEY}});return new Response(await r.text(),{status:r.status,headers:JH});}
 const text=(u.searchParams.get('t')||'').slice(0,400).trim(),voice=u.searchParams.get('v')||'he-IL-Wavenet-B',rate=Math.min(1.3,Math.max(.7,+u.searchParams.get('r')||1));
 if(!text||!VOICES.test(voice))return new Response('{"error":"bad request"}',{status:400,headers:JH});
 const key='tts:'+await sha(voice+'|'+rate.toFixed(2)+'|'+text);
 const hit=await env.SAVES.get(key,'arrayBuffer');if(hit)return new Response(hit,{headers:{'content-type':'audio/mpeg','cache-control':'public, max-age=31536000, immutable'}});
 const month='ttsuse:'+new Date().toISOString().slice(0,7);const used=+(await env.SAVES.get(month))||0;
 if(used+text.length>TTS_CAP)return new Response('{"ok":false,"why":"monthly cap"}',{status:429,headers:JH});
 const r=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize',{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':env.GOOGLE_TTS_KEY},
   body:JSON.stringify({input:{text},voice:{languageCode:'he-IL',name:voice},audioConfig:{audioEncoding:'MP3',speakingRate:rate}})});
 if(!r.ok)return new Response(JSON.stringify({ok:false,why:'google '+r.status}),{status:502,headers:JH});
 const j=await r.json();const bin=Uint8Array.from(atob(j.audioContent),c=>c.charCodeAt(0));
 await env.SAVES.put(key,bin);await env.SAVES.put(month,String(used+text.length),{expirationTtl:60*60*24*62});
 return new Response(bin,{headers:{'content-type':'audio/mpeg','cache-control':'public, max-age=31536000, immutable'}});}
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
