// Reading aloud stops when the player leaves a screen (back, home, buildings, activities, arcade, dialogs, pop-up cards),
// and speech started by the new screen right after the switch still plays.
const L = require('./lib');
const {chromium}=require('playwright');const sleep=L.sleep;
const res=[];const ok=(n,c,i='')=>res.push((c?'PASS ':'FAIL ')+n+(i?' — '+i:''));
(async()=>{const b=await chromium.launch();const ctx=await b.newContext(L.VIEWPORT);
 await ctx.addInitScript(()=>{try{localStorage.clear()}catch(e){};window.__fast=true;window.__noFamily=true;
   // fake browser voice: records speak/cancel
   const fake={log:[],speaking:false,speak(u){this.log.push('speak:'+u.text);this.speaking=true;},cancel(){this.log.push('cancel');this.speaking=false;},getVoices(){return [];},onvoiceschanged:null,addEventListener(){}};
   Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(L.URL);await L.noCoach(p);await sleep(300);
 await p.evaluate(()=>{const O=window.OREN,T=window.TAL;O.save.story.intro=1;T.S().prof={an:'cat',col:'#3a8fc4',love:'art'};O.showMap();});await sleep(200);
 // put a "speaking" Google audio + browser voice in place, run a navigation, check both were stopped
 const check=async(name,nav)=>{await p.evaluate(()=>{const a={paused:false,pause(){this.paused=true;}};window.__gv.audio=a;window.__fakeA=a;speechSynthesis.speaking=true;});
   await nav();await sleep(150);
   const r=await p.evaluate(()=>({paused:window.__fakeA.paused,cleared:window.__gv.audio!==window.__fakeA,synth:!speechSynthesis.speaking}));
   ok('speech stops: '+name,r.paused&&r.cleared&&r.synth,JSON.stringify(r));};
 await check('open city',()=>p.evaluate(()=>window.TAL.openHub()));
 await check('open group',()=>p.evaluate(()=>window.TAL.openGroup(window.TAL.GROUPS[0])));
 await check('open building',()=>p.evaluate(()=>window.TAL.openBuilding(window.TAL.BUILD[0])));
 await check('back button',()=>p.click('#btnBack'));
 await check('open activity',()=>p.evaluate(()=>window.TAL.ACT['art-mix'].run(()=>window.TAL.openHub())));
 await check('home button',()=>p.evaluate(()=>{const hb=document.querySelector('#btnHome');if(hb&&!hb.hidden)hb.click();else window.OREN.showMap();}));
 await check('arcade game',()=>p.evaluate(()=>{window.TAL_arcade(()=>window.OREN.showMap());window.__arc.start('balloon');}));
 await check('journey + world',()=>p.evaluate(()=>{window.OREN.showJourney();}));
 // story dialog: next panel and closing
 await p.evaluate(()=>window.OREN.story([['nar','א'],['nar','ב']],()=>{}));await sleep(100);
 await check('dialog next',()=>p.click('#dNext'));
 await check('dialog close',()=>p.click('#dNext'));
 // pop-up card button (stays on the same screen)
 await p.evaluate(()=>{window.OREN.showMap();window.TAL.callParents('בדיקה');});await sleep(150);
 await check('pop-up card button',()=>p.evaluate(()=>{const bt=document.querySelector('#ov:not([hidden]) button');bt&&bt.click();}));
 // the new screen's own speech right after the switch is not cut
 const r=await p.evaluate(()=>{window.__fast=false;speechSynthesis.log.length=0;window.OREN.setScreen('sTal','valley',window.OREN.showMap);window.OREN.say('שָׁלוֹם');const l=speechSynthesis.log.slice();window.__fast=true;return l;});
 ok('speech said right after a switch still plays',/^speak:/.test(r[r.length-1]||''),JSON.stringify(r));
 ok('no errors',!errs.length,errs.join('|'));await b.close();L.finish('voice-stop',res);})();
