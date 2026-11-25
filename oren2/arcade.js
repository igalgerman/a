/* ===== 🕹️ THE ARCADE: short, bright mini-games that pay out tickets ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,SPR}=O;const sfx=O.sfx,D=O.D;
const A=()=>{const s=T.S();s.arc=s.arc||{tickets:0,best:{},plays:0};s.arc.best=s.arc.best||{};return s.arc;};
const plain=T.plainHe;let back0=null;
const GAMES=[
 {id:'balloon',n:'בַּלּוֹנִים',e:'🎈',c:'#ff4fd8',d:'לוֹחֲצִים וּמְפוֹצְצִים'},
 {id:'soccer',n:'בְּעִיטוֹת לַשַּׁעַר',e:'⚽',c:'#3cf07a',d:'בּוֹעֲטִים לַתְּשׁוּבָה'},
 {id:'basket',n:'קְלִיעוֹת לַסַּל',e:'🏀',c:'#ff8a3d',d:'עוֹנִים וְזוֹרְקִים'},
 {id:'swim',n:'מֵרוֹץ שְׂחִיָּה',e:'🏊',c:'#36d6ff',d:'מְנַצְּחִים אֶת הַדּוֹלְפִין'},
 {id:'mole',n:'הַכֵּה בַּחֲפַרְפֶּרֶת',e:'🔨',c:'#ffd23f',d:'מְהִירוּת וְחֶשְׁבּוֹן'},
 {id:'frog',n:'קְפִיצַת צְפַרְדֵּעַ',e:'🐸',c:'#b48cff',d:'קַו הַמִּסְפָּרִים'}];
const G=id=>GAMES.find(g=>g.id===id);
/* ---------- the hall ---------- */
function openArcade(back){if(back)back0=back;back0=back0||O.showMap;T.setKey(null);O.setScreen('sTal','final',back0);O.musicStart&&0;
  const a=A();T.hudT('הָאַרְקֵייד',`<div class="starcount tkc">🎟️<span>${a.tickets|0}</span></div>`);O.sayNow='הארקייד. בחר משחק.';
  const s=$('#sTal');s.innerHTML='';const hall=h('div','arc');
  hall.appendChild(h('div','arch',`<span class="neon">🕹️ הָאַרְקֵייד</span><span class="tkbig">🎟️ <b>${a.tickets|0}</b></span>`));
  const g=h('div','cabs');
  GAMES.forEach((gm,i)=>{const best=a.best[gm.id]|0;const c=h('button','cab',`<span class="scr"><span class="ce">${gm.e}</span></span><b>${gm.n}</b><small>${gm.d}</small><span class="hs">${best?`🏆 שִׂיא: ${best}`:'✨ חָדָשׁ'}</span>`);
    c.style.setProperty('--nc',gm.c);c.style.animationDelay=(i*.08)+'s';c.onclick=()=>{sfx.pop(3);start(gm.id);};g.appendChild(c);});
  hall.appendChild(g);
  const pz=h('button','prize',`<span>🎁</span><b>דּוּכַן הַפְּרָסִים</b>`);pz.onclick=()=>{sfx.pop(2);prizes();};hall.appendChild(pz);
  s.appendChild(hall);}
