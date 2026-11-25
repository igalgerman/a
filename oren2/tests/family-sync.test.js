// Website mode: two devices share progress through a family code and a fake /api/save server.
const L = require('./lib');
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const PUB=path.join(L.ROOT,'cf','public');const KV=new Map();let puts=0;
const srv=http.createServer(async(q,r)=>{const m=/^\/api\/save\/([a-f0-9]{32})$/.exec(q.url);
  if(m){if(q.method==='GET'){const v=KV.get(m[1]);r.writeHead(v?200:404,{'content-type':'application/json'});return r.end(v||'{}');}
    if(q.method==='PUT'){let b='';q.on('data',c=>b+=c);q.on('end',()=>{puts++;KV.set(m[1],b);r.end('{"ok":true}');});return;}}
  const f=path.join(PUB,q.url==='/'?'index.html':q.url.split('?')[0].split('#')[0]);if(fs.existsSync(f)){r.end(fs.readFileSync(f));}else{r.writeHead(404);r.end();}}).listen(0);const BASE=()=>'http://localhost:'+srv.address().port;
const res=[];const ok=(n,c,i='')=>res.push((c?'PASS ':'FAIL ')+n+(i?' — '+i:''));
(async()=>{const b=await chromium.launch();const init=()=>{window.__fast=true;window.__famGap=0;};
 const A=await (await b.newContext({viewport:{width:1366,height:768}})).newPage();await A.addInitScript(init);const errs=[];A.on('pageerror',e=>errs.push('A '+e.message));
 await A.goto(BASE()+'/');await A.waitForFunction(()=>window.OREN&&window.OREN.family,null,{timeout:20000});await sleep(500);
 const fid=await A.evaluate(()=>window.OREN.family);ok('device A got a family code',/^[a-f0-9]{32}$/.test(fid||''));ok('saved to server',KV.has(fid));
 await A.evaluate(()=>{const O=window.OREN,T=window.TAL;O.save.story.intro=1;O.save.gems=33;O.save.s['add-0-0']=3;T.S().prof={an:'owl',col:'#4fae4f',love:'music'};O.persist();});await sleep(2500);
 // device B (parent's phone) opens the family link
 const B=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();await B.addInitScript(init);B.on('pageerror',e=>errs.push('B '+e.message));
 await B.goto(BASE()+'/#f='+fid);await B.waitForFunction(()=>window.OREN&&window.OREN.family&&window.OREN.save.gems===33,null,{timeout:20000}).catch(()=>{});await sleep(300);
 const rb=await B.evaluate(()=>({f:window.OREN.family,g:window.OREN.save.gems,s:window.OREN.save.s['add-0-0'],p:window.TAL.S().prof&&window.TAL.S().prof.an,hash:location.hash}));
 ok('device B joined same family and sees Oren progress',rb.f===fid&&rb.g===33&&rb.s===3&&rb.p==='owl'&&rb.hash==='',JSON.stringify(rb));
 // parent on B: set password + time limit
 await B.evaluate(()=>window.OREN.showMap());await sleep(300);await B.click('#sHome .parbtn');await B.fill('#pw1','abcd');await B.fill('#pw2','abcd');await B.keyboard.press('Enter');await sleep(300);
 await B.evaluate(()=>window.TAL.parentPanel('set'));await sleep(200);ok('family link shown in settings',(await B.textContent('#sPar')).includes('#f='+fid));
 await B.evaluate(()=>{window.TAL.parentPanel('time');});await sleep(200);await B.locator('#sPar .pchip',{hasText:'45'}).first().click();await sleep(2500);
 // meanwhile A keeps playing (newer saves)
 await A.evaluate(()=>{const O=window.OREN;O.save.gems=40;O.persist();});await sleep(2500);
 await A.evaluate(()=>window.OREN.famPull());await sleep(800);
 const ra=await A.evaluate(()=>({lim:(window.TAL.S().set.lim||{}).daily,pw:!!window.TAL.S().set.pw,g:window.OREN.save.gems}));
 ok('parent change on B reaches A and is not overwritten by A playing',ra.lim===45&&ra.pw&&ra.g===40,JSON.stringify(ra));
 await B.evaluate(()=>window.OREN.famPull());await sleep(800);ok('B sees A latest gems',await B.evaluate(()=>window.OREN.save.gems)===40);
 // parent sandbox on B must not reach the server
 const before=KV.get(fid);await B.evaluate(()=>{window.TAL.parentPanel('try');});await B.locator('#sPar .bigbtn',{hasText:'כניסה למשחק כהורה'}).click();await sleep(300);await B.evaluate(()=>{window.OREN.save.gems=999;window.OREN.persist();});await sleep(2000);
 ok('parent sandbox never uploads',JSON.parse(KV.get(fid)).gems!==999);
 ok('save note says family',(await A.evaluate(()=>{window.TAL_noHome=true;window.OREN.showJourney();const t=(document.querySelector('#saveNote')||{}).textContent||'';window.TAL_noHome=false;return t;})).includes('לַמִּשְׁפָּחָה'));
 ok('writes stay modest',puts<40,String(puts));ok('no errors',!errs.length,errs.join('|'));
 await b.close();srv.close();L.finish('family-sync',res);})();
