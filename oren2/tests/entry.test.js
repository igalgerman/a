// Entry screen: Oren / parent buttons, parent choice (panel, play, or time together), sandbox round trip.
const L = require('./lib');
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.addInitScript(()=>{window.__fast=true});await p.goto(L.URL);await L.noCoach(p);await p.waitForTimeout(500);const r=[];
 r.push(await p.locator('.whoin .ucard').count()===2);await p.click('.ucard.par');await p.fill('#pw1','abcd');await p.fill('#pw2','abcd');await p.keyboard.press('Enter');await p.waitForTimeout(300);
 r.push(await p.locator('.pchoice .ucard').count()===3);await p.locator('.pchoice .ucard.kid').click();await p.waitForTimeout(300);r.push(await p.evaluate(()=>window.OREN.isParentPlay));
 await p.locator('.pbar2 .pchip',{hasText:'חזרה ללוח'}).click();await p.waitForTimeout(300);r.push(await p.evaluate(()=>!window.OREN.isParentPlay&&!document.querySelector('#sPar').hidden));
 await p.evaluate(()=>window.OREN.showMap());await p.waitForTimeout(200);await p.click('#sHome .parbtn');await p.fill('#pw1','abcd');await p.keyboard.press('Enter');await p.waitForTimeout(200);await p.locator('.pchoice .ucard.par').click();await p.waitForTimeout(200);r.push(await p.evaluate(()=>!document.querySelector('#sPar').hidden));
 await b.close();L.finish('entry',['two big user buttons','parent choice after password','play as parent enters sandbox','back to panel leaves sandbox','parent button on home opens panel'].map((n,i)=>(r[i]?'PASS ':'FAIL ')+n));})();