/* ---------- prize counter ---------- */
function prizes(){O.setScreen('sTal','final',()=>openArcade());const a=A();T.hudT('דּוּכַן הַפְּרָסִים',`<div class="starcount tkc">🎟️<span>${a.tickets|0}</span></div>`);O.sayNow='דוכן הפרסים. עשרה כרטיסים שווים שלושה יהלומים.';
  const s=$('#sTal');s.innerHTML='';const box=h('div','arc prz');
  const n=Math.floor((a.tickets|0)/10),g=n*3;
  box.innerHTML=`<div class="arch"><span class="neon">🎁 דּוּכַן הַפְּרָסִים</span></div><div class="rate"><span>🎟️×10</span><span class="rarr">←</span><span>${SPR.gem}×3</span></div><div class="tkbig huge">🎟️ <b id="tkN">${a.tickets|0}</b></div>`;
  const row=h('div','btnrow');
  if(n>0){const b=h('button','bigbtn gold huge2',`<span>הַחְלֵף ${n*10} 🎟️ בְּ-${g}</span>${SPR.gem}`);b.onclick=()=>{b.disabled=true;let k=0;const tk=$('#tkN');
      const iv=setInterval(()=>{if(!box.isConnected){clearInterval(iv);return;}k++;a.tickets--;tk.textContent=a.tickets;const f=h('span','fly','🎟️');f.style.left=(30+Math.random()*40)+'%';box.appendChild(f);setTimeout(()=>f.remove(),900);sfx.pop(k%8);
        if(k>=n*10){clearInterval(iv);O.addGems(g,b);sfx.win();O.rain();T.S().arcT=Date.now();O.persist();setTimeout(()=>{if(box.isConnected)prizes();},D(900));}},D(70));};row.appendChild(b);}
  else row.appendChild(h('div','lcap',`צָרִיךְ 10 🎟️ כְּדֵי לְהַחְלִיף. עוֹד ${10-(a.tickets|0)}!`));
  const bk=h('button','bigbtn plain sm','🕹️ <span>חֲזָרָה לָאַרְקֵייד</span>');bk.onclick=()=>openArcade();row.appendChild(bk);
  box.appendChild(row);s.appendChild(box);window.__arc.prize=()=>{const b=box.querySelector('.bigbtn.gold');if(b)b.click();};}
/* ---------- shared game frame ---------- */
let cur=null;
function frame(id,title){const gm=G(id);O.setScreen('sTal','final',()=>{if(cur)cur.stop();openArcade();});T.hudT(gm.n);
  const s=$('#sTal');s.innerHTML='';const box=h('div','arc game');box.style.setProperty('--nc',gm.c);
  const top=h('div','gtop',`<div class="rule">${title||''}</div><div class="gstat"><span class="sc">⭐ <b>0</b></span><span class="tm"></span></div>`);
  const field=h('div','field');box.append(top,field);s.appendChild(box);
  return {box,top,field,rule:(html,say)=>{top.querySelector('.rule').innerHTML=html;top.querySelector('.rule').classList.remove('pulse');void top.offsetWidth;top.querySelector('.rule').classList.add('pulse');if(say)O.say(say);},
    score:v=>{top.querySelector('.sc b').textContent=v;},time:t=>{top.querySelector('.tm').textContent=t;}};}
