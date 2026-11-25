// Arcade hall: every cabinet plays to completion, tickets, records, prize counter, real clicks.
const L = require('./lib');
const {chromium}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VP=L.VIEWPORT;const tag=process.argv[2]==='phone'?'p':'d';
const res=[];const ok=(n,c,i='')=>res.push((c?'PASS ':'FAIL ')+n+(i?' — '+i:''));
(async()=>{const b=await chromium.launch();const ctx=await b.newContext(VP);await ctx.addInitScript(()=>{try{localStorage.clear()}catch(e){};window.__fast=true;});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|Failed to load/.test(m.text()))errs.push('console: '+m.text());});
 await p.goto(L.URL);await sleep(500);
 await p.evaluate(()=>{const O=window.OREN,T=window.TAL;O.save.story.intro=1;T.S().prof={an:'cat',col:'#3a8fc4',love:'art'};window.TAL_arcade(()=>O.showMap());});await sleep(400);
 ok('arcade hall with 6 cabinets',await p.locator('.cab').count()===6);await L.shot(p,{path:L.SHOTDIR+`/arc-${tag}-hall.png`,fullPage:true});
 const ids=['balloon','soccer','basket','swim','mole','frog'];
 for(const id of ids){const t0=await p.evaluate(()=>window.__arc.state().tickets|0);const e0=errs.length;
   await p.evaluate(id=>window.__arc.start(id),id);await sleep(700);await L.shot(p,{path:L.SHOTDIR+`/arc-${tag}-${id}.png`});
   // play by hooks until result overlay appears
   for(let k=0;k<200;k++){if(await p.evaluate(()=>!document.querySelector('#ov').hidden))break;await p.evaluate(()=>window.__arc.hit());await sleep(id==='swim'||id==='basket'?120:60);
     if(k===40&&['balloon','mole'].includes(id))await p.evaluate(()=>window.__arc.finish());}
   if(!(await p.evaluate(()=>!document.querySelector('#ov').hidden)))await p.evaluate(()=>window.__arc.finish());await sleep(300);
   const r=await p.evaluate(id=>({ov:!document.querySelector('#ov').hidden,t:window.__arc.state().tickets|0,best:window.__arc.state().best[id]|0,rec:(window.TAL.S().tl['arc-'+id]||{}).s|0}),id);
   ok(`${id}: finished, tickets up, record saved`,r.ov&&r.t>t0&&r.best>0&&r.rec>0,JSON.stringify(r)+' errs '+(errs.length-e0));
   if(id==='soccer')await L.shot(p,{path:L.SHOTDIR+`/arc-${tag}-result.png`});
   await p.evaluate(()=>{document.querySelector('#ov').hidden=true;window.TAL_arcade();});await sleep(200);}
 // prize counter
 const g0=await p.evaluate(()=>window.OREN.save.gems|0);const tk=await p.evaluate(()=>window.__arc.state().tickets|0);
 await p.locator('.prize').click();await sleep(300);await L.shot(p,{path:L.SHOTDIR+`/arc-${tag}-prize.png`});
 await p.evaluate(()=>window.__arc.prize());await sleep(3500);
 const g1=await p.evaluate(()=>({g:window.OREN.save.gems|0,t:window.__arc.state().tickets|0}));ok('prize counter converts tickets to gems',g1.g===g0+Math.floor(tk/10)*3&&g1.t===tk%10,JSON.stringify({g0,tk,g1}));
 // real interaction: pop a balloon by clicking
 await p.evaluate(()=>window.__arc.start('balloon'));await sleep(1500);const bal=p.locator('.bal').first();await bal.waitFor({timeout:5000}).catch(()=>{});
 if(await bal.count()){await bal.click({force:true});await sleep(200);}ok('click pops a balloon',await p.evaluate(()=>window.__arc.cur&&window.__arc.cur.score>=1));await p.evaluate(()=>window.__arc.finish());
 // real click soccer corner
 await p.evaluate(()=>{document.querySelector('#ov').hidden=true;window.__arc.start('soccer');});await sleep(300);await p.locator('.corner').first().click();await sleep(90);ok('soccer kick by click resolves',await p.evaluate(()=>!!document.querySelector('.kmsg').textContent||document.querySelector('.tm').textContent.includes('2/')));
 await p.evaluate(()=>window.OREN.showMap());await sleep(300);
 ok('no JS errors',!errs.length,errs.slice(0,5).join(' | '));await b.close();L.finish('arcade-'+L.variant,res);})();
