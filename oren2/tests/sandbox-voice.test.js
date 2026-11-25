// Parent sandbox user (separate save, skip bar) and the voice check.
const L = require('./lib');
const {chromium}=require('playwright');const URL=L.URL;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const res=[];const ok=(n,c,i='')=>res.push((c?'PASS ':'FAIL ')+n+(i?' — '+i:''));const VP=L.VIEWPORT;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext(VP);await ctx.addInitScript(()=>{try{localStorage.clear()}catch(e){};window.__fast=true;setInterval(()=>{const c=document.querySelector('#ov:not([hidden]) .pchoice .ucard.par');if(c)c.click();},80);});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(URL);await L.noCoach(p);await sleep(500);
 await p.evaluate(()=>{const O=window.OREN,T=window.TAL;O.save.story.intro=1;O.save.gems=7;T.S().prof={an:'cat',col:'#3a8fc4',love:'art'};T.S().set.hide={lab:1};O.save.s['add-0-0']=2;O.showMap();});await sleep(300);
 await p.click('#sHome .parbtn');await p.fill('#pw1','abcd');await p.fill('#pw2','abcd');await p.keyboard.press('Enter');await sleep(300);
 await p.waitForFunction(()=>!document.querySelector('#sPar').hidden&&document.querySelector('#sPar').textContent.includes('בדקתם את הקול'),null,{timeout:8000}).catch(()=>{});
 ok('summary nudges to check voice',(await p.textContent('#sPar')).includes('בדקתם את הקול'));
 await p.evaluate(()=>window.TAL.parentPanel('voice'));await sleep(200);ok('voice check section',(await p.textContent('#sPar')).includes('בדיקת קול'));
 await p.locator('#sPar .bigbtn',{hasText:'אוקי'}).click();await sleep(200);ok('voice approved saved',await p.evaluate(()=>!!window.TAL.S().set.voiceOk));
 await p.evaluate(()=>window.TAL.parentPanel('try'));await sleep(200);await L.shot(p,{path:L.SHOTDIR+'/try.png',fullPage:true});
 await p.locator('#sPar .bigbtn',{hasText:'כניסה למשחק כהורה'}).click();await sleep(400);
 const r1=await p.evaluate(()=>({mode:window.OREN.isParentPlay,bar:!document.querySelector('.pbar2').hidden,gems:window.OREN.save.gems,home:!document.querySelector('#sHome').hidden}));
 ok('parent sandbox active with bar, own gems',r1.mode&&r1.bar&&r1.gems===500&&r1.home,JSON.stringify(r1));await L.shot(p,{path:L.SHOTDIR+'/pplay.png'});
 const r2=await p.evaluate(async()=>{const T=window.TAL,O=window.OREN;T.openGroup(T.GROUPS[1]);await new Promise(r=>setTimeout(r,200));const lab=[...document.querySelectorAll('#sTal .bld .nm')].some(e=>e.textContent.replace(/[\u0591-\u05C7]/g,'')==='המעבדה');window.__dbg=JSON.stringify({names:[...document.querySelectorAll('#sTal .bld .nm')].map(e=>e.textContent),hide:T.S().set.hide,pp:O.isParentPlay});
   const W=O.WORLDS[3];const open=O.unlocked(W.levels[5]);return {lab,open};});ok('sandbox shows everything (hidden lab, locked levels)',r2.lab&&r2.open,JSON.stringify(r2)+await p.evaluate(()=>window.__dbg));
 // skip a talents activity
 await p.evaluate(()=>window.TAL.ACT['art-mix'].run(()=>window.TAL.openHub()));await sleep(200);await p.locator('.pbar2 .pchip',{hasText:'דלג'}).click();await sleep(300);
 ok('skip marks activity in sandbox',await p.evaluate(()=>(window.TAL.S().tl['art-mix']||{}).s===3));
 // skip a math level
 await p.evaluate(()=>{const O=window.OREN;O.startLevel(O.WORLDS[2].levels[4]);});await sleep(300);await p.locator('.pbar2 .pchip',{hasText:'דלג'}).click();await sleep(300);
 ok('skip math level',await p.evaluate(()=>window.OREN.stars(window.OREN.WORLDS[2].levels[4].id)===3&&!document.querySelector('#sWorld').hidden));
 await p.locator('.pbar2 .pchip',{hasText:'חזרה ללוח'}).click();await sleep(300);
 const r3=await p.evaluate(()=>{const O=window.OREN,T=window.TAL;return {mode:O.isParentPlay,gems:O.save.gems,mix:!!T.S().tl['art-mix'],lvl:O.stars(O.WORLDS[2].levels[4].id),kept:O.save.s['add-0-0'],hide:T.S().set.hide.lab,panel:!document.querySelector('#sPar').hidden,bar:document.querySelector('.pbar2').hidden};});
 ok('back to Oren: untouched progress, panel open',!r3.mode&&r3.gems===7&&!r3.mix&&r3.lvl===0&&r3.kept===2&&r3.hide===1&&r3.panel&&r3.bar,JSON.stringify(r3));
 // try button from missions
 await p.evaluate(()=>window.TAL.parentPanel('plan'));await sleep(200);await p.locator('.tdrow').nth(1).locator('.pchip',{hasText:'נסו'}).click();await sleep(300);
 ok('try a mission from the list',await p.evaluate(()=>window.OREN.isParentPlay&&(!document.querySelector('#sTal').hidden||!document.querySelector('#sMap').hidden)));
 const pers=await p.evaluate(()=>{window.OREN.persist();return {kid:JSON.parse(localStorage.getItem('oren4-v1')).gems,par:JSON.parse(localStorage.getItem('oren4-v1-parent')).gems};});ok('separate storage',pers.kid===7&&pers.par===500,JSON.stringify(pers));
 await p.evaluate(()=>window.TAL_parentGate());await sleep(200);ok('parent gate inside sandbox goes to panel as Oren',await p.evaluate(()=>!window.OREN.isParentPlay&&!document.querySelector('#sPar').hidden));
 ok('no errors',!errs.length,errs.join('|'));await b.close();L.finish('sandbox-voice-'+L.variant,res);})();
