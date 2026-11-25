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
export default{async fetch(req,env){const u=new URL(req.url);const p=u.pathname;
 const m=/^\\/api\\/save\\/([^/]+)$/.exec(p);if(m)return api(req,env,m[1]);
 if(p==='/manifest.webmanifest')return new Response(MAN,{headers:{'content-type':'application/manifest+json'}});
 if(IC[p])return new Response(b64(IC[p]),{headers:{'content-type':'image/png','cache-control':'public, max-age=86400'}});
 if(p==='/'||p==='/index.html')return new Response(HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}});
 return new Response('Not found',{status:404});}};
'''%(json.dumps(html,ensure_ascii=False),json.dumps(man,ensure_ascii=False),i192,i512)
out=d/'dist';out.mkdir(exist_ok=True)
(out/'_worker.js').write_text(js,encoding='utf-8')
print('worker',len(js.encode()))
