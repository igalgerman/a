// Users, parent password, permissions, parts on/off, gradual unlock, skip/reset, messages, badges, plan, reset.
const L = require('./lib');
const {chromium}=require('playwright');const URL=L.URL;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VP=process.argv[2]==='phone'?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{viewport:{width:1366,height:720}};
const res=[];const ok=(n,c,i='')=>res.push((c?'PASS ':'FAIL ')+n+(i?' — '+i:''));
(async()=>{const b=await chromium.launch();const ctx=await b.newContext(VP);
 await ctx.addInitScript(()=>{try{localStorage.clear()}catch(e){};window.__fast=true;setInterval(()=>{const c=document.querySelector('#ov:not([hidden]) .pchoice .ucard.par');if(c)c.click();},80);window.__ps={dictation:'prompt',db:'granted',user:'granted'};
   window.claude={use:async n=>n==='permissions'?{state:async x=>x?(window.__ps[x]||'unavailable'):{...window.__ps},request:async()=>{window.__req=(window.__req||0)+1;for(const k in window.__ps)if(window.__ps[k]==='prompt')window.__ps[k]='granted';return {...window.__ps};},manage:async()=>{}}
     :n==='dictation'?{onFinal(){},onPartial(){},onState(){},start:async()=>{},stop(){}}:null};});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|Failed to load/.test(m.text()))errs.push('console: '+m.text());});
 const shot=n=>L.shot(p,{path:L.SHOTDIR+'/u-'+(process.argv[2]||'d')+'-'+n+'.png'});
 await p.goto(URL);await L.noCoach(p);await sleep(600);
 ok('start: two user cards',await p.locator('.users .ucard').count()===2);await shot('start');
 // first parent login = create password
 await p.click('.ucard.par');await sleep(150);ok('first time asks to create password',(await p.textContent('#ov h2')).includes('יצירת'));
 await p.fill('#pw1','ab');await p.fill('#pw2','ab');await p.keyboard.press('Enter');await sleep(100);ok('short password rejected',(await p.textContent('#pgErr')).length>0);
 await p.fill('#pw1','sod1234');await p.fill('#pw2','sod1234');await p.keyboard.press('Enter');await sleep(400);
 ok('panel opens after creating password',await p.evaluate(()=>!document.querySelector('#sPar').hidden));
 ok('password stored as hash',await p.evaluate(()=>/^[0-9a-f]{64}$/.test(window.TAL.S().set.pw)));
 await sleep(300);ok('summary warns about pending permission',await p.locator('.pwarn',{hasText:'הרשאות'}).count()===1);await shot('sum');
 for(const t of ['perm','parts','prog','msg','set']){await p.evaluate(t=>window.TAL.parentPanel(t),t);await sleep(250);await shot(t);}
 // permissions
 await p.evaluate(()=>window.TAL.parentPanel('perm'));await sleep(300);const rows=await p.locator('#sPar .pst').allTextContents();ok('permission rows shown',rows.length>=3,rows.join(','));
 await p.locator('#sPar .bigbtn',{hasText:'אפשרו'}).click();await sleep(400);ok('request-all called and states refreshed',await p.evaluate(()=>window.__req===1&&window.__ps.dictation==='granted'));
 ok('after grant: all-approved note',(await p.textContent('#sPar')).includes('כל ההרשאות מאושרות'));
 // exit and wrong password
 await p.locator('#sPar .bigbtn',{hasText:'יציאה'}).click();await sleep(300);
 ok('exit lands on home with parent button',await p.evaluate(()=>!document.querySelector('#sHome').hidden)&&await p.locator('#sHome .parbtn').count()===1);
 await p.evaluate(()=>window.OREN.showJourney());ok('journey has no reset button',await p.locator('#sMap .reset').count()===0);await p.evaluate(()=>window.OREN.showMap());
 await p.click('#sHome .parbtn');await sleep(150);await p.fill('#pw1','nope');await p.keyboard.press('Enter');await sleep(150);ok('wrong password refused',(await p.textContent('#pgErr')).includes('שגויה')&&await p.evaluate(()=>document.querySelector('#sPar').hidden));
 // forgot
 await p.click('.plink');await sleep(100);await p.fill('#fq','100');await p.keyboard.press('Enter');ok('forgot: wrong answer refused',(await p.textContent('#pgErr')).includes('לא'));
 await p.fill('#fq','888');await p.keyboard.press('Enter');await sleep(100);ok('forgot: back to create password',(await p.textContent('#ov h2')).includes('יצירת'));
 await p.fill('#pw1','new123');await p.fill('#pw2','new123');await p.keyboard.press('Enter');await sleep(300);ok('new password works',await p.evaluate(()=>!document.querySelector('#sPar').hidden));
 // parts: disable building, activity, world
 const r1=await p.evaluate(async()=>{const T=window.TAL,O=window.OREN,st=T.S().set;st.hide.lab=1;st.offA['read-first']=1;st.offW.add=1;T.S().prof=null;
   T.openHub();await new Promise(r=>setTimeout(r,200));const wiz=!!document.querySelector('.profg');
   for(let k=0;k<3;k++){document.querySelector('.pfb').click();await new Promise(r=>setTimeout(r,80));}
   const prof=JSON.stringify(T.S().prof);document.querySelector('#sTal .bigbtn').click();await new Promise(r=>setTimeout(r,250));
   const head=!!document.querySelector('.hhead .hbub');const fav=!!document.querySelector('.gdoor.fav');const names=[];T.GROUPS.forEach(g=>{T.openGroup(g);document.querySelectorAll('#sTal .bld .nm').forEach(e=>names.push(e.textContent));});
   T.openBuilding(T.BUILD.find(b=>b.id==='read'));const acts=[...document.querySelectorAll('.actc .an')].map(e=>e.textContent);
   O.showJourney();await new Promise(r=>setTimeout(r,200));const hiddenCards=[...document.querySelectorAll('.worlds > .wcard2')].filter(c=>c.hidden).length;
   const d=T.dailyEnsure();return {wiz,prof,lab:names.some(n=>n.replace(/[\u0591-\u05C7]/g,'')==='המעבדה'),head,fav,first:acts.some(a=>a.includes('אוֹת רִאשׁוֹנָה')),hiddenCards,daily:d.t.some(id=>id.startsWith('sci-')||id==='read-first')};});
 ok('profile wizard on first hub visit',r1.wiz&&r1.prof.includes('an'),r1.prof);ok('favourite door marked',r1.fav);
 ok('disabled building hidden',!r1.lab);ok('disabled activity hidden',!r1.first);ok('disabled world hidden on map',r1.hiddenCards===1);ok('daily missions skip disabled parts',!r1.daily);
 await shot('hubp');
 // gradual
 const r2=await p.evaluate(async()=>{const T=window.TAL,st=T.S().set;st.hide={};st.offA={};st.grad={on:1,every:2,base:(window.OREN.save.days||[]).length,extra:0,seen:2};T.openHub();await new Promise(r=>setTimeout(r,150));
   const stt=T.BUILD.map(b=>T.bState(b));const locked=stt.filter(x=>x!=='on').length,open=stt.filter(x=>x==='on').length;const lb=T.BUILD.filter(b=>T.bState(b)!=='on');const lbl='🔒 '+T.bState(lb[0]).lock;
   window.TAL_locked(lb[3]);await new Promise(r=>setTimeout(r,100));const ov=!document.querySelector('#ov').hidden;return {locked,open,lbl,ov};});
 ok('gradual: 2 open, rest locked',r2.open===2&&r2.locked===10,JSON.stringify(r2));
 await shot('locked');await p.locator('#ov .bigbtn',{hasText:'פּוֹתֵחַ'}).click();await sleep(150);await p.fill('#pw1','new123');await p.keyboard.press('Enter');await sleep(300);
 ok('parent opens a locked building on request',await p.evaluate(()=>window.TAL.BUILD.filter(b=>window.TAL.bState(b)==='on').length)===3);
 ok('new building celebrated',await p.evaluate(()=>(window.TAL.S().set.grad.seen|0)===3));
 await p.evaluate(()=>{window.TAL.S().set.grad.on=0;});
 // progress: skip & reset world
 const r3=await p.evaluate(()=>{const T=window.TAL,O=window.OREN;T.parentPanel('prog');const row=document.querySelectorAll('#sPar .psec')[0].querySelectorAll('.prow')[1];const sk=row.querySelectorAll('.pchip')[0];sk.click();sk.click();
   const w=O.WORLDS[1];const done=w.levels.every(l=>O.stars(l.id)>0);const row2=document.querySelectorAll('#sPar .psec')[0].querySelectorAll('.prow')[1];const rs=row2.querySelectorAll('.pchip')[1];rs.click();rs.click();const cleared=w.levels.every(l=>!O.stars(l.id));return {done,cleared};});
 ok('skip world marks levels',r3.done);ok('reset world clears stars',r3.cleared);
 // message
 await p.evaluate(()=>window.TAL.parentPanel('msg'));await p.fill('#sPar textarea','אורן, כל הכבוד! אוהבים אותך');await p.locator('#sPar .pchip',{hasText:'+10'}).click();await p.locator('#sPar .bigbtn',{hasText:'שליחה'}).click();await sleep(200);
 const g0=await p.evaluate(()=>window.OREN.save.gems|0);await p.locator('#sPar .bigbtn',{hasText:'יציאה'}).click();await sleep(1200);
 ok('kid sees the message on home',await p.evaluate(()=>!document.querySelector('#ov').hidden&&document.querySelector('.pmsg')&&document.querySelector('.pmsg').textContent.includes('כל הכבוד')));await shot('msg-kid');
 await p.locator('#ov .emo').first().click();await sleep(200);const r4=await p.evaluate(()=>({g:window.OREN.save.gems|0,m:window.TAL.S().set.msg}));ok('reply + gift',r4.m.seen&&r4.m.reply==='❤️'&&r4.g===g0+10,JSON.stringify(r4));
 await p.evaluate(()=>window.TAL.parentPanel('msg'));ok('parent sees reply',(await p.textContent('#sPar')).includes('אורן הגיב'));
 // badges
 await p.evaluate(()=>{window.TAL.S().tl['read-pw']={s:2,n:1};window.OREN.showMap();});await sleep(4600);ok('badge toast',await p.locator('.toast').count()>0||await p.evaluate(()=>!!window.TAL.S().bdg.star1));
 await p.evaluate(()=>window.TAL.badges(()=>{}));await sleep(200);ok('badge wall',await p.locator('.bdg.got').count()>=1);await shot('badges');
 // daily swap
 ok('kid home has no swap buttons (simple)',await p.evaluate(()=>{window.OREN.showMap();return document.querySelectorAll('#sHome .dsw,#sHome .merow').length===0;}));
 // call parents when permission is not granted
 const r6=await p.evaluate(async()=>{window.__ps.dictation='prompt';window.TAL.ACT['read-voice'].run(()=>{});await new Promise(r=>setTimeout(r,400));return !document.querySelector('#ov').hidden&&document.querySelector('#ov h2').textContent;});
 ok('kid told to call parents for microphone',String(r6).includes('קְרָא'),String(r6));await shot('callp');
 await p.locator('#ov .bigbtn',{hasText:'הוֹרֶה'}).click();await sleep(100);await p.fill('#pw1','new123');await p.keyboard.press('Enter');await sleep(300);ok('parent approves → permission requested',await p.evaluate(()=>window.__ps.dictation==='granted'&&window.__req>=2));
 // reset keeps password & profile
 const r7=await p.evaluate(()=>{const pw=window.TAL.S().set.pw;window.TAL.parentPanel('prog');const b=[...document.querySelectorAll('#sPar .pchip')].find(x=>x.textContent.includes('איפוס כל'));b.click();b.click();const s=window.OREN.save;return {pw:s.set&&s.set.pw===pw,prof:!!s.prof,gems:s.gems|0,tl:Object.keys(s.tl||{}).length};});
 ok('full reset keeps password+profile, wipes progress',r7.pw&&r7.prof&&r7.gems===0&&r7.tl===0,JSON.stringify(r7));
 const r8=await p.evaluate(async()=>{const T=window.TAL,O=window.OREN;T.S().set.plan=['math','read','mind'];delete T.S().daily;O.showMap();await new Promise(r=>setTimeout(r,300));
   const steps=document.querySelectorAll('.today .tstep2').length;const d=T.S().daily;const ok2=d.t[0]==='math'&&T.ACT[d.t[1]].b.id==='read'&&T.ACT[d.t[2]].b.id==='mind';
   const doors=document.querySelectorAll('#sHome .door').length;document.querySelector('.door.city').click();await new Promise(r=>setTimeout(r,200));const groups=document.querySelectorAll('.gdoor').length;
   const homeBtn=!document.querySelector('#btnHome').hidden;T.openBuilding(T.BUILD[0]);await new Promise(r=>setTimeout(r,100));const homeBtn2=!document.querySelector('#btnHome').hidden;document.querySelector('#btnHome').click();await new Promise(r=>setTimeout(r,200));
   const back=!document.querySelector('#sHome').hidden;document.querySelector('.today .bigbtn').click();await new Promise(r=>setTimeout(r,300));const math=!document.querySelector('#sPlay').hidden||!document.querySelector('#sLearn').hidden||!document.querySelector('#sWorld').hidden;
   window.TAL.parentPanel('voice');const v=document.querySelector('#sPar').textContent.includes('מנוע');window.TAL.parentPanel('plan');const pl=document.querySelectorAll('#sPar .plrow').length;
   return {steps,ok2,doors,groups,homeBtn,homeBtn2,back,math,v,pl};});
 ok('home: plan respected, 3 doors, grouped city, home button, continue starts math, voice+plan tabs',r8.steps===3&&r8.ok2&&r8.doors>=3&&r8.groups===4&&!r8.homeBtn&&r8.homeBtn2&&r8.back&&r8.math&&r8.v&&r8.pl===3,JSON.stringify(r8));
 await p.evaluate(()=>{window.TAL.parentPanel('voice');});await sleep(200);await shot('voice');await p.evaluate(()=>{window.OREN.showMap();});await sleep(300);await shot('home');
 ok('no JS errors',!errs.length,errs.slice(0,5).join(' | '));
 await b.close();L.finish('parent-'+L.variant,res);})();