function countdown(F,go){const c=h('div','cdown');F.field.appendChild(c);let n=3;const tick=()=>{if(!c.isConnected)return;if(n>0){c.textContent=n;c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');sfx.blip?sfx.blip():sfx.pop(1);n--;setTimeout(tick,D(650));}
  else{c.textContent='קָדִימָה!';c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');sfx.ok(2);setTimeout(()=>{c.remove();go();},D(550));}};tick();}
function finish(id,score,tk,stars,extra){if(cur){cur.stop();cur=null;}T.setKey(null);const a=A();const best=a.best[id]|0;const rec=score>best;if(rec)a.best[id]=score;
  a.tickets=(a.tickets|0)+tk;a.plays=(a.plays|0)+1;T.S().arcT=Date.now();T.record('arc-'+id,stars,{b:score});
  T.result({title:rec&&best?'שִׂיא חָדָשׁ! 🏆':'כָּל הַכָּבוֹד!',sub:`נִקּוּד: ${score}${extra||''}`,stars,gems:0,extra:`<div class="tkwin">🎟️ +${tk}</div>`,back:()=>openArcade(),again:()=>start(id)});}
const lvl=id=>{const b=A().best[id]|0;return b;};
const COLS=[['#ff4b5c','אֲדֻמִּים'],['#3d8bff','כְּחֻלִּים'],['#ffd23f','צְהֻבִּים'],['#3cd070','יְרֻקִּים']];
/* ---------- a. balloons ---------- */
function balloon(){const F=frame('balloon','פּוֹצֵץ כַּמָּה שֶׁיּוֹתֵר בַּלּוֹנִים!');let score=0,alive=true,end=0,last=0,spawn=0,list=[],phase=0,want=null,pops=0;const best=lvl('balloon');
  const H=()=>F.field.clientHeight||400;
  const rule=()=>{if(phase===0){want=null;F.rule('🎈 פּוֹצֵץ כַּמָּה שֶׁיּוֹתֵר בַּלּוֹנִים!','פוצץ כמה שיותר בלונים!');}
    else if(phase===1){want={k:'c',v:pick(COLS)};F.rule(`פּוֹצֵץ רַק בַּלּוֹנִים <span class="cw" style="color:${want.v[0]}">${want.v[1]}</span>!`,'פוצץ רק בלונים '+plain(want.v[1]));}
    else{want={k:'even'};F.rule('פּוֹצֵץ רַק בַּלּוֹנִים עִם מִסְפָּר <b>זוּגִי</b>! (2, 4, 6...)','פוצץ רק בלונים עם מספר זוגי');}};
  const good=b=>!want||(want.k==='c'?b.col===want.v[0]:b.num%2===0);
  const mk=()=>{const col=pick(COLS)[0];const num=rand(1,20);const el=h('button','bal',phase===2?`<b>${num}</b>`:'');el.style.setProperty('--bc',col);el.style.left=rand(4,84)+'%';el.setAttribute('aria-label','בלון');
    const o={el,col,num,y:H()+10,sp:(.045+Math.random()*.03)*(1+Math.min(score,25)*.02)};el.onpointerdown=e=>{e.preventDefault();hit(o);};F.field.appendChild(el);list.push(o);};
  function hit(o){if(!alive||o.dead)return;o.dead=true;o.el.classList.add('boom');setTimeout(()=>o.el.remove(),D(260));list=list.filter(x=>x!==o);
    if(good(o)){score++;pops++;F.score(score);sfx.pop(score%8);O.floatText(o.el,'+1');if(phase===0&&pops>=(best>=8?5:8)){phase=1;pops=0;rule();}else if(phase===1&&pops>=6&&best>=12){phase=2;pops=0;rule();}}
    else{sfx.no();o.el.classList.add('bad');}}
  const loop=now=>{if(!alive||!F.field.isConnected){alive=false;return;}const dt=Math.min(50,now-last);last=now;spawn-=dt;if(spawn<=0){mk();spawn=D(phase?650:800);}
    list.forEach(o=>{o.y-=o.sp*dt;o.el.style.top=o.y+'px';});list.filter(o=>o.y<-90).forEach(o=>{o.el.remove();});list=list.filter(o=>o.y>=-90);
    const left=Math.max(0,Math.ceil((end-now)/1000));F.time('⏱️ '+left);if(now>=end){done();return;}requestAnimationFrame(loop);};
  function done(){if(!alive)return;alive=false;const st=score>=20?3:score>=12?2:1;finish('balloon',score,score,st);}
  cur={stop:()=>{alive=false;},finish:(sc)=>{if(sc!=null){score=sc;}done();},hit:()=>{const o=list.find(good);if(o)hit(o);else{score++;F.score(score);}},get score(){return score;}};
  rule();countdown(F,()=>{last=performance.now();end=last+D(45000);requestAnimationFrame(loop);});}
/* ---------- b. whack-a-mole ---------- */
function mole(){const F=frame('mole');let score=0,alive=true,end=0,tmr=0;const best=lvl('mole');const R=best>=8?20:10;
  const kind=best>=5&&Math.random()<.4?'even':'eq';const T0=rand(5,R===20?15:9);
  const mkEx=goodOne=>{if(kind==='even'){let n=rand(1,R);if(goodOne!==(n%2===0))n+=1;return {t:String(n),ok:n%2===0};}
    let v=goodOne?T0:pick([...Array(R+1).keys()].filter(x=>x!==T0));const plus=Math.random()<.6||v<1;let a,b,t;if(plus){a=rand(0,v);b=v-a;t=`${a}+${b}`;}else{b=rand(1,Math.min(9,R-v)||1);a=v+b;t=`${a}−${b}`;}return {t,ok:v===T0};};
  if(kind==='even')F.rule('🔨 הַכֵּה רַק בְּמִסְפָּרִים <b>זוּגִיִּים</b>! (2, 4, 6...)','הכה רק במספרים זוגיים');
  else F.rule(`🔨 הַכֵּה רַק כְּשֶׁהַתְּשׁוּבָה הִיא <span class="big">${T0}</span>`,'הכה רק כשהתשובה היא '+T0);
  const g=h('div','holes');const holes=[];for(let i=0;i<9;i++){const hl=h('div','hole','<div class="mole"><i class="ey"></i><i class="ey r"></i><i class="ns"></i><b class="tag"></b></div>');g.appendChild(hl);holes.push(hl);
    const m=hl.querySelector('.mole');m.onpointerdown=e=>{e.preventDefault();whack(i);};}
  F.field.appendChild(g);F.field.classList.add('mf');
  const state=Array(9).fill(null);
  function pop(){if(!alive||!g.isConnected)return;const free=[...Array(9).keys()].filter(i=>!state[i]);if(free.length){const i=pick(free);const ex=mkEx(Math.random()<.6);state[i]=ex;holes[i].querySelector('.tag').textContent=ex.t;holes[i].classList.add('up');
      const stay=D(Math.max(1100,2000-score*40));setTimeout(()=>{if(state[i]===ex){state[i]=null;holes[i].classList.remove('up');}},stay);}
    tmr=setTimeout(pop,D(Math.max(450,900-score*20)));}
  function whack(i){const ex=state[i];if(!alive||!ex)return;state[i]=null;const hl=holes[i];hl.classList.remove('up');
    if(ex.ok){score++;F.score(score);sfx.hit?sfx.hit():sfx.pop(4);hl.classList.add('bonk');setTimeout(()=>hl.classList.remove('bonk'),D(300));O.floatText(hl,'+1');}else{sfx.no();hl.classList.add('wrong');setTimeout(()=>hl.classList.remove('wrong'),D(500));}}
  const tick=()=>{if(!alive||!g.isConnected){alive=false;return;}const left=Math.max(0,Math.ceil((end-performance.now())/1000));F.time('⏱️ '+left);if(left<=0)return done();setTimeout(tick,250);};
  function done(){if(!alive)return;alive=false;clearTimeout(tmr);const st=score>=12?3:score>=7?2:1;finish('mole',score,score,st);}
  T.setKey(e=>{const n=+e.key;if(n>=1&&n<=9)whack([6,7,8,3,4,5,0,1,2][n-1]);});
  cur={stop:()=>{alive=false;clearTimeout(tmr);},finish:(sc)=>{if(sc!=null)score=sc;done();},hit:()=>{const i=state.findIndex(x=>x&&x.ok);if(i>=0)whack(i);else{score++;F.score(score);}},get score(){return score;}};
  countdown(F,()=>{end=performance.now()+D(45000);pop();tick();});}
function qGen(best){const t=best>=6?pick(['+','-','x']):pick(['+','+','-']);let a,b,ans,txt;
  if(t==='x'){a=pick([2,5,10]);b=rand(1,5);ans=a*b;txt=`${b} × ${a}`;}else if(t==='-'){a=rand(5,18);b=rand(1,Math.min(9,a));ans=a-b;txt=`${a} − ${b}`;}else{a=rand(1,10);b=rand(1,10);ans=a+b;txt=`${a} + ${b}`;}return {txt,ans};}
/* ---------- d. frog on the number line ---------- */
function frog(){const F=frame('frog');const best=lvl('frog');const MAX=best>=10?50:20;const JUMPS=MAX>20?[1,2,5,10]:[1,2,5];const R=5;let r=0,pos=0,tgt=0,used=0,tk=0,busy=false;
  F.field.classList.add('ff');const line=h('div','nline');const fr=h('div','frogp','🐸');const lily=h('div','lily','🪷');line.append(lily,fr);
  for(let i=0;i<=MAX;i++){const t=h('i','tk'+(i%5===0?' big':''),(MAX<=20||i%5===0)?`<b>${i}</b>`:'');t.style.left=(i/MAX*100)+'%';line.appendChild(t);}
  const pad=h('div','jumps');JUMPS.forEach(j=>{const b=h('button','jb',`+${j}`);b.onclick=()=>jump(j);pad.appendChild(b);});const bk=h('button','jb back','−1');bk.onclick=()=>jump(-1);pad.appendChild(bk);
  const info=h('div','jinfo');F.field.append(line,info,pad);
  const opt=n=>{let c=0;for(const j of [...JUMPS].reverse()){c+=Math.floor(n/j);n%=j;}return c;};
  const put=(el,v)=>{el.style.left=(v/MAX*100)+'%';};
  const round=()=>{pos=0;used=0;tgt=rand(MAX>20?12:6,MAX);put(fr,0);put(lily,tgt);F.rule(`🐸 עֲזֹר לַצְּפַרְדֵּעַ לִנְחֹת עַל <span class="big">${tgt}</span>`,'עזור לצפרדע לנחות על '+tgt);
    info.innerHTML=`סִבּוּב ${r+1} מִתּוֹךְ ${R} · קְפִיצוֹת: <b>0</b>`;F.time(`🎟️ ${tk}`);};
  function jump(j){if(busy)return;const np=Math.max(0,Math.min(MAX,pos+j));if(np===pos)return;pos=np;used++;put(fr,pos);fr.classList.remove('hop');void fr.offsetWidth;fr.classList.add('hop');sfx.jump?sfx.jump():sfx.pop(3);
    info.innerHTML=`סִבּוּב ${r+1} מִתּוֹךְ ${R} · קְפִיצוֹת: <b>${used}</b>`;
    if(pos===tgt){busy=true;const o=opt(tgt);const got=used<=o?3:used<=o+1?2:1;tk+=got;sfx.ok(r);O.floatText(lily,'+'+got+' 🎟️');lily.classList.add('win');
      setTimeout(()=>{if(!line.isConnected)return;lily.classList.remove('win');busy=false;r++;if(r>=R)done();else round();},D(1100));}
    else if(pos>tgt){info.innerHTML+=' · <span class="over">עָבַרְתָּ! קְפֹץ אֲחוֹרָה ↩</span>';}}
  T.setKey(e=>{const m={'1':1,'2':2,'5':5,'0':10};if(m[e.key]&&JUMPS.includes(m[e.key]))jump(m[e.key]);if(e.key==='Backspace'||e.key==='-'){e.preventDefault();jump(-1);}});
  function done(){const st=tk>=13?3:tk>=9?2:1;finish('frog',tk,tk,st);}
  cur={stop:()=>{busy=true;},finish:(sc)=>{if(sc!=null)tk=sc;done();},hit:()=>{let n=tgt-pos;for(const j of [...JUMPS].reverse()){while(n>=j){jump(j);n-=j;}}},get score(){return tk;}};
  round();}
/* ---------- shared: three big answer buttons ---------- */
function answers(q,onPick){const opts=new Set([q.ans]);let g=0;while(opts.size<3&&g++<50){const d=pick([-3,-2,-1,1,2,3,10,-10]);const v=q.ans+d;if(v>=0)opts.add(v);}
  const arr=shuffle([...opts]);const row=h('div','ans3');arr.forEach((v,k)=>{const b=h('button','ab',String(v));b.onclick=()=>onPick(v===q.ans,b,row);row.appendChild(b);});
  T.setKey(e=>{const n=+e.key;if(n>=1&&n<=3&&row.isConnected)row.children[n-1].click();});return row;}
const sayQ=t=>t.replace('×',' כפול ').replace('−',' פחות ').replace('+',' ועוד ');
/* ---------- b. soccer: kick to the corner with the right answer ---------- */
function soccer(){const F=frame('soccer');const best=lvl('soccer');const N=8;let k=0,goals=0,busy=false,q=null,right=-1;
  F.field.classList.add('pitch');
  const goal=h('div','goal','<div class="net"></div>');const corners=[0,1,2].map(i=>{const c=h('button','corner','');c.onclick=()=>kick(i);goal.appendChild(c);return c;});
  const keeper=h('div','keeper','<i class="kh"></i><i class="kb"></i><span class="gl l">🧤</span><span class="gl r">🧤</span>');goal.appendChild(keeper);
  const ball=h('div','sball','⚽');const msg=h('div','kmsg','');F.field.append(goal,ball,msg);
  const round=()=>{busy=false;q=qGen(best);const opts=new Set([q.ans]);while(opts.size<3){const v=q.ans+pick([-3,-2,-1,1,2,3]);if(v>=0)opts.add(v);}const arr=shuffle([...opts]);right=arr.indexOf(q.ans);
    corners.forEach((c,i)=>{c.textContent=arr[i];c.className='corner';});keeper.className='keeper';ball.className='sball';msg.textContent='';
    F.rule(`⚽ בְּעַט לַפִּנָּה עִם הַתְּשׁוּבָה: <span class="big ltr">${q.txt} = ?</span>`,'בעט לפינה עם התשובה. '+sayQ(q.txt));F.time(`⚽ ${k+1}/${N}`);};
  function kick(i){if(busy)return;busy=true;const ok=i===right;ball.className='sball to'+i;sfx.whoosh?sfx.whoosh():sfx.pop(2);
    const dive=ok?pick([0,1,2].filter(x=>x!==i)):i;setTimeout(()=>{keeper.className='keeper d'+dive;},D(120));
    setTimeout(()=>{if(!goal.isConnected)return;if(ok){goals++;F.score(goals);goal.classList.add('shake');msg.textContent='גּוֹל! 🎉';msg.className='kmsg win';sfx.win();setTimeout(()=>goal.classList.remove('shake'),D(500));}
      else{msg.textContent='הַשּׁוֹעֵר תָּפַס! הַתְּשׁוּבָה: '+q.ans;msg.className='kmsg';corners[right].classList.add('show');sfx.no();}
      setTimeout(()=>{if(!goal.isConnected)return;k++;if(k>=N)done();else round();},D(ok?1100:1700));},D(520));}
  function done(){const st=goals>=7?3:goals>=4?2:1;finish('soccer',goals,goals,st,` מִתּוֹךְ ${N}`);}
  T.setKey(e=>{const n=+e.key;if(n>=1&&n<=3)kick(n-1);});
  cur={stop:()=>{busy=true;},finish:sc=>{if(sc!=null)goals=sc;done();},hit:()=>kick(right),get score(){return goals;}};
  round();}
/* ---------- c. basketball: answer, then time the shot ---------- */
function basket(){const F=frame('basket');const best=lvl('basket');const N=8;let k=0,made=0,q=null,phase='q',meter=0,dir=1,last=0,alive=true;const zone=Math.max(22,34-best);
  F.field.classList.add('court');
  const hoop=h('div','hoop','<div class="board"><i></i></div><div class="rim"></div><div class="netb"></div>');const ball=h('div','bball','🏀');
  const bar=h('div','pbar3',`<i class="zone" style="left:${50-zone/2}%;width:${zone}%"></i><i class="cur"></i>`);const shoot=h('button','bigbtn gold shoot','🏀 <span>זְרֹק!</span>');
  const area=h('div','barea');const msg=h('div','kmsg','');F.field.append(hoop,ball,msg,area);
  const ask=()=>{phase='q';q=qGen(best);area.innerHTML='';ball.className='bball';msg.textContent='';
    F.rule(`🏀 עֲנֵה נָכוֹן וְתַקְבֵּל זְרִיקָה: <span class="big ltr">${q.txt} = ?</span>`,'ענה נכון ותקבל זריקה. '+sayQ(q.txt));F.time(`🏀 ${k+1}/${N}`);
    area.appendChild(answers(q,(ok,b,row)=>{if(phase!=='q')return;if(ok){b.classList.add('ok');sfx.ok(k);setTimeout(()=>{if(alive)aim();},D(350));}else{b.classList.add('bad');b.disabled=true;sfx.no();phase='x';
      setTimeout(()=>{row.querySelectorAll('.ab').forEach(x=>{if(+x.textContent===q.ans)x.classList.add('ok');});msg.textContent='הַתְּשׁוּבָה: '+q.ans;setTimeout(next,D(1300));},D(300));}}));};
  const aim=()=>{phase='aim';area.innerHTML='';area.append(bar,shoot);F.rule('👆 לְחַץ "זְרֹק!" כְּשֶׁהַפַּס בַּיָּרֹק!','לחץ זרוק כשהפס בירוק');meter=0;dir=1;last=performance.now();T.setKey(e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();throwIt();}});requestAnimationFrame(swing);};
  const swing=now=>{if(!alive||phase!=='aim'||!bar.isConnected)return;const dt=now-last;last=now;meter+=dir*dt*.09*(1+best*.02);if(meter>=100){meter=100;dir=-1;}if(meter<=0){meter=0;dir=1;}bar.querySelector('.cur').style.left=meter+'%';requestAnimationFrame(swing);};
  shoot.onclick=()=>throwIt();
  function throwIt(force){if(phase!=='aim')return;phase='fly';const ok=force||Math.abs(meter-50)<=zone/2;ball.className='bball '+(ok?'swish':'miss');sfx.whoosh?sfx.whoosh():sfx.pop(2);
    setTimeout(()=>{if(!hoop.isConnected)return;if(ok){made++;F.score(made);msg.textContent='סַל! 🎉';msg.className='kmsg win';hoop.classList.add('shake');sfx.win();setTimeout(()=>hoop.classList.remove('shake'),D(500));}else{msg.textContent='כִּמְעַט! 💪';msg.className='kmsg';sfx.no();}setTimeout(next,D(1000));},D(650));}
  function next(){if(!alive||!hoop.isConnected)return;k++;if(k>=N)done();else ask();}
  function done(){if(!alive)return;alive=false;const st=made>=7?3:made>=4?2:1;finish('basket',made,made,st,` מִתּוֹךְ ${N}`);}
  cur={stop:()=>{alive=false;},finish:sc=>{if(sc!=null)made=sc;done();},hit:()=>{if(phase==='q'){const b=[...area.querySelectorAll('.ab')].find(x=>+x.textContent===q.ans);if(b)b.click();}else if(phase==='aim')throwIt(true);},get phase(){return phase;},get score(){return made;}};
  ask();}
/* ---------- d. swim race: each right answer is a stroke ---------- */
function swim(){const F=frame('swim');const best=lvl('swim');const N=10;let you=0,rival=0,ok=0,q=null,alive=true,last=0,won=null;const rivalT=Math.max(28000,48000-best*1500);
  F.field.classList.add('pool');
  const lanes=h('div','lanes',`<div class="lane"><span class="who">אַתָּה</span><span class="swr me">🏊</span><span class="fin">🏁</span></div><div class="lane"><span class="who">דּוֹלְפִין</span><span class="swr rv">🐬</span><span class="fin">🏁</span></div>`);
  const me=lanes.querySelector('.me'),rv=lanes.querySelector('.rv');const area=h('div','barea');F.field.append(lanes,area);
  const put=()=>{me.style.left=(you/N*88)+'%';rv.style.left=(rival*88)+'%';};
  const ask=()=>{q=qGen(best);area.innerHTML='';F.rule(`🏊 עֲנֵה מַהֵר כְּדֵי לִשְׂחוֹת: <span class="big ltr">${q.txt} = ?</span>`,'ענה מהר כדי לשחות. '+sayQ(q.txt));
    area.appendChild(answers(q,(good,b)=>{if(!alive)return;if(good){you++;ok++;F.score(ok);b.classList.add('ok');me.classList.remove('stroke');void me.offsetWidth;me.classList.add('stroke');sfx.pop(4);put();if(you>=N)return end(true);setTimeout(()=>{if(alive)ask();},D(250));}
      else{b.classList.add('bad');b.disabled=true;sfx.no();}}));};
  const loop=now=>{if(!alive||!lanes.isConnected){alive=false;return;}const dt=Math.min(50,now-last);last=now;rival=Math.min(1,rival+dt/D(rivalT));put();F.time(rival>you/N?'🐬 מַקְדִּים':'🏊 מוֹבִיל!');if(rival>=1)return end(false);requestAnimationFrame(loop);};
  function end(win){if(!alive)return;alive=false;won=win;const st=win?(rival<.75?3:2):1;finish('swim',ok,ok+(win?5:0),st,win?' · נִצַּחְתָּ! 🏆':' · הַדּוֹלְפִין נִצֵּחַ הַפַּעַם');}
  cur={stop:()=>{alive=false;},finish:sc=>{if(sc!=null)ok=sc;end(ok>=N);},hit:()=>{const b=[...area.querySelectorAll('.ab')].find(x=>+x.textContent===q.ans);if(b)b.click();},get score(){return ok;}};
  put();ask();countdown(F,()=>{last=performance.now();requestAnimationFrame(loop);});}
/* ---------- wiring ---------- */
const RUN={balloon,soccer,basket,swim,mole,frog};
function start(id){T.setKey(null);RUN[id]();}
window.TAL_arcade=openArcade;T.arcade=openArcade;
window.__arc={open:openArcade,start,get cur(){return cur;},finish:sc=>cur&&cur.finish(sc),hit:()=>cur&&cur.hit(),state:()=>A(),prize:()=>{}};
})();
