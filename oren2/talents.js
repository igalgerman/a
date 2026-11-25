/* ===== עִיר הַכִּשְׁרוֹנוֹת — talents city (injected into index.html by build) ===== */
(()=>{'use strict';
const O=window.OREN;if(!O)return;
const {h,$,rand,pick,shuffle,ICON,SPR,sprite}=O;
const sfx=O.sfx;const D=O.D;
const S=()=>{const s=O.save;s.tl=s.tl||{};s.mood=s.mood||[];s.jar=s.jar||[];s.art=s.art||[];s.set=s.set||{brk:25,hide:{}};s.set.hide=s.set.hide||{};s.time=s.time||{};s.typ=s.typ||{best:{},wpm:0};return s;};
const today=O.today;
const L_=t=>`<span class="ltr">${t}</span>`;
const nb=n=>`<b>${n}</b>`;
const plainHe=s=>String(s).replace(/<[^>]+>/g,' ').replace(/[֑-ׇ]/g,'').replace(/\s+/g,' ').trim();

/* ---------- extra pixel sprites ---------- */
const P=(rows,pal)=>sprite(rows,pal);
const X={
  sun:P(['Y...Y...Y','.Y.YYY.Y.','..YYYYY..','.YYOOOYY.','YYOOOOOYY','.YYOOOYY.','..YYYYY..','.Y.YYY.Y.','Y...Y...Y'],{Y:'#ffcf4d',O:'#ffe27a'}),
  moon:P(['..MMMM..','.MMMM...','MMMM....','MMM.....','MMM.....','MMMM....','.MMMM...','..MMMM..'],{M:'#fff1a8'}),
  ball:P(['..BBRR..','.BBBRRR.','BBBWWRRR','BBWWWWRR','YYWWWWGG','YYYWWGGG','.YYYGGG.','..YYGG..'],{B:'#3a8fc4',R:'#e4572e',Y:'#ffd166',G:'#4fae4f',W:'#ffffff'}),
  car:P(['...RRRRR....','..RWWRWWR...','.RRRRRRRRRR.','RRRRRRRRRRRR','RRRRRRRRRRRY','.KK.....KK..','.KK.....KK..'],{R:'#e4572e',W:'#bfe6f5',K:'#2b2b2b',Y:'#ffd166'}),
  bird:P(['....BB...','...BBBB..','..BBKBBOO','BBBBBBB..','.BBBBBB..','..BBBB...','...O.O...'],{B:'#3a8fc4',K:'#1d2631',O:'#f28c28'}),
  cake:P(['...RR...','.IIIIII.','IIPIIPII','BBBBBBBB','PPPPPPPP','BBBBBBBB','BBBBBBBB'],{R:'#e63946',I:'#ffffff',P:'#ff9cc2',B:'#c68b59'}),
  apple:P(['....S...','...SGG..','.RRRRRR.','RrRRRRRR','RrRRRRRR','RRRRRRRR','.RRRRRR.','..RR.RR.'],{S:'#6b4423',G:'#52b788',R:'#e63946',r:'#ff9a9a'}),
  fish:P(['..BBBB..B','.BbbbbBBB','BEbbbbbB.','BbbbbbbB.','.BbbbbBBB','..BBBB..B'],{B:'#3d8fd1',b:'#8cc8f2',E:'#1b1b1b'}),
  bookS:P(['.RRRRRR.','RRRRRRRW','RRYYRRRW','RRRRRRRW','RRRRRRRW','RRRRRRRW','RRRRRRRW','.RRRRRRW'],{R:'#c0392b',Y:'#ffd166',W:'#fffaf0'}),
  hat:P(['...BBBB...','...BBBB...','...BBBB...','...RRRR...','BBBBBBBBBB','.BBBBBBBB.'],{B:'#2b2b3a',R:'#e4572e'}),
  boat:P(['.....W......','.....WW.....','.....WWW....','.....WWWW...','.....P......','BBBBBBBBBBBB','.BBBBBBBBBB.','..BBBBBBBB..'],{W:'#ffffff',P:'#5a5f66',B:'#94613a'}),
  key:P(['.YYY......','Y...Y.....','Y...YYYYYY','Y...Y..Y.Y','.YYY......'],{Y:'#e9b949'}),
  heart:P(['.RR.RR.','RRRRRRR','RRRRRRR','.RRRRR.','..RRR..','...R...'],{R:'#e4572e'}),
  cup:P(['BBBBBB..','BBBBBBBB','BBBBBB.B','BBBBBB.B','BBBBBBBB','BBBBBB..','.BBBB...'],{B:'#3a8fc4'}),
  egg:P(['..WW..','.WWWW.','.WWWW.','WWWWWW','WWWWWW','WWWWWW','.WWWW.','..WW..'],{W:'#fffaf0'}),
  shoe:P(['..RR......','..RRR.....','..RRRRRR..','RRRRRRRRRR','WWWWWWWWWW'],{R:'#e4572e',W:'#ffffff'}),
  cloud:P(['...WWW....','..WWWWW.W.','..WWWWWWW.','.WWWWWWWWW','WWWWWWWWWW','.WWWWWWWW.'],{W:'#ffffff'}),
  log:P(['.BBBBBBBB.','BbBBBBBBRR','BBBBBBBBRr','BbBBBBBBRR','.BBBBBBBB.'],{B:'#94613a',b:'#6b4423',R:'#e9c8a0',r:'#c8925a'}),
  stone:P(['..SSSS..','.SSsSSS.','SSSSSSsS','SsSSSSSS','.SSSSSS.'],{S:'#8d939a',s:'#b9bfc5'}),
  leaf:P(['.....GG','...GGGG','..GGgGG','.GGgGG.','GGgGG..','.GG....','G......'],{G:'#4fae4f',g:'#8acb68'}),
  coin:P(['.YYYY.','YYyyYY','YyYYyY','YyYYyY','YYyyYY','.YYYY.'],{Y:'#e9b949',y:'#fff1a8'}),
  nail:P(['SSSSS','..S..','..S..','..S..','..S..','..S..','...S.'],{S:'#6b737a'}),
  cork:P(['.CCCC.','CcCCcC','CCCCCC','CcCCcC','.CCCC.'],{C:'#c8925a',c:'#94613a'}),
  clip:P(['.SSSS.','S....S','S.SS.S','S.S..S','S.S..S','S.SSSS','S.....','.SSSSS'],{S:'#9aa1a8'}),
  screw:P(['SSSSS','SKSKS','.SSS.','.SKS.','.SSS.','.SKS.','..S..'],{S:'#9aa1a8',K:'#5a5f66'}),
  pencil:P(['......Pk','.....PPP','....YYP.','...YYY..','..YYY...','.WYY....','WW......'],{P:'#ff9cc2',k:'#a24b6e',Y:'#ffd166',W:'#e9c8a0'}),
  magnet:P(['RR..BB','RR..BB','RR..BB','RR..BB','RRRRBB','.RRRB.'],{R:'#e4572e',B:'#3a8fc4'}),
  note:P(['....KKK','....K.K','....K..','....K..','.KKKK..','KKKKK..','.KKK...'],{K:'#23303b'}),
  flask:P(['..GG..','..GG..','..GG..','.GGGG.','GGLLGG','GLLLLG','GLLLLG','.GGGG.'],{G:'#9aa1a8',L:'#7cc35f'}),
  palette:P(['..WWWW..','.WRWWBW.','WWWWWWWW','WYWWWWW.','WWWGW...','.WWWW...'],{W:'#e9c8a0',R:'#e4572e',B:'#3a8fc4',Y:'#ffd166',G:'#4fae4f'}),
  puzzle:P(['..PP....','PPPPPP..','PPPPPPGG','.PPPPGGG','.PPPGGGG','..PPGGG.','....GG..'],{P:'#8e6fd1',G:'#3cc8bb'}),
  globe:P(['..BBBB..','.BGGBBB.','BGGGBBGB','BBGBBGGB','BBBBGGBB','BGBBBGBB','.BBGBBB.','..BBBB..'],{B:'#3a8fc4',G:'#4fae4f'}),
  keys:P(['KKKKKKKKKK','KWKWKWKWKK','KKKKKKKKKK','KWKWKWKWKK','KKKKKKKKKK','KWWWWWWWKK','KKKKKKKKKK'],{K:'#5a5f66',W:'#f4e4c1'}),
  abc:P(['.RR.BBB..GG','R..RB..BG..','RRRRBBB.G..','R..RB..BG..','R..RBBB..GG'],{R:'#e4572e',B:'#3a8fc4',G:'#4fae4f'}),
  jar:P(['.KKKKKK.','KCCCCCCK','.K....K.','K......K','K......K','K......K','K......K','.KKKKKK.'],{K:'#5a7f9a',C:'#c8925a'}),
  pen:P(['......K','.....KY','....KYY','...KYY.','..KYY..','.PYY...','PP.....'],{K:'#23303b',Y:'#3a8fc4',P:'#23303b'}),
  portal:P(['..PPPPPP..','.PppppppP.','PpPPPPPPpP','PpPyyyyPpP','PpPyYYyPpP','PpPyYYyPpP','PpPyyyyPpP','PpPPPPPPpP','.PppppppP.','..PPPPPP..'],{P:'#6c4fc1',p:'#b48cf2',y:'#ffd166',Y:'#fff1a8'})
};
const ALLSPR=k=>X[k]||SPR[k]||'';
const FACE=(rows,col)=>sprite(rows,{Y:col||'#ffd166',K:'#1d2631',R:'#e4572e',B:'#3a8fc4'});
const FACES={
  happy:{n:'שָׂמֵחַ',s:FACE(['...YYYY...','.YYYYYYYY.','.YYYYYYYY.','YYYKYYKYYY','YYYKYYKYYY','YYYYYYYYYY','YYKYYYYKYY','.YYKKKKYY.','.YYYYYYYY.','...YYYY...'])},
  calm:{n:'רָגוּעַ',s:FACE(['...YYYY...','.YYYYYYYY.','.YYYYYYYY.','YYYYYYYYYY','YYKKYYKKYY','YYYYYYYYYY','YYYYYYYYYY','.YYKKKKYY.','.YYYYYYYY.','...YYYY...'],'#a8e0c0')},
  excited:{n:'נִרְגָּשׁ',s:FACE(['...YYYY...','.YYYYYYYY.','.YKKYYKKY.','YYKKYYKKYY','YYYYYYYYYY','YYYKKKKYYY','YYYKRRKYYY','.YYKKKKYY.','.YYYYYYYY.','...YYYY...'],'#ffcf4d')},
  tired:{n:'עָיֵף',s:FACE(['...YYYY...','.YYYYYYYY.','.YYYYYYYY.','YYYYYYYYYY','YKKKYYKKKY','YYYYYYYYYY','YYYYYYYYYY','.YYYKKYYY.','.YYYYYYYY.','...YYYY...'],'#c9c3e6')},
  sad:{n:'עָצוּב',s:FACE(['...YYYY...','.YYYYYYYY.','.YYYYYYYY.','YYYKYYKYYY','YYYKYYKYYY','YYBYYYYYYY','YYYKKKKYYY','.YKYYYYKY.','.YYYYYYYY.','...YYYY...'],'#9ccdf5')},
  angry:{n:'כּוֹעֵס',s:FACE(['...YYYY...','.YYYYYYYY.','.YKYYYYKY.','YYYKYYKYYY','YYYKYYKYYY','YYYYYYYYYY','YYYKKKKYYY','.YKYYYYKY.','.YYYYYYYY.','...YYYY...'],'#ff8a5c')}
};

/* ---------- shared UI ---------- */
let KEY=null;
addEventListener('keydown',e=>{if($('#sTal').hidden||!KEY||!$('#ov').hidden||!$('#dlg').hidden)return;KEY(e);});
const hudT=(title,extra='')=>O.hud(`<div class="chip">${title}</div>${extra}`);
const progressBar=(i,n)=>`<div class="progress">${Array.from({length:n},(_,k)=>`<i class="pb${k<i?' on':k===i?' cur':''}"></i>`).join('')}</div>`;
const starsHTML=st=>`<div class="stars">${[0,1,2].map(k=>`<span style="animation-delay:${.3+k*.35}s">${k<st?SPR.star:SPR.starOff}</span>`).join('')}</div>`;
function record(id,st,extra){const s=S();const c=s.tl[id]||{s:0,n:0,b:0};c.s=Math.max(c.s|0,st|0);c.n=(c.n|0)+1;if(extra&&extra.b!=null)c.b=Math.max(c.b|0,extra.b|0);s.tl[id]=c;dailyMark(id);O.persist();}
function result(o){const ov=$('#ov');ov.hidden=false;
  ov.innerHTML=`<div class="card"><h2>${o.title||'כָּל הַכָּבוֹד!'}</h2>${o.sub?`<div class="sub">${o.sub}</div>`:''}${o.stars!=null?starsHTML(o.stars):''}${o.gems?`<div class="gain">+${o.gems} ${SPR.gem}</div>`:''}${o.extra||''}</div>`;
  const row=h('div','btnrow');if(o.again){const a=h('button','bigbtn plain sm',ICON.redo+'<span>שׁוּב</span>');a.onclick=()=>{ov.hidden=true;o.again();};row.appendChild(a);}
  const b=h('button','bigbtn',ICON.play+'<span>הַמְשֵׁךְ</span>');b.onclick=()=>{ov.hidden=true;o.back();};row.appendChild(b);ov.firstChild.appendChild(row);
  O.duck(true);setTimeout(()=>O.duck(false),D(2000));sfx.win();if(o.stars!=null)for(let k=0;k<o.stars;k++)setTimeout(()=>sfx.star(k),D(300+k*350));O.rain();setTimeout(()=>b.focus(),300);}
function finishAct(id,errors,n,gems,back,again,title){const st=errors<=Math.max(1,n*.1)?3:errors<=Math.max(3,n*.3)?2:1;const bonus=5+st*2;O.addGems(bonus);record(id,st);result({title,stars:st,gems:gems+bonus,back,again});}
/* generic multiple-choice quiz: q = {pr, opts, ans, cls, ltr, play, auto, reveal(el), explain, key} */
function quiz(o){const qs=[],seen=new Set();let t=0;while(qs.length<o.n&&t++<400){const q=o.gen(qs.length);const k=q.key||(q.pr+'|'+q.ans);if(seen.has(k))continue;seen.add(k);qs.push(q);}
  let i=0,err=0,gems=0,lock=false,tries=0;O.setScreen('sTal',o.bg||'valley',o.back);
  const s=$('#sTal');s.innerHTML='';const wrap=h('div','tq');s.appendChild(wrap);
  const render=()=>{const q=qs[i];tries=0;lock=false;hudT(o.title,progressBar(i,qs.length));O.sayNow=q.say||plainHe(q.pr);
    wrap.innerHTML='';const card=h('div','prq tqc',q.pr);if(q.play){const pb=h('button','hintbtn',ICON.say+`<span>${q.playLbl||'הַשְׁמֵעַ'}</span>`);pb.onclick=q.play;card.appendChild(pb);}
    wrap.appendChild(card);const row=h('div','chs'+(q.ltr?' ltr':''));q.opts.forEach((op,k)=>{const b=h('button','chb '+(q.cls||''),op);b.onclick=()=>pickA(k,b);row.appendChild(b);});wrap.appendChild(row);
    const ex=h('div','hintbox');ex.hidden=true;wrap.appendChild(ex);card.classList.add('flashin');if(q.auto&&q.play)setTimeout(()=>{if(qs[i]===q)q.play();},D(350));};
  const resolve=(q)=>{const ex=wrap.querySelector('.hintbox');if(q.explain){ex.hidden=false;ex.innerHTML=`<div class="cap">${q.explain}</div>`;}if(q.reveal)q.reveal(wrap.querySelector('.tqc'));};
  function pickA(k,b){if(lock||b.disabled)return;const q=qs[i];
    if(k===q.ans){lock=true;b.classList.add('ok');sfx.ok(i);const g=tries?1:2;gems+=g;O.addGems(g,b);O.floatText(b,'+'+g);resolve(q);setTimeout(next,D(q.explain||q.reveal?2300:1000));return;}
    tries++;err++;b.classList.add('bad');b.disabled=true;sfx.no();
    if(tries>=2||q.opts.length<=2){lock=true;const c=wrap.querySelector('.chs').children[q.ans];c.classList.add('show');resolve(q);setTimeout(next,D(2600));}}
  function next(){if(!wrap.isConnected)return;i++;if(i>=qs.length){KEY=null;finishAct(o.id,err,qs.length,gems,o.back,()=>quiz(o),o.doneTitle);}else render();}
  KEY=e=>{if(/^[1-9]$/.test(e.key)){const b=wrap.querySelector('.chs')&&wrap.querySelector('.chs').children[+e.key-1];if(b)b.click();}};
  window.__quiz={get ans(){return qs[i]&&qs[i].ans;},get i(){return i;},get wrap(){return wrap;}};
  render();}

/* ---------- buildings & activities registry ---------- */
const BUILD=[];const ACT={};
function building(b){BUILD.push(b);b.acts.forEach(a=>{ACT[a.id]=a;a.b=b;});}
function actStars(id){return (S().tl[id]||{}).s|0;}
function openHub(){KEY=null;O.setScreen('sTal','valley',O.showMap);hudT('עִיר הַכִּשְׁרוֹנוֹת',`<div class="starcount">${SPR.star}<span>${Object.values(S().tl).reduce((a,c)=>a+(c.s|0),0)}</span></div>`);
  O.sayNow='עיר הכשרונות. בחר בניין.';const s=$('#sTal');s.innerHTML='';
  s.appendChild(h('div','whead',`<span class="gd bob">${X.portal}</span><h1>עִיר הַכִּשְׁרוֹנוֹת</h1>`));
  const grid=h('div','hub');
  BUILD.filter(b=>!S().set.hide[b.id]).forEach(b=>{const got=b.acts.reduce((a,x)=>a+actStars(x.id),0),max=b.acts.length*3;
    const c=h('button','wcard2 bld',`<span class="ico">${b.icon()}</span><span class="nm">${b.name}</span><span class="bar"><i style="width:${got/max*100}%"></i></span><span class="cnt">${SPR.star}${got}/${max}</span>`);c.style.setProperty('--lc',b.color);
    c.onclick=()=>openBuilding(b);grid.appendChild(c);});
  s.appendChild(grid);}
function openBuilding(b){KEY=null;O.setScreen('sTal',b.bg,openHub);hudT(b.name);O.sayNow=plainHe(b.name);const s=$('#sTal');s.innerHTML='';
  s.appendChild(h('div','whead',`<span class="gd">${b.icon()}</span><h1>${b.name}</h1>`));if(b.blurb)s.appendChild(h('div','lsent',b.blurb));
  const grid=h('div','acts');
  b.acts.forEach(a=>{if(a.avail&&!a.avail())return;const st=actStars(a.id);const c=h('button','actc',`<span class="ai">${a.icon()}</span><span class="an">${a.name}</span><span class="st">${[0,1,2].map(k=>k<st?SPR.star:SPR.starOff).join('')}</span>`);
    c.onclick=()=>{sfx.pop(2);a.run(()=>openBuilding(b));};grid.appendChild(c);});
  s.appendChild(grid);}

/* ---------- daily missions ---------- */
function dailyEnsure(){const s=S();if(s.daily&&s.daily.d===today())return s.daily;const ids=Object.keys(ACT).filter(id=>!S().set.hide[ACT[id].b.id]&&!ACT[id].noDaily);const pickIds=shuffle(ids).slice(0,2);
  s.daily={d:today(),t:['math',...pickIds],done:[0,0,0],claimed:0};O.persist();return s.daily;}
function dailyMark(id){const d=dailyEnsure();const i=d.t.indexOf(id);if(i>=0&&!d.done[i]){d.done[i]=1;}}
O.on('levelDone',(lv)=>{if(!lv||lv.type==='train')return;const d=dailyEnsure();if(!d.done[0]){d.done[0]=1;O.persist();}});
function dailyCard(){const d=dailyEnsure();const card=h('div','daily');
  const names=d.t.map(id=>id==='math'?'שָׁלָב בְּחֶשְׁבּוֹן':ACT[id]?ACT[id].name:'');
  card.innerHTML=`<div class="dh">מְשִׂימוֹת הַיּוֹם</div>`;
  d.t.forEach((id,i)=>{const b=h('button','dt'+(d.done[i]?' ok':''),`<span class="dc">${d.done[i]?'✓':''}</span><span class="di">${id==='math'?SPR.tree:(ACT[id]?ACT[id].icon():'')}</span><span>${names[i]}</span>`);
    b.onclick=()=>{if(id==='math'){O.showMap();return;}const a=ACT[id];if(a)a.run(()=>O.showMap());};card.appendChild(b);});
  const all=d.done.every(Boolean);
  if(all&&!d.claimed){const c=h('button','bigbtn gold sm',SPR.gem+'<span>קַבֵּל 15 יַהֲלוֹמִים!</span>');c.onclick=()=>{d.claimed=1;O.addGems(15,c);sfx.win();O.rain();O.persist();c.remove();};card.appendChild(c);}
  else if(all)card.appendChild(h('div','dok','כָּל הַכָּבוֹד! סִיַּמְתָּ אֶת כָּל הַמְּשִׂימוֹת.'));
  return card;}

/* ---------- map integration ---------- */
O.on('map',m=>{const tb=m.querySelector('.topbar');if(tb){const b=h('button','tool hubtool',`<span class="ti">${X.portal}</span><span>עִיר הַכִּשְׁרוֹנוֹת</span>`);b.onclick=openHub;tb.insertBefore(b,tb.firstChild);}
  const grid=m.querySelector('.worlds');if(grid)grid.parentNode.insertBefore(dailyCard(),grid);
  const rs=m.querySelector('.reset');const pb=h('button','parbtn','לְהוֹרִים: הַחְזִיקוּ לְחִיצָה');let t=0;
  pb.onpointerdown=()=>{pb.classList.add('hold');t=setTimeout(()=>{pb.classList.remove('hold');parentGate();},1500);};pb.onpointerup=pb.onpointerleave=()=>{pb.classList.remove('hold');clearTimeout(t);};
  pb.onkeydown=e=>{if(e.key==='Enter')parentGate();};
  if(rs)rs.parentNode.insertBefore(pb,rs);else m.appendChild(pb);});
O.on('kingdomScene',sc=>{const s=S();if(s.kpic!=null&&s.art[s.kpic]){const f=h('div','kpic',artSVG(s.art[s.kpic]));sc.querySelector('.ktop').appendChild(f);}});

/* ---------- time tracking & break reminder ---------- */
let lastAct=Date.now(),session=0,snooze=0;
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{lastAct=Date.now();},true));
setInterval(()=>{if(document.hidden||Date.now()-lastAct>60000||$('#hud').hidden)return;const s=S();const d=today();s.time[d]=(s.time[d]|0)+15;session+=15;
  if(session%60===0)O.persist();
  const lim=(s.set.brk|0)*60;if(lim&&session>=lim+snooze&&$('#ov').hidden&&$('#dlg').hidden&&$('#sPlay').hidden){breakTime();}},15000);
function breakTime(){const ov=$('#ov');ov.hidden=false;ov.innerHTML=`<div class="card"><div class="bk">${FACES.calm.s}</div><h2>זְמַן לְהַפְסָקָה קְטַנָּה</h2><div class="sub">שִׂחַקְתָּ הַרְבֵּה! אֶפְשָׁר לְהִתְמַתֵּחַ, לִשְׁתּוֹת מַיִם, אוֹ לִנְשֹׁם יַחַד.</div></div>`;
  const row=h('div','btnrow');const a=h('button','bigbtn',ICON.play+'<span>נְשִׁימָה יַחַד</span>');a.onclick=()=>{ov.hidden=true;session=0;snooze=0;ACT['mind-breath'].run(openHub);};
  const b=h('button','bigbtn plain sm',ICON.redo+'<span>עוֹד קְצָת</span>');b.onclick=()=>{ov.hidden=true;snooze+=600;};row.append(a,b);ov.firstChild.appendChild(row);sfx.star(0);}

/* exports for other chunks */
window.TAL={S,X,ALLSPR,FACES,quiz,result,record,finishAct,building,ACT,BUILD,openHub,openBuilding,hudT,progressBar,starsHTML,plainHe,L_,nb,dailyEnsure,setKey:f=>{KEY=f;},get key(){return KEY;},breakTime,artSVG:(...a)=>artSVG(...a)};
function artSVG(str){return window.TAL_artSVG?window.TAL_artSVG(str):'';}
function parentGate(){window.TAL_parentGate&&window.TAL_parentGate();}
})();

/* ===== READING · ENGLISH · WORLD · STORIES ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,ICON,SPR}=O;const {X,ALLSPR,quiz,building,L_,nb}=T;const sfx=O.sfx,D=O.D;
const WORDS=[['חָתוּל',['חָ','תוּל'],'cat','cat'],['כֶּלֶב',['כֶּ','לֶב'],'dog','dog'],['דָּג',['דָּג'],'fish','fish'],['עֵץ',['עֵץ'],'tree','tree'],['פֶּרַח',['פֶּ','רַח'],'flower','flower'],
 ['שֶׁמֶשׁ',['שֶׁ','מֶשׁ'],'sun','sun'],['יָרֵחַ',['יָ','רֵחַ'],'moon','moon'],['כּוֹכָב',['כּוֹ','כָב'],'star','star'],['בַּיִת',['בַּ','יִת'],'hut','house'],['כַּדּוּר',['כַּ','דּוּר'],'ball','ball'],
 ['תַּפּוּחַ',['תַּ','פּוּחַ'],'apple','apple'],['מְכוֹנִית',['מְ','כוֹ','נִית'],'car','car'],['צִפּוֹר',['צִ','פּוֹר'],'bird','bird'],['עוּגָה',['עוּ','גָה'],'cake','cake'],['סֵפֶר',['סֵ','פֶר'],'bookS','book'],
 ['כּוֹבַע',['כּוֹ','בַע'],'hat','hat'],['סִירָה',['סִי','רָה'],'boat','boat'],['מַפְתֵּחַ',['מַפְ','תֵּחַ'],'key','key'],['לֵב',['לֵב'],'heart','heart'],['כּוֹס',['כּוֹס'],'cup','cup'],
 ['בֵּיצָה',['בֵּי','צָה'],'egg','egg'],['נַעַל',['נַ','עַל'],'shoe','shoe'],['דֶּגֶל',['דֶּ','גֶל'],'flag','flag'],['כִּבְשָׂה',['כִּבְ','שָׂה'],'sheep','sheep'],['דְּרָקוֹן',['דְּ','רָ','קוֹן'],'dragon','dragon'],
 ['קֶשֶׁת',['קֶ','שֶׁת'],'rainbow','rainbow'],['פָּנָס',['פָּ','נָס'],'lantern','lamp'],['עָנָן',['עָ','נָן'],'cloud','cloud'],['יַהֲלוֹם',['יַ','הֲ','לוֹם'],'gem','diamond']].map(([w,syl,spr,en])=>({w,syl,spr,en}));
T.WORDS=WORDS;
const pic=w=>`<span class="pic">${ALLSPR(w.spr)}</span>`;
const first=w=>w.w.replace(/[֑-ׇ]/g,'')[0];
const others=(w,n,f)=>shuffle(WORDS.filter(x=>x!==w&&(!f||f(x)))).slice(0,n);
const sayEn=t=>{if(!('speechSynthesis' in window)||window.__fast)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';const v=speechSynthesis.getVoices().find(v=>/^en/i.test(v.lang));if(v)u.voice=v;u.rate=.85;speechSynthesis.speak(u);};
/* sentences */
const SENT=[['הֶחָתוּל יָשֵׁן עַל הַכִּסֵּא.','מִי יָשֵׁן?','cat',['dog','bird']],['הַכֶּלֶב רָץ אַחֲרֵי הַכַּדּוּר.','אַחֲרֵי מָה הַכֶּלֶב רָץ?','ball',['apple','car']],
 ['הַצִּפּוֹר עָפָה אֶל הָעֵץ.','לְאָן עָפָה הַצִּפּוֹר?','tree',['hut','boat']],['אוֹרֶן אוֹכֵל תַּפּוּחַ אָדֹם.','מָה אוֹרֶן אוֹכֵל?','apple',['cake','egg']],
 ['בַּלַּיְלָה רוֹאִים אֶת הַיָּרֵחַ.','מָה רוֹאִים בַּלַּיְלָה?','moon',['sun','rainbow']],['הַדָּג שׂוֹחֶה בַּיָּם.','מִי שׂוֹחֶה?','fish',['sheep','dragon']],
 ['אַבָּא קָנָה עוּגָה לְיוֹם הַהֻלֶּדֶת.','מָה אַבָּא קָנָה?','cake',['shoe','key']],['הַסִּירָה שָׁטָה עַל הַמַּיִם.','מָה שָׁט עַל הַמַּיִם?','boat',['car','ball']],
 ['בַּבֹּקֶר הַשֶּׁמֶשׁ זוֹרַחַת.','מָה זוֹרֵחַ בַּבֹּקֶר?','sun',['moon','cloud']],['נוֹעָה שָׂמָה כּוֹבַע עַל הָרֹאשׁ.','מָה נוֹעָה שָׂמָה עַל הָרֹאשׁ?','hat',['shoe','cup']],
 ['פָּתַחְתִּי אֶת הַדֶּלֶת עִם מַפְתֵּחַ.','עִם מָה פָּתַחְתִּי אֶת הַדֶּלֶת?','key',['flag','heart']],['הַכִּבְשָׂה אוֹכֶלֶת דֶּשֶׁא בַּשָּׂדֶה.','מִי אוֹכֵל דֶּשֶׁא?','sheep',['fish','bird']]];
function buildWord(back){const pool=shuffle(WORDS.filter(w=>w.syl.length>1)).slice(0,6);let i=0,err=0,gems=0;O.setScreen('sTal','city',back);
  const s=$('#sTal');const run=()=>{const w=pool[i];let k=0;T.hudT('בּוֹנִים מִלָּה',T.progressBar(i,pool.length));O.sayNow=T.plainHe(w.w);
    s.innerHTML='';const card=h('div','prq tqc',`${pic(w)}<div class="slots">${w.syl.map(()=>'<span class="slot2"></span>').join('')}</div>`);s.appendChild(card);
    const row=h('div','chs');shuffle(w.syl.map((x,ix)=>[x,ix])).forEach(([sy,ix])=>{const b=h('button','chb tx',sy);b.onclick=()=>{if(b.disabled)return;
      if(w.syl[k]===sy){const sl=card.querySelectorAll('.slot2')[k];sl.textContent=sy;sl.classList.add('on');b.disabled=true;b.classList.add('ok');k++;sfx.pop(k);
        if(k===w.syl.length){const g=2;gems+=g;O.addGems(g,card);sfx.ok(i);O.floatText(card,'+2');card.querySelector('.slots').classList.add('flash');O.say(T.plainHe(w.w));setTimeout(()=>{if(!card.isConnected)return;i++;if(i<pool.length)run();else T.finishAct('read-build',err,pool.length,gems,back,()=>buildWord(back));},D(1400));}}
      else{err++;sfx.no();b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');}};row.appendChild(b);});
    s.appendChild(row);s.appendChild(h('div','note','לוֹחֲצִים עַל הַהֲבָרוֹת לְפִי הַסֵּדֶר, מִיָּמִין לִשְׂמֹאל'));};run();}
let dict=null,dictChecked=false;
async function checkDict(){if(dictChecked)return dict;dictChecked=true;try{for(let i=0;i<20&&!(window.claude&&window.claude.use);i++)await new Promise(r=>setTimeout(r,100));if(window.claude&&window.claude.use)dict=await window.claude.use('dictation');}catch(e){dict=null;}return dict;}
checkDict();
function readAloud(back){const pool=shuffle(WORDS.slice()).slice(0,6);let i=0,ok=0;O.setScreen('sTal','city',back);const s=$('#sTal');
  const run=()=>{const w=pool[i];T.hudT('קוֹרְאִים בְּקוֹל',T.progressBar(i,pool.length));s.innerHTML='';
    const card=h('div','prq tqc',`${pic(w)}<div class="bigw">${w.w}</div><div class="heard" id="heard">לְחַץ עַל הַמִּיקְרוֹפוֹן וּקְרָא אֶת הַמִּלָּה</div>`);s.appendChild(card);
    const row=h('div','btnrow');const mic=h('button','bigbtn blue','🎤 <span>אֲנִי קוֹרֵא</span>');const skip=h('button','bigbtn plain sm',ICON.skip+'<span>דַּלֵּג</span>');row.append(mic,skip);s.appendChild(row);
    const done=good=>{if(good){ok++;O.addGems(2,card);sfx.ok(i);O.floatText(card,'+2');}setTimeout(()=>{if(!card.isConnected)return;i++;if(i<pool.length)run();else{T.record('read-voice',ok>=5?3:ok>=3?2:1);T.result({title:'קָרָאתָ יָפֶה!',sub:`קָרָאתָ נָכוֹן ${ok} מִתּוֹךְ ${pool.length}`,stars:ok>=5?3:ok>=3?2:1,back,again:()=>readAloud(back)});}},D(1300));};
    skip.onclick=()=>done(false);
    mic.onclick=()=>{const d=dict;if(!d){$('#heard').textContent='הַמִּיקְרוֹפוֹן לֹא זָמִין כָּאן';return;}let fin='';
      try{d.onFinal(({text})=>{fin+=' '+text;});d.onPartial(({text})=>{$('#heard').textContent=text;});d.onState(({state})=>{if(state==='idle'){const said=T.plainHe(fin).replace(/[^א-ת]/g,''),want=T.plainHe(w.w).replace(/[^א-ת]/g,'');
          const good=said.includes(want);$('#heard').innerHTML=good?'✓ נָכוֹן!':`שָׁמַעְתִּי: ${T.plainHe(fin)||'...'} · נַסֵּה שׁוּב`;if(good)done(true);else sfx.no();}});
        d.start().catch(()=>{$('#heard').textContent='הַמִּיקְרוֹפוֹן לֹא אֻשַּׁר';});$('#heard').textContent='מַקְשִׁיב...';setTimeout(()=>{try{d.stop();}catch(e){}},3500);}catch(e){$('#heard').textContent='הַמִּיקְרוֹפוֹן לֹא זָמִין כָּאן';}};};run();}
building({id:'read',name:'הַסִּפְרִיָּה',color:'#c0392b',bg:'city',icon:()=>X.bookS,blurb:'קוֹרְאִים מִלִּים וּמִשְׁפָּטִים עִם נִקּוּד.',acts:[
  {id:'read-first',name:'אוֹת רִאשׁוֹנָה',icon:()=>X.apple,run:back=>quiz({id:'read-first',title:'אוֹת רִאשׁוֹנָה',bg:'city',back,n:8,gen:()=>{const w=pick(WORDS);const f=first(w);const opts=shuffle([f,...shuffle([...new Set(WORDS.map(first))].filter(x=>x!==f)).slice(0,2)]);
     return {pr:`${pic(w)}<div class="qq">בְּאֵיזוֹ אוֹת מַתְחִילָה הַמִּלָּה?</div>`,opts,ans:opts.indexOf(f),cls:'tx big2',say:'באיזו אות מתחילה המילה '+T.plainHe(w.w),explain:`<span class="bigw">${w.w}</span>`,key:w.w};}})},
  {id:'read-pw',name:'מִלָּה וּתְמוּנָה',icon:()=>X.cat||SPR.cat,run:back=>quiz({id:'read-pw',title:'אֵיזוֹ מִלָּה?',bg:'city',back,n:8,gen:()=>{const w=pick(WORDS);const opts=shuffle([w,...others(w,2)]);return {pr:`${pic(w)}<div class="qq">אֵיזוֹ מִלָּה מַתְאִימָה לַתְּמוּנָה?</div>`,opts:opts.map(x=>x.w),ans:opts.indexOf(w),cls:'tx',key:w.w};}})},
  {id:'read-wp',name:'תְּמוּנָה לַמִּלָּה',icon:()=>X.sun,run:back=>quiz({id:'read-wp',title:'אֵיזוֹ תְּמוּנָה?',bg:'city',back,n:8,gen:()=>{const w=pick(WORDS);const opts=shuffle([w,...others(w,3)]);return {pr:`<div class="bigw">${w.w}</div><div class="qq">אֵיזוֹ תְּמוּנָה מַתְאִימָה לַמִּלָּה?</div>`,opts:opts.map(pic),ans:opts.indexOf(w),cls:'picb',key:w.w};}})},
  {id:'read-build',name:'בּוֹנִים מִלָּה',icon:()=>X.puzzle,run:buildWord},
  {id:'read-sent',name:'קוֹרְאִים מִשְׁפָּט',icon:()=>X.bookS,run:back=>quiz({id:'read-sent',title:'קוֹרְאִים מִשְׁפָּט',bg:'city',back,n:8,gen:()=>{const [t,qq,a,ds]=pick(SENT);const opts=shuffle([a,...ds]);return {pr:`<div class="sent">${t}</div><div class="qq">${qq}</div>`,opts:opts.map(k=>`<span class="pic">${ALLSPR(k)}</span>`),ans:opts.indexOf(a),cls:'picb',key:t};}})},
  {id:'read-voice',name:'קוֹרְאִים בְּקוֹל',icon:()=>'<span style="font-size:34px">🎤</span>',avail:()=>!!dict,noDaily:true,run:readAloud}]});
/* English */
const EW=WORDS.filter(w=>w.en);
building({id:'eng',name:'אַנְגְּלִית',color:'#3a8fc4',bg:'sea',icon:()=>X.abc,blurb:'מִלִּים רִאשׁוֹנוֹת בְּאַנְגְּלִית. לוֹחֲצִים עַל הָרַמְקוֹל כְּדֵי לִשְׁמֹעַ.',acts:[
  {id:'eng-letter',name:'אוֹתִיּוֹת',icon:()=>X.abc,run:back=>quiz({id:'eng-letter',title:'English ABC',bg:'sea',back,n:8,gen:()=>{const w=pick(EW);const L=w.en[0].toUpperCase();const opts=shuffle([w,...shuffle(EW.filter(x=>x.en[0]!==w.en[0])).slice(0,2)]);
     return {pr:`<div class="bigw ltr">${L} ${L.toLowerCase()}</div><div class="qq">אֵיזוֹ תְּמוּנָה מַתְחִילָה בָּאוֹת הַזֹּאת?</div>`,opts:opts.map(pic),ans:opts.indexOf(w),cls:'picb',play:()=>sayEn(L+'. '+w.en),auto:1,explain:`<span class="ltr bigw">${w.en}</span>`,key:L};}})},
  {id:'eng-word',name:'מִלִּים',icon:()=>X.ball,run:back=>quiz({id:'eng-word',title:'English words',bg:'sea',back,n:8,gen:()=>{const w=pick(EW);const opts=shuffle([w,...others(w,2,x=>!!x.en)]);
     return {pr:`${pic(w)}<div class="qq">אֵיךְ אוֹמְרִים בְּאַנְגְּלִית?</div>`,opts:opts.map(x=>x.en),ans:opts.indexOf(w),cls:'en',ltr:1,play:()=>sayEn(w.en),explain:`<span class="ltr bigw">${w.en}</span> = ${w.w}`,key:w.en};}})},
  {id:'eng-listen',name:'מַקְשִׁיבִים',icon:()=>'<span style="font-size:34px">👂</span>',run:back=>quiz({id:'eng-listen',title:'Listen!',bg:'sea',back,n:8,gen:()=>{const w=pick(EW);const opts=shuffle([w,...others(w,3,x=>!!x.en)]);
     return {pr:`<div class="qq">הַקְשֵׁב לַמִּלָּה וּבְחַר תְּמוּנָה</div>`,opts:opts.map(pic),ans:opts.indexOf(w),cls:'picb',play:()=>sayEn(w.en),auto:1,playLbl:'שׁוּב',explain:`<span class="ltr bigw">${w.en}</span> = ${w.w}`,key:w.en};}})}]});
/* World & Israel */
const FL={il:['יִשְׂרָאֵל','<rect width="60" height="40" fill="#fff"/><rect y="4" width="60" height="5" fill="#0038b8"/><rect y="31" width="60" height="5" fill="#0038b8"/><path d="M30 12 L37 24 L23 24Z M30 28 L23 16 L37 16Z" fill="none" stroke="#0038b8" stroke-width="1.8"/>'],
 jp:['יַפָּן','<rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="11" fill="#bc002d"/>'],fr:['צָרְפַת','<rect width="20" height="40" fill="#0055a4"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ef4135"/>'],
 it:['אִיטַלְיָה','<rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ce2b37"/>'],de:['גֶּרְמַנְיָה','<rect width="60" height="14" fill="#000"/><rect y="13" width="60" height="14" fill="#dd0000"/><rect y="26" width="60" height="14" fill="#ffce00"/>'],
 nl:['הוֹלַנְד','<rect width="60" height="14" fill="#ae1c28"/><rect y="13" width="60" height="14" fill="#fff"/><rect y="26" width="60" height="14" fill="#21468b"/>'],se:['שְׁוֶדְיָה','<rect width="60" height="40" fill="#006aa7"/><rect x="18" width="7" height="40" fill="#fecc00"/><rect y="16" width="60" height="7" fill="#fecc00"/>'],
 ch:['שְׁוַיְץ','<rect width="60" height="40" fill="#da291c"/><rect x="26" y="9" width="8" height="22" fill="#fff"/><rect x="19" y="16" width="22" height="8" fill="#fff"/>'],ua:['אוּקְרַאִינָה','<rect width="60" height="20" fill="#0057b7"/><rect y="20" width="60" height="20" fill="#ffd700"/>'],
 ie:['אִירְלַנְד','<rect width="20" height="40" fill="#169b62"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ff883e"/>']};
const flag=k=>`<svg class="flagsvg" viewBox="0 0 60 40" aria-hidden="true">${FL[k][1]}</svg>`;
const ANI=[['קֶנְגּוּרוּ','אוֹסְטְרַלְיָה',['אֵירוֹפָּה','אַפְרִיקָה']],['קוֹאָלָה','אוֹסְטְרַלְיָה',['אַסְיָה','אֵירוֹפָּה']],['אַרְיֵה','אַפְרִיקָה',['אוֹסְטְרַלְיָה','אֵירוֹפָּה']],['גִ׳ירָפָה','אַפְרִיקָה',['אוֹסְטְרַלְיָה','אַנְטַארְקְטִיקָה']],
 ['פַּנְדָּה','אַסְיָה',['אַפְרִיקָה','אוֹסְטְרַלְיָה']],['טִיגְרִיס','אַסְיָה',['אוֹסְטְרַלְיָה','אֵירוֹפָּה']],['פִּינְגְּוִין קֵיסָרִי','אַנְטַארְקְטִיקָה',['אַסְיָה','אֵירוֹפָּה']],['לָאמָה','דְּרוֹם אֲמֶרִיקָה',['אַפְרִיקָה','אוֹסְטְרַלְיָה']],['עַצְלָן','דְּרוֹם אֲמֶרִיקָה',['אֵירוֹפָּה','אַסְיָה']]];
const ISR=[['מָה הָעִיר הַבִּירָה שֶׁל יִשְׂרָאֵל?','יְרוּשָׁלַיִם',['חֵיפָה','אֵילַת']],['אֵיזֶה יָם יֵשׁ בְּאֵילַת?','הַיָּם הָאָדֹם',['הַיָּם הַתִּיכוֹן','יָם הַמֶּלַח']],
 ['בְּאֵיזֶה יָם הַמַּיִם כָּל כָּךְ מְלוּחִים שֶׁאֶפְשָׁר לָצוּף בְּקַלּוּת?','יָם הַמֶּלַח',['הַיָּם הָאָדֹם','הַכִּנֶּרֶת']],['מָה הַצְּבָעִים שֶׁל דֶּגֶל יִשְׂרָאֵל?','כָּחֹל וְלָבָן',['אָדֹם וְלָבָן','יָרֹק וְצָהֹב']],
 ['הַכִּנֶּרֶת הִיא...','אֲגַם',['הַר','מִדְבָּר']],['אֵיזֶה מִדְבָּר יֵשׁ בִּדְרוֹם יִשְׂרָאֵל?','הַנֶּגֶב',['הַגָּלִיל','הַגּוֹלָן']],['הַחֶרְמוֹן הוּא...','הַר',['יָם','עִיר']]];
building({id:'world',name:'הָעוֹלָם וְיִשְׂרָאֵל',color:'#4fae4f',bg:'valley',icon:()=>X.globe,blurb:'דְּגָלִים, יַבָּשׁוֹת וְהָאָרֶץ שֶׁלָּנוּ.',acts:[
  {id:'world-flag',name:'דְּגָלִים',icon:()=>flag('il'),run:back=>quiz({id:'world-flag',title:'דְּגָלִים',bg:'valley',back,n:8,gen:()=>{const ks=Object.keys(FL);const k=pick(ks);const opts=shuffle([k,...shuffle(ks.filter(x=>x!==k)).slice(0,2)]);return {pr:`${flag(k)}<div class="qq">שֶׁל אֵיזוֹ מְדִינָה הַדֶּגֶל?</div>`,opts:opts.map(x=>FL[x][0]),ans:opts.indexOf(k),cls:'tx',key:k};}})},
  {id:'world-ani',name:'אֵיפֹה הֵם גָּרִים?',icon:()=>X.globe,run:back=>quiz({id:'world-ani',title:'אֵיפֹה הֵם גָּרִים?',bg:'valley',back,n:7,gen:()=>{const [a,c,ds]=pick(ANI);const opts=shuffle([c,...ds]);return {pr:`<div class="bigw">${a}</div><div class="qq">בְּאֵיזוֹ יַבֶּשֶׁת חַי בַּעַל הַחַיִּים הַזֶּה בַּטֶּבַע?</div>`,opts,ans:opts.indexOf(c),cls:'tx',key:a};}})},
  {id:'world-il',name:'הָאָרֶץ שֶׁלָּנוּ',icon:()=>flag('il'),run:back=>quiz({id:'world-il',title:'הָאָרֶץ שֶׁלָּנוּ',bg:'valley',back,n:7,gen:()=>{const [q,a,ds]=pick(ISR);const opts=shuffle([a,...ds]);return {pr:`<div class="sent">${q}</div>`,opts,ans:opts.indexOf(a),cls:'tx',key:q};}})}]});
/* Bedtime stories */
const STORIES=[
 {t:'הַחֲתוּלָה וְהַכַּדּוּר הָאָדֹם',spr:['cat','ball'],s:['לְנוֹעָה יֵשׁ חֲתוּלָה קְטַנָּה בְּשֵׁם מִיצִי.','מִיצִי אוֹהֶבֶת לְשַׂחֵק בְּכַדּוּר אָדֹם.','יוֹם אֶחָד הַכַּדּוּר הִתְגַּלְגֵּל מִתַּחַת לַמִּטָּה.','מִיצִי חִפְּשָׂה וְחִפְּשָׂה, אֲבָל לֹא מָצְאָה.','נוֹעָה הֵבִיאָה פָּנָס וְהֵאִירָה מִתַּחַת לַמִּטָּה.','הִנֵּה הַכַּדּוּר! מִיצִי קָפְצָה מִשִּׂמְחָה.'],
  q:[['אֵיזֶה צֶבַע הַכַּדּוּר?','אָדֹם',['כָּחֹל','יָרֹק']],['מָה עָזַר לְנוֹעָה לִמְצֹא אֶת הַכַּדּוּר?','פָּנָס',['מַפְתֵּחַ','סֵפֶר']]]},
 {t:'הַזֶּרַע שֶׁל אוֹרֶן',spr:['flower','sun'],s:['אוֹרֶן שָׁתַל זֶרַע קָטָן בְּעָצִיץ.','כָּל בֹּקֶר הוּא הִשְׁקָה אוֹתוֹ בְּמַיִם.','הוּא שָׂם אֶת הָעָצִיץ לְיַד הַחַלּוֹן, בַּשֶּׁמֶשׁ.','אַחֲרֵי שָׁבוּעַ יָצָא נֶבֶט יָרֹק.','אַחֲרֵי חֹדֶשׁ פָּרַח פֶּרַח צָהֹב וְיָפֶה.','אוֹרֶן הָיָה גֵּאֶה מְאוֹד.'],
  q:[['מָה עָזַר לַזֶּרַע לִגְדֹּל?','מַיִם וְשֶׁמֶשׁ',['חֹשֶׁךְ','מוּזִיקָה']],['אֵיזֶה צֶבַע הָיָה הַפֶּרַח?','צָהֹב',['אָדֹם','סָגֹל']]]},
 {t:'הַדְּרָקוֹן שֶׁפָּחַד מֵהַחֹשֶׁךְ',spr:['dragon','moon'],s:['נִיצוֹץ הָיָה דְּרָקוֹן קָטָן וְאַמִּיץ.','הוּא לֹא פָּחַד מִשּׁוּם דָּבָר, חוּץ מֵהַחֹשֶׁךְ.','בַּלַּיְלָה הוּא לֹא הִצְלִיחַ לְהֵרָדֵם.','פִּיקְסֶל הֶחָתוּל אָמַר: "בּוֹא נִסְתַּכֵּל עַל הַשָּׁמַיִם."','הֵם יָצְאוּ הַחוּצָה, וְהַשָּׁמַיִם הָיוּ מְלֵאִים כּוֹכָבִים נוֹצְצִים.','מֵאָז נִיצוֹץ אוֹהֵב אֶת הַלַּיְלָה.'],
  q:[['מִמָּה פָּחַד נִיצוֹץ?','מֵהַחֹשֶׁךְ',['מִכְּלָבִים','מִמַּיִם']],['מָה הֵם רָאוּ בַּשָּׁמַיִם?','כּוֹכָבִים',['שֶׁמֶשׁ','גֶּשֶׁם']]]},
 {t:'יוֹם הַהֻלֶּדֶת שֶׁל סַבְתָּא',spr:['cake','heart'],s:['הַיּוֹם יוֹם הַהֻלֶּדֶת שֶׁל סַבְתָּא.','אוֹרֶן וְאַבָּא אָפוּ עוּגַת שׁוֹקוֹלָד.','אוֹרֶן צִיֵּר לְסַבְתָּא צִיּוּר שֶׁל לֵב גָּדוֹל.','כָּל הַמִּשְׁפָּחָה שָׁרָה לָהּ שִׁיר.','סַבְתָּא כִּבְּתָה אֶת הַנֵּרוֹת וְחִיְּכָה.','הִיא אָמְרָה: "זוֹ הַמַּתָּנָה הֲכִי יָפָה!"'],
  q:[['אֵיזוֹ עוּגָה הֵם אָפוּ?','שׁוֹקוֹלָד',['גְּבִינָה','תַּפּוּחִים']],['מָה צִיֵּר אוֹרֶן?','לֵב',['סִירָה','כּוֹכָב']]]},
 {t:'הַסִּירָה שֶׁל דָּנִי',spr:['boat','cloud'],s:['דָּנִי בָּנָה סִירָה מִנְּיָר.','הוּא שָׂם אוֹתָהּ בַּשְּׁלוּלִית שֶׁלְּיַד הַבַּיִת.','רוּחַ נָשְׁבָה, וְהַסִּירָה שָׁטָה מַהֵר.','פִּתְאוֹם הִתְחִיל גֶּשֶׁם, וְהַנְּיָר נִהְיָה רָטֹב.','דָּנִי הֵבִין: בַּפַּעַם הַבָּאָה הוּא יִבְנֶה סִירָה מֵעֵץ!'],
  q:[['מִמָּה הָיְתָה הַסִּירָה?','מִנְּיָר',['מֵעֵץ','מִבַּרְזֶל']],['מָה קָרָה כְּשֶׁהִתְחִיל גֶּשֶׁם?','הַנְּיָר נִהְיָה רָטֹב',['הַסִּירָה עָפָה','הַשֶּׁמֶשׁ זָרְחָה']]]},
 {t:'חָכָם הַיַּנְשׁוּף סוֹפֵר כּוֹכָבִים',spr:['owl','star'],s:['בַּיַּעַר גָּר יַנְשׁוּף חָכָם.','כָּל לַיְלָה הוּא סוֹפֵר אֶת הַכּוֹכָבִים.','בַּלַּיְלָה הָרִאשׁוֹן הוּא סָפַר עֲשָׂרָה כּוֹכָבִים.','בַּלַּיְלָה הַשֵּׁנִי הוּא סָפַר עוֹד חֲמִשָּׁה.','חָכָם חִיֵּךְ: "חֶשְׁבּוֹן זֶה כֵּיף!"'],
  q:[['כַּמָּה כּוֹכָבִים הוּא סָפַר בְּסַךְ הַכֹּל?','15',['10','5']],['אֵיפֹה גָּר הַיַּנְשׁוּף?','בַּיַּעַר',['בַּיָּם','בָּעִיר']]]}];
function readStory(k,back){const st=STORIES[k];O.setScreen('sTal','clock',back);T.hudT('סִפּוּר');const s=$('#sTal');s.innerHTML='';let cur=-1;
  const page=h('div','story');page.innerHTML=`<div class="sth"><span>${ALLSPR(st.spr[0])}</span><h2>${st.t}</h2><span>${ALLSPR(st.spr[1])}</span></div>`+st.s.map((x,i)=>`<p class="sl" data-i="${i}">${x}</p>`).join('');s.appendChild(page);
  const row=h('div','btnrow');const rd=h('button','bigbtn blue sm',ICON.say+'<span>הַקְרֵא לִי</span>');const go=h('button','bigbtn',ICON.play+'<span>לַשְּׁאֵלוֹת</span>');row.append(rd,go);s.appendChild(row);
  const mark=i=>{page.querySelectorAll('.sl').forEach(p=>p.classList.toggle('cur',+p.dataset.i===i));};
  page.querySelectorAll('.sl').forEach(p=>p.onclick=()=>{mark(+p.dataset.i);O.say(T.plainHe(p.textContent));});
  rd.onclick=()=>{if(!('speechSynthesis' in window))return;speechSynthesis.cancel();st.s.forEach((x,i)=>{const u=new SpeechSynthesisUtterance(T.plainHe(x));u.lang='he-IL';u.rate=.88;u.onstart=()=>mark(i);speechSynthesis.speak(u);});};
  go.onclick=()=>{O.hush();let qi=0;quiz({id:'story-'+k,title:st.t,bg:'clock',back:()=>openStories(back),n:st.q.length,gen:()=>{const [q,a,ds]=st.q[qi++];const opts=shuffle([a,...ds]);return {pr:`<div class="sent">${q}</div>`,opts,ans:opts.indexOf(a),cls:'tx',key:q};}});};}
function openStories(back){O.setScreen('sTal','clock',back);T.hudT('סִפּוּרֵי עֶרֶב');const s=$('#sTal');s.innerHTML='';s.appendChild(h('div','whead',`<span class="gd">${X.moon}</span><h1>סִפּוּרֵי עֶרֶב</h1>`));
  const g=h('div','acts');STORIES.forEach((st,k)=>{const n=(T.S().tl['story-'+k]||{}).s|0;const c=h('button','actc',`<span class="ai">${ALLSPR(st.spr[0])}</span><span class="an">${st.t}</span><span class="st">${[0,1,2].map(j=>j<n?SPR.star:SPR.starOff).join('')}</span>`);c.onclick=()=>readStory(k,()=>openStories(back));g.appendChild(c);});s.appendChild(g);}
building({id:'stories',name:'סִפּוּרֵי עֶרֶב',color:'#6c4fc1',bg:'clock',icon:()=>X.moon,blurb:'סִפּוּרִים קְצָרִים לִקְרִיאָה, עִם שְׁאֵלוֹת בַּסּוֹף.',acts:STORIES.map((st,k)=>({id:'story-'+k,name:st.t,icon:()=>ALLSPR(st.spr[0]),run:back=>readStory(k,back)}))});
T.openStories=openStories;
})();

/* ===== TYPING (Hebrew keyboard) ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,ICON,SPR}=O;const {X,building}=T;const sfx=O.sfx,D=O.D;
const CODE={KeyE:'ק',KeyR:'ר',KeyT:'א',KeyY:'ט',KeyU:'ו',KeyI:'ן',KeyO:'ם',KeyP:'פ',KeyA:'ש',KeyS:'ד',KeyD:'ג',KeyF:'כ',KeyG:'ע',KeyH:'י',KeyJ:'ח',KeyK:'ל',KeyL:'ך',Semicolon:'ף',KeyZ:'ז',KeyX:'ס',KeyC:'ב',KeyV:'ה',KeyB:'נ',KeyN:'מ',KeyM:'צ',Comma:'ת',Period:'ץ',Space:' '};
const ROWS=[['ק','ר','א','ט','ו','ן','ם','פ'],['ש','ד','ג','כ','ע','י','ח','ל','ך','ף'],['ז','ס','ב','ה','נ','מ','צ','ת','ץ']];
const FINGER={'ש':0,'ז':0,'ד':1,'ס':1,'ק':2,'ג':2,'ב':2,'ר':3,'כ':3,'ע':3,'ה':3,'נ':3,'א':3,'ט':4,'י':4,'ח':4,'מ':4,'צ':4,'ו':4,'ן':5,'ל':5,'ת':5,'ם':6,'ך':6,'ץ':6,'פ':7,'ף':7};
const FCOL=['#e4572e','#f28c28','#e9b949','#4fae4f','#3cb371','#3a8fc4','#6c6fd1','#b065c9'];
const LESSONS=[['כ','ח'],['ג','ל'],['ד','ך'],['ש','ף'],['ע','י'],['ר','א'],['ק','ט'],['ו','ן'],['ם','פ'],['ה','נ'],['ב','מ'],['ס','צ'],['ז','ת','ץ']];
const learned=n=>LESSONS.slice(0,n+1).flat();
const WL='חתול כלב דג עץ פרח שמש ירח כוכב בית כדור ספר כובע סירה לב כוס נעל דגל ענן ים גל חול יד רגל אף פה עין שיר גן אור חג חלב לחם כד דלי גדי חיל לך כך לכל יחד חלל גלגל דלעת מלך ילד ילדה אבא אמא סבא דוד עוגה מים שלום טוב יום לילה בוקר ערב אוכל משחק חבר חברה צבע אדום כחול ירוק צהוב לבן שחור ספרים מחברת עיפרון'.split(' ');
const keyOf=e=>CODE[e.code]||(/^[א-ת ]$/.test(e.key)?e.key:null);
function kbHTML(target,allowed){return `<div class="kb">${ROWS.map(r=>`<div class="kr">${r.map(k=>`<span class="kk${k===target?' tgt':''}${allowed&&!allowed.includes(k)?' dim':''}" style="--f:${FCOL[FINGER[k]]}">${k}</span>`).join('')}</div>`).join('')}<div class="kr"><span class="kk sp${target===' '?' tgt':''}">רֶוַח</span></div></div>`;}
function lessonText(n){const al=learned(n);const words=WL.filter(w=>[...w].every(c=>al.includes(c)));const parts=[];
  while(parts.join(' ').length<34){if(words.length>=3&&Math.random()<.6)parts.push(pick(words));else{let s='';const L=rand(2,4);for(let i=0;i<L;i++)s+=pick(i===0&&n>0&&Math.random()<.5?LESSONS[n]:al);parts.push(s);}}
  return parts.join(' ');}
function typeLesson(n,back){const text=lessonText(n);let i=0,err=0,t0=0;O.setScreen('sTal','city',back);T.hudT(`שִׁעוּר ${n+1}: ${LESSONS[n].join(' ')}`);
  const s=$('#sTal');s.innerHTML='';const box=h('div','tline');const kb=h('div','');const info=h('div','note','יָדַיִם עַל הַשּׁוּרָה הָאֶמְצָעִית · הָאֶצְבַּע בַּצֶּבַע שֶׁל הַמַּקָּשׁ');s.append(box,kb,info);
  const draw=()=>{box.innerHTML=[...text].map((c,k)=>`<span class="tc${k<i?' ok':k===i?' cur':''}">${c===' '?'&nbsp;':c}</span>`).join('');kb.innerHTML=kbHTML(text[i],learned(n).concat([' ']));};draw();
  O.sayNow='הקלד את האותיות לפי הסדר.';
  T.setKey(e=>{const k=keyOf(e);if(!k)return;e.preventDefault();if(!t0)t0=Date.now();
    if(k===text[i]){i++;sfx.key();if(i>=text.length){T.setKey(null);const secs=(Date.now()-t0)/1000;const acc=Math.round(100*text.length/(text.length+err));const wpm=Math.round(text.length/5/(secs/60));
        const st=acc>=95?3:acc>=85?2:1;const ty=T.S().typ;ty.best[n]=Math.max(ty.best[n]|0,st);ty.wpm=Math.max(ty.wpm|0,wpm);ty.acc=acc;O.addGems(5+st*2);T.record('type-lessons',st);
        T.result({title:'סִיַּמְתָּ אֶת הַשִּׁעוּר!',sub:`דִּיּוּק ${acc}% · ${wpm} מִלִּים בְּדַקָּה`,stars:st,gems:5+st*2,back,again:()=>typeLesson(n,back)});return;}draw();}
    else{err++;sfx.no();box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');}});}
function lessonsMenu(back){O.setScreen('sTal','city',back);T.hudT('שִׁעוּרֵי הַקְלָדָה');const s=$('#sTal');s.innerHTML='';const ty=T.S().typ;
  s.appendChild(h('div','lsent','מַנִּיחִים אֶצְבָּעוֹת עַל <b>ש ד ג כ</b> וְעַל <b>ח ל ך ף</b>. כָּל אֶצְבַּע לוֹחֶצֶת עַל הַמַּקָּשִׁים בַּצֶּבַע שֶׁלָּהּ.'));
  s.appendChild(h('div','',kbHTML(null)));const g=h('div','acts');
  LESSONS.forEach((l,n)=>{const open=n===0||(ty.best[n-1]|0)>0;const st=ty.best[n]|0;const c=h('button','actc'+(open?'':' locked'),`<span class="an ltr" style="font-size:24px">${l.join(' ')}</span><span class="an">שִׁעוּר ${n+1}</span><span class="st">${[0,1,2].map(k=>k<st?SPR.star:SPR.starOff).join('')}</span>`);
    c.disabled=!open;c.onclick=()=>typeLesson(n,()=>lessonsMenu(back));g.appendChild(c);});s.appendChild(g);}
function rainGame(back){const ty=T.S().typ;let top=0;Object.keys(ty.best).forEach(k=>{top=Math.max(top,+k);});const al=learned(Math.max(1,top));
  O.setScreen('sTal','city',back);T.hudT('גֶּשֶׁם אוֹתִיּוֹת');const s=$('#sTal');s.innerHTML='';const field=h('div','rainf');const sc=h('div','score','★ 0');s.append(sc,field);
  let score=0,miss=0,blocks=[],t0=performance.now(),last=t0,spawn=0,alive=true,end=t0+60000;const W=()=>field.clientWidth,H=()=>field.clientHeight;
  const mk=()=>{const ch=pick(al);const b=h('div','rb',ch);b.style.left=rand(4,90)+'%';field.appendChild(b);blocks.push({b,ch,y:-40});};
  const loop=now=>{if(!alive||$('#sTal').hidden||!field.isConnected){alive=false;return;}const dt=now-last;last=now;const sp=(28+score*1.2)/1000;spawn-=dt;if(spawn<=0){mk();spawn=Math.max(500,1500-score*25);}
    blocks.forEach(o=>{o.y+=sp*dt;o.b.style.top=o.y+'px';});const fallen=blocks.filter(o=>o.y>H()-30);fallen.forEach(o=>{o.b.remove();miss++;sfx.no();});blocks=blocks.filter(o=>o.y<=H()-30);
    if(now>=end){alive=false;T.setKey(null);const st=score>=40?3:score>=20?2:1;const g=Math.min(25,Math.floor(score/2));O.addGems(g);T.record('type-rain',st,{b:score});T.result({title:'נִגְמַר הַזְּמַן!',sub:`פּוֹצַצְתָּ ${score} אוֹתִיּוֹת`,stars:st,gems:g,back,again:()=>rainGame(back)});return;}
    sc.textContent=`★ ${score} · ${Math.ceil((end-now)/1000)}`;requestAnimationFrame(loop);};
  T.setKey(e=>{const k=keyOf(e);if(!k||k===' ')return;e.preventDefault();const o=blocks.filter(x=>x.ch===k).sort((a,b)=>b.y-a.y)[0];if(o){o.b.classList.add('boom');setTimeout(()=>o.b.remove(),250);blocks=blocks.filter(x=>x!==o);score++;sfx.pop(score%10);}else sfx.no();});
  window.__rain={get blocks(){return blocks;},hit:k=>{const o=blocks.find(x=>x.ch===k);if(o){blocks=blocks.filter(x=>x!==o);o.b.remove();score++;}},finish:()=>{end=0;}};
  requestAnimationFrame(loop);}
building({id:'type',name:'מִגְדַּל הַמִּקְלֶדֶת',color:'#5a5f66',bg:'city',icon:()=>X.keys,blurb:'לוֹמְדִים לְהַקְלִיד בְּעִבְרִית בְּעֶשֶׂר אֶצְבָּעוֹת.',acts:[
  {id:'type-lessons',name:'שִׁעוּרֵי הַקְלָדָה',icon:()=>X.keys,run:lessonsMenu},
  {id:'type-rain',name:'גֶּשֶׁם אוֹתִיּוֹת',icon:()=>X.cloud,run:rainGame}]});
T.TYPE={CODE,LESSONS,lessonText,learned,keyOf};
})();

/* ===== MUSIC: notes, durations, ear, rhythm, piano ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,ICON,SPR}=O;const {X,building,quiz}=T;const sfx=O.sfx,D=O.D;
const SOL=['דּוֹ','רֶה','מִי','פָה','סוֹל','לָה','סִי'];const SC=[0,2,4,5,7,9,11];
const midiOf=i=>60+SC[((i%7)+7)%7]+12*Math.floor(i/7);
function playMidi(m,dur=.7,vol=1,at=0){if((O.save.snd|0)<1||!O.audio())return;const t=O.A.ctx.currentTime+at;const f=O.NT(m);
  O.tone(f,t,dur,{type:'triangle',vol:.2*vol,rel:.35,lp:3200});O.tone(f*2,t,dur*.5,{type:'sine',vol:.05*vol,rel:.2});O.tone(f*3,t,.08,{type:'square',vol:.01*vol});}
T.playMidi=playMidi;
const CLEF='<path d="M44 104 C36 108 28 100 32 92 C36 84 48 86 47 96 C46 104 34 104 33 94 M43 112 C40 80 50 58 48 30 C47 14 36 16 37 30 C39 48 58 58 56 78 C54 92 40 96 34 86" fill="none" stroke="#23303b" stroke-width="3.2" stroke-linecap="round"/>';
function staff(idx,opts={}){const y=i=>90-(i-2)*6;let s=`<svg class="staff" viewBox="0 0 240 130" aria-hidden="true">`;for(let k=0;k<5;k++)s+=`<line x1="10" x2="230" y1="${90-k*12}" y2="${90-k*12}" stroke="#23303b" stroke-width="2"/>`;
  s+=`<g transform="translate(0,-8)">${CLEF}</g>`;const x=140,yy=y(idx);if(idx<=0)s+=`<line x1="${x-14}" x2="${x+14}" y1="102" y2="102" stroke="#23303b" stroke-width="2"/>`;if(idx>=12)s+=`<line x1="${x-14}" x2="${x+14}" y1="18" y2="18" stroke="#23303b" stroke-width="2"/>`;
  s+=`<ellipse cx="${x}" cy="${yy}" rx="9" ry="6.5" transform="rotate(-20 ${x} ${yy})" fill="${opts.col||'#23303b'}"/>`;s+=idx<6?`<line x1="${x+8}" x2="${x+8}" y1="${yy}" y2="${yy-38}" stroke="#23303b" stroke-width="2.5"/>`:`<line x1="${x-8}" x2="${x-8}" y1="${yy}" y2="${yy+38}" stroke="#23303b" stroke-width="2.5"/>`;return s+'</svg>';}
const DUR=[['שָׁלֵם',4,'w'],['חֲצִי',2,'h'],['רֶבַע',1,'q'],['שְׁמִינִית','½','e']];
function durSVG(k){const filled=k!=='w'&&k!=='h';let s=`<svg class="dur" viewBox="0 0 60 90" aria-hidden="true"><ellipse cx="26" cy="70" rx="11" ry="8" transform="rotate(-20 26 70)" fill="${filled?'#23303b':'#fff'}" stroke="#23303b" stroke-width="3"/>`;
  if(k!=='w')s+=`<line x1="36" y1="68" x2="36" y2="12" stroke="#23303b" stroke-width="3"/>`;if(k==='e')s+=`<path d="M36 12 C46 22 52 28 46 44" fill="none" stroke="#23303b" stroke-width="3"/>`;return s+'</svg>';}
/* rhythm */
const PATS=[['q','q','q','q'],['q','e','q','q'],['e','e','q','e','q'].slice(0,4),['q','r','q','q'],['e','q','e','q'],['q','q','e','e'],['e','e','e','e'],['q','e','r','q']];
function patOnsets(p){const out=[];p.forEach((b,i)=>{if(b==='q')out.push(i);if(b==='e'){out.push(i,i+.5);}});return out;}
const beatSVG=b=>b==='r'?'<svg class="beat" viewBox="0 0 40 60"><path d="M14 10 L26 22 L16 32 L26 44 C18 40 12 46 20 54" fill="none" stroke="#23303b" stroke-width="3.5"/></svg>':b==='q'?durSVG('q').replace('class="dur"','class="beat"'):`<svg class="beat" viewBox="0 0 70 90"><ellipse cx="18" cy="70" rx="10" ry="7" fill="#23303b"/><ellipse cx="50" cy="70" rx="10" ry="7" fill="#23303b"/><line x1="27" y1="68" x2="27" y2="14" stroke="#23303b" stroke-width="3"/><line x1="59" y1="68" x2="59" y2="14" stroke="#23303b" stroke-width="3"/><rect x="26" y="12" width="35" height="7" fill="#23303b"/></svg>`;
function rhythm(back){const rounds=shuffle(PATS.slice()).slice(0,4);let r=0,total=0,good=0;O.setScreen('sTal','clock',back);const s=$('#sTal');
  const run=()=>{const p=rounds[r];T.hudT('קֶצֶב',T.progressBar(r,rounds.length));s.innerHTML='';const bar=h('div','rbar',p.map((b,i)=>`<span class="rb2" data-i="${i}">${beatSVG(b)}</span>`).join(''));
    const msg=h('div','lcap','לְחַץ "הַתְחֵל". אַחֲרֵי 4 נְקִישׁוֹת, הַקֵּשׁ עַל הַתֹּף בַּקֶּצֶב.');const drum=h('button','drum','🥁');const go=h('button','bigbtn',ICON.play+'<span>הַתְחֵל</span>');s.append(bar,msg,drum,go);
    let taps=[],t0=0,running=false;const beat=60/80;const tap=()=>{if(!running)return;taps.push(performance.now());drum.classList.remove('hit');void drum.offsetWidth;drum.classList.add('hit');if(O.audio()&&(O.save.snd|0)>=1)O.noise(O.A.ctx.currentTime,.12,{ft:'lowpass',f:600,vol:.5});};
    drum.onclick=tap;T.setKey(e=>{if(e.code==='Space'||e.key===' '){e.preventDefault();tap();}});
    go.onclick=()=>{go.disabled=true;running=true;taps=[];const now=performance.now();for(let k=0;k<4;k++){setTimeout(()=>{sfx.key();msg.textContent=['1','2','3','4'][k];},D(k*beat*1000));}
      t0=now+4*beat*1000*(window.__fast?1/15:1);
      p.forEach((b,i)=>setTimeout(()=>{const el=bar.querySelector(`[data-i="${i}"]`);if(el){el.classList.add('now');setTimeout(()=>el.classList.remove('now'),D(beat*900));}},D((4+i)*beat*1000)));
      setTimeout(()=>{msg.textContent='עַכְשָׁו!';},D(4*beat*1000));
      setTimeout(()=>{running=false;const on=patOnsets(p).map(x=>t0+x*beat*1000*(window.__fast?1/15:1));const tol=window.__fast?60:170;let hit=0;const used=new Set();
        on.forEach(o=>{const k=taps.findIndex((t,j)=>!used.has(j)&&Math.abs(t-o)<tol);if(k>=0){used.add(k);hit++;}});const extra=taps.length-used.size;const sc=Math.max(0,hit-extra);
        total+=on.length;good+=sc;msg.innerHTML=sc===on.length?'מְעֻלֶּה! בְּדִיּוּק בַּקֶּצֶב.':`פָּגַעְתָּ בְּ-${sc} מִתּוֹךְ ${on.length}`;if(sc===on.length)sfx.ok(r);else sfx.no();
        setTimeout(()=>{r++;if(r<rounds.length)run();else{T.setKey(null);const pc=good/total;const st=pc>=.85?3:pc>=.6?2:1;O.addGems(5+st*2);T.record('mus-rhythm',st);T.result({title:'מְתוֹפֵף אַלּוּף!',stars:st,gems:5+st*2,back,again:()=>rhythm(back)});}},D(1800));},D((4+4+.6)*beat*1000));};
    window.__rhythm={get t0(){return t0;},onsets:()=>patOnsets(p).map(x=>t0+x*beat*1000*(window.__fast?1/15:1)),tap};};run();}
/* piano */
const WHITE=[60,62,64,65,67,69,71,72,74,76],BLACK={61:0,63:1,66:3,68:4,70:5,73:7,75:8};
const KMAP={KeyA:60,KeyS:62,KeyD:64,KeyF:65,KeyG:67,KeyH:69,KeyJ:71,KeyK:72,KeyL:74,Semicolon:76,KeyW:61,KeyE:63,KeyT:66,KeyY:68,KeyU:70,KeyO:73,KeyP:75};
const nameOf=m=>{const pc=(m-60+120)%12;const i=SC.indexOf(pc);return i>=0?SOL[i]:'';};
const SONGS=[['נִצְנְצִי כּוֹכָב',[60,60,67,67,69,69,67,65,65,64,64,62,62,60,67,67,65,65,64,64,62,67,67,65,65,64,64,62,60,60,67,67,69,69,67,65,65,64,64,62,62,60]],
 ['שִׁיר הַשִּׂמְחָה',[64,64,65,67,67,65,64,62,60,60,62,64,64,62,62,64,64,65,67,67,65,64,62,60,60,62,64,62,60,60]],
 ['יוֹנָתָן הַקָּטָן',[67,64,64,65,62,62,60,62,64,65,67,67,67,67,64,64,65,62,62,60,64,67,67,60]],
 ['אָחִי יַעֲקֹב',[67,69,71,67,67,69,71,67,71,72,74,71,72,74,74,76,74,72,71,67,74,76,74,72,71,67,67,62,67,67,62,67]]];
function piano(back,songIdx){O.setScreen('sTal','clock',back);const s=$('#sTal');s.innerHTML='';const song=songIdx!=null?SONGS[songIdx]:null;
  T.hudT(song?song[0]:'פְּסַנְתֵּר');let pos=0,err=0,rec=null,recT=0,last=[];
  const top=h('div','ptop');const kb=h('div','piano');s.append(top,kb);
  WHITE.forEach((m,i)=>{const k=h('button','pw',`<span>${nameOf(m)}</span><small class="ltr">${'ASDFGHJKL;'[i]}</small>`);k.dataset.m=m;k.onpointerdown=e=>{e.preventDefault();press(m);};kb.appendChild(k);});
  Object.entries(BLACK).forEach(([m,i])=>{const k=h('button','pb2','');k.dataset.m=m;k.style.left=`calc(${(i+1)*10}% - 3%)`;k.onpointerdown=e=>{e.preventDefault();press(+m);};kb.appendChild(k);});
  const glow=()=>{kb.querySelectorAll('[data-m]').forEach(k=>k.classList.toggle('next',!!song&&+k.dataset.m===song[1][pos]));if(song)top.innerHTML=`<div class="seq">${song[1].slice(pos,pos+8).map((m,i)=>`<span class="${i===0?'cur':''}">${nameOf(m)}</span>`).join('')}</div><div class="progress">${T.progressBar(pos,song[1].length).replace('<div class="progress">','').replace(/<\/div>$/,'')}</div>`;};
  function press(m){playMidi(m);const k=kb.querySelector(`[data-m="${m}"]`);if(k){k.classList.add('dn');setTimeout(()=>k.classList.remove('dn'),180);}
    if(rec)rec.push([m,performance.now()-recT]);
    if(song){if(m===song[1][pos]){pos++;if(pos>=song[1].length){T.setKey(null);const st=err<=2?3:err<=6?2:1;O.addGems(5+st*2);T.record('mus-piano',st);setTimeout(()=>T.result({title:'נִגַּנְתָּ אֶת הַשִּׁיר!',sub:song[0],stars:st,gems:5+st*2,back,again:()=>piano(back,songIdx)}),D(700));return;}}else err++;glow();}}
  T.setKey(e=>{const m=KMAP[e.code];if(m&&!e.repeat){e.preventDefault();press(m);}});
  if(!song){const row=h('div','btnrow');const rb=h('button','bigbtn sm','⏺ <span>הַקְלָטָה</span>');const pb=h('button','bigbtn blue sm',ICON.play+'<span>הַשְׁמָעָה</span>');
    rb.onclick=()=>{if(rec){last=rec;rec=null;rb.innerHTML='⏺ <span>הַקְלָטָה</span>';rb.classList.remove('rec');}else{rec=[];recT=performance.now();rb.innerHTML='⏹ <span>עֲצֹר</span>';rb.classList.add('rec');}};
    pb.onclick=()=>{last.forEach(([m,t])=>setTimeout(()=>{playMidi(m);const k=kb.querySelector(`[data-m="${m}"]`);if(k){k.classList.add('dn');setTimeout(()=>k.classList.remove('dn'),180);}},t));};
    row.append(rb,pb);s.appendChild(row);
    const sr=h('div','acts');SONGS.forEach((sg,i)=>{const c=h('button','actc',`<span class="ai">${X.note}</span><span class="an">${sg[0]}</span>`);c.onclick=()=>piano(back,i);sr.appendChild(c);});s.appendChild(h('div','lcap','אוֹ בְּחַר שִׁיר לְנַגֵּן לְפִי הָאוֹר:'));s.appendChild(sr);}
  else{const b=h('button','bigbtn plain sm',ICON.redo+'<span>לִשְׁמֹעַ אֶת הַשִּׁיר</span>');b.onclick=()=>song[1].forEach((m,i)=>playMidi(m,.45,.8,i*.42));s.appendChild(b);}
  glow();window.__piano={press,get pos(){return pos;},song};}
building({id:'music',name:'אוּלַם הַמּוּזִיקָה',color:'#b8860b',bg:'clock',icon:()=>X.note,blurb:'תָּוִים, קֶצֶב וּנְגִינָה. אֶפְשָׁר לְנַגֵּן גַּם בַּמִּקְלֶדֶת.',acts:[
  {id:'mus-notes',name:'שְׁמוֹת הַתָּוִים',icon:()=>X.note,run:back=>quiz({id:'mus-notes',title:'שְׁמוֹת הַתָּוִים',bg:'clock',back,n:8,gen:i=>{const lvl=i<3?[0,2,4]:i<6?[0,1,2,3,4,5,6]:[0,1,2,3,4,5,6,7];const idx=pick(lvl);const right=SOL[idx%7];const opts=shuffle([right,...shuffle(SOL.filter(x=>x!==right)).slice(0,2)]);
     return {pr:`${staff(idx)}<div class="qq">אֵיזֶה תָּו זֶה?</div>`,opts,ans:opts.indexOf(right),cls:'tx',play:()=>playMidi(midiOf(idx)),auto:1,key:'n'+idx+'-'+i};}})},
  {id:'mus-dur',name:'אֹרֶךְ הַתָּוִים',icon:()=>durSVG('h'),run:back=>quiz({id:'mus-dur',title:'אֹרֶךְ הַתָּוִים',bg:'clock',back,n:8,gen:i=>{const d=pick(DUR);if(i%2){const opts=shuffle(DUR.map(x=>String(x[1])));return {pr:`${durSVG(d[2])}<div class="qq">כַּמָּה פְּעָמוֹת נִמְשָׁךְ תָּו ${d[0]}?</div>`,opts,ans:opts.indexOf(String(d[1])),cls:'',ltr:1,key:'b'+d[2]+i};}
     const opts=shuffle(DUR.map(x=>x[0]));return {pr:`${durSVG(d[2])}<div class="qq">אֵיזֶה תָּו זֶה?</div>`,opts,ans:opts.indexOf(d[0]),cls:'tx',key:'n'+d[2]+i};}})},
  {id:'mus-ear',name:'אֹזֶן מוּזִיקָלִית',icon:()=>'<span style="font-size:34px">👂</span>',run:back=>quiz({id:'mus-ear',title:'אֹזֶן מוּזִיקָלִית',bg:'clock',back,n:8,gen:i=>{const a=rand(60,72);const same=i%4===3;const b=same?a:a+(Math.random()<.5?-1:1)*rand(3,7);const opts=['גָּבוֹהַּ יוֹתֵר','נָמוּךְ יוֹתֵר','אוֹתוֹ צְלִיל'];const ans=same?2:b>a?0:1;
     return {pr:`<div class="qq">הַקְשֵׁב לִשְׁנֵי צְלִילִים. הַשֵּׁנִי...</div>`,opts,ans,cls:'tx',play:()=>{playMidi(a,.5);playMidi(b,.5,1,.6);},auto:1,playLbl:'שׁוּב',key:a+'-'+b+'-'+i};}})},
  {id:'mus-rhythm',name:'קֶצֶב',icon:()=>'<span style="font-size:34px">🥁</span>',run:rhythm},
  {id:'mus-piano',name:'פְּסַנְתֵּר',icon:()=>X.keys,run:back=>piano(back)}]});
T.MUSIC={SONGS,staff,midiOf,piano};
})();

/* ===== SCIENCE LAB ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,ICON,SPR}=O;const {X,ALLSPR,building,quiz}=T;const sfx=O.sfx,D=O.D;
const FLOAT=[['בּוּל עֵץ','log',1,'m'],['אֶבֶן','stone',0,'f'],['מַפְתֵּחַ','key',0,'m'],['עָלֶה','leaf',1,'m'],['כַּדּוּר','ball',1,'m'],['מַטְבֵּעַ','coin',0,'m'],['תַּפּוּחַ','apple',1,'m'],['סִירָה','boat',1,'f'],['מַסְמֵר','nail',0,'m'],['פְּקָק','cork',1,'m']];
const tank=k=>`<div class="tank"><span class="item" id="itm">${ALLSPR(k)}</span><div class="water"></div></div>`;
const MAG=[['הַמַּסְמֵר','nail',1],['הַמְּהַדֵּק','clip',1],['הַבֹּרֶג','screw',1],['הָעִפָּרוֹן','pencil',0],['הֶעָלֶה','leaf',0],['הַכַּדּוּר','ball',0],['הָאֶבֶן','stone',0],['הַפְּקָק','cork',0],['הַתַּפּוּחַ','apple',0]];
const ANIMALS=[['הַכֶּלֶב','dog','יוֹנֵק'],['הֶחָתוּל','cat','יוֹנֵק'],['הַכִּבְשָׂה','sheep','יוֹנֵק','',1],['הַלִּוְיָתָן','whale','יוֹנֵק','הַלִּוְיָתָן חַי בַּיָּם, אֲבָל הוּא יוֹנֵק: הוּא נוֹשֵׁם אֲוִיר וּמֵינִיק אֶת הַגּוּרִים.'],['הַצִּפּוֹר','bird','עוֹף','',1],['הַנֶּשֶׁר','eagle','עוֹף'],['הַיַּנְשׁוּף','owl','עוֹף'],['הַדָּג','fish','דָּג'],['הַצָּב','turtle','זוֹחֵל','לַצָּב יֵשׁ שִׁרְיוֹן וְקַשְׂקַשִּׂים. הוּא זוֹחֵל.']];
const CLASSES=['יוֹנֵק','עוֹף','דָּג','זוֹחֵל'];
const BODY=[['רֹאשׁ',[50,14]],['שֵׂעָר',[50,6]],['עֵינַיִם',[50,30]],['פֶּה',[50,42]],['יָד',[10,68]],['בֶּטֶן',[50,66]],['רֶגֶל',[34,90]]];
/* plant simulator */
function plant(back){let day=0,stage=0,water=false,sun=true,err=0;O.setScreen('sTal','forest',back);T.hudT('מָה צָרִיךְ צֶמַח?');const s=$('#sTal');s.innerHTML='';
  const view=h('div','plantv');const info=h('div','lcap');const row=h('div','btnrow');const wb=h('button','bigbtn blue sm','💧 <span>לְהַשְׁקוֹת</span>');const sb=h('button','bigbtn gold sm','☀️ <span>שֶׁמֶשׁ</span>');const nb2=h('button','bigbtn',ICON.play+'<span>הַיּוֹם הַבָּא</span>');row.append(wb,sb,nb2);s.append(view,info,row);
  const draw=()=>{const st=['🌰','🌱','🌿','🪴','🌷'][stage];view.innerHTML=`<div class="sky ${sun?'sunny':'dark'}">${sun?X.sun:X.cloud}</div><div class="pot"><span class="pl s${stage}">${st}</span><div class="soil ${water?'wet':''}"></div></div><div class="day">יוֹם ${day}</div>`;
    info.innerHTML=stage>=4?'הַצֶּמַח פָּרַח! 🌷':water?'הָאֲדָמָה רְטֻבָּה':'הָאֲדָמָה יְבֵשָׁה';sb.classList.toggle('plain',!sun);};
  wb.onclick=()=>{water=true;sfx.pop(2);draw();};sb.onclick=()=>{sun=!sun;sfx.pop(3);draw();};
  nb2.onclick=()=>{day++;if(water&&sun){stage=Math.min(4,stage+1);sfx.ok(stage);}else{sfx.no();info.innerHTML=!water?'הַצֶּמַח צָמֵא! צָרִיךְ מַיִם.':'בְּלִי שֶׁמֶשׁ הַצֶּמַח לֹא גָּדֵל.';}water=false;draw();if(!water&&!(stage>=4))setTimeout(()=>{if(stage<4)info.innerHTML=info.innerHTML;},0);
    if(stage>=4){nb2.disabled=true;setTimeout(()=>{if(!view.isConnected)return;const Q=[['מָה צָרִיךְ צֶמַח כְּדֵי לִגְדֹּל?','מַיִם וְאוֹר',['רַק חֹשֶׁךְ','מוּזִיקָה']],['מָה קוֹרֶה לְצֶמַח בְּלִי מַיִם?','הוּא נוֹבֵל',['הוּא גָּדֵל מַהֵר','הוּא עָף']],['מֵאַיִן הַצֶּמַח מְקַבֵּל אוֹר?','מֵהַשֶּׁמֶשׁ',['מֵהָאֲדָמָה','מֵהַגֶּשֶׁם']]];let k=0;
      quiz({id:'sci-plant',title:'מָה צָרִיךְ צֶמַח?',bg:'forest',back,n:3,gen:()=>{const [q,a,ds]=Q[k++];const opts=shuffle([a,...ds]);return {pr:`<div class="sent">${q}</div>`,opts,ans:opts.indexOf(a),cls:'tx',key:q};}});},D(1400));}};
  draw();window.__plant={water:()=>wb.click(),next:()=>nb2.click(),get stage(){return stage;}};}
/* circuit */
function circuit(back){let wire=false,sw=false;O.setScreen('sTal','city',back);T.hudT('מַעְגָּל חַשְׁמַלִּי');const s=$('#sTal');s.innerHTML='';
  const v=h('div','circ');const info=h('div','lcap','סִגְרוּ אֶת הַמַּעְגָּל כְּדֵי שֶׁהַנּוּרָה תִּדָּלֵק');const row=h('div','btnrow');const wb=h('button','bigbtn sm','🔌 <span>לְחַבֵּר חוּט</span>');const sb=h('button','bigbtn blue sm','🔘 <span>מֶתֶג</span>');row.append(wb,sb);s.append(v,info,row);
  const draw=()=>{const on=wire&&sw;v.innerHTML=`<svg viewBox="0 0 320 200" class="csvg" aria-hidden="true"><rect x="20" y="70" width="40" height="70" rx="4" fill="#3a3f45"/><rect x="30" y="62" width="20" height="10" fill="#9aa1a8"/><text x="40" y="112" text-anchor="middle" fill="#ffd166" font-weight="900" font-size="22">+</text>
    <path d="M40 62 V30 H140" stroke="#e4572e" stroke-width="6" fill="none"/>${wire?'<path d="M140 30 H200" stroke="#e4572e" stroke-width="6"/>':'<path d="M140 30 H200" stroke="#e4572e" stroke-width="3" stroke-dasharray="6 6" opacity=".35"/>'}
    <path d="M200 30 H280 V90" stroke="#e4572e" stroke-width="6" fill="none"/><circle cx="280" cy="110" r="22" fill="${on?'#ffe27a':'#e8eef2'}" stroke="#23303b" stroke-width="3"/>${on?'<circle cx="280" cy="110" r="38" fill="#ffe27a" opacity=".35"/>':''}<rect x="270" y="130" width="20" height="14" fill="#9aa1a8"/>
    <path d="M280 144 V175 H200" stroke="#3a8fc4" stroke-width="6" fill="none"/><line x1="200" y1="175" x2="${sw?140:150}" y2="${sw?175:150}" stroke="#23303b" stroke-width="6" stroke-linecap="round"/><circle cx="200" cy="175" r="6" fill="#23303b"/><circle cx="140" cy="175" r="6" fill="#23303b"/>
    <path d="M140 175 H40 V140" stroke="#3a8fc4" stroke-width="6" fill="none"/></svg>`;info.innerHTML=on?'💡 הַנּוּרָה דּוֹלֶקֶת! הַמַּעְגָּל סָגוּר.':!wire?'חָסֵר חוּט בַּמַּעְגָּל':'הַמֶּתֶג פָּתוּחַ';
    if(on){sfx.ok(2);row.querySelectorAll('button').forEach(b=>b.disabled=true);setTimeout(()=>{if(!v.isConnected)return;const Q=[['מָתַי הַנּוּרָה דּוֹלֶקֶת?','כְּשֶׁהַמַּעְגָּל סָגוּר',['כְּשֶׁיֵּשׁ פֶּתַח בַּחוּט','כְּשֶׁאֵין סוֹלְלָה']],['מָה נוֹתֵן אֶת הַחַשְׁמַל?','הַסּוֹלְלָה',['הַנּוּרָה','הַמֶּתֶג']],['מָה עוֹשֶׂה הַמֶּתֶג?','פּוֹתֵחַ וְסוֹגֵר אֶת הַמַּעְגָּל',['מְחַמֵּם אֶת הַחֶדֶר','מַשְׁמִיעַ מוּזִיקָה']]];let k=0;
      quiz({id:'sci-circ',title:'מַעְגָּל חַשְׁמַלִּי',bg:'city',back,n:3,gen:()=>{const [q,a,ds]=Q[k++];const opts=shuffle([a,...ds]);return {pr:`<div class="sent">${q}</div>`,opts,ans:opts.indexOf(a),cls:'tx',key:q};}});},D(1600));}};
  wb.onclick=()=>{wire=!wire;sfx.pop(2);draw();};sb.onclick=()=>{sw=!sw;sfx.key();draw();};draw();}
/* ice-water-steam */
function states(back){let temp=1;O.setScreen('sTal','mount',back);T.hudT('קֶרַח, מַיִם וְאֵדִים');const s=$('#sTal');s.innerHTML='';
  const v=h('div','statev');const rng=h('input','');rng.type='range';rng.min=0;rng.max=2;rng.value=1;rng.id='tempR';rng.className='trng';rng.setAttribute('aria-label','חום');
  const lab=h('div','lcap');const go=h('button','bigbtn',ICON.play+'<span>לַשְּׁאֵלוֹת</span>');s.append(v,rng,lab,go);
  const draw=()=>{temp=+rng.value;v.innerHTML=temp===0?'<div class="ice">🧊</div>':temp===1?'<div class="wat">💧💧💧</div>':'<div class="steam">♨️</div>';lab.innerHTML=['קַר מְאוֹד: הַמַּיִם קוֹפְאִים לְקֶרַח','חַמִּים: מַיִם נוֹזְלִים','חַם מְאוֹד: הַמַּיִם רוֹתְחִים וְהוֹפְכִים לְאֵדִים'][temp];};
  rng.oninput=()=>{draw();sfx.pop(temp+1);};draw();
  go.onclick=()=>{const Q=[['מָה קוֹרֶה לְקֶרַח בַּשֶּׁמֶשׁ?','הוּא נָמֵס לְמַיִם',['הוּא נִהְיֶה אֶבֶן','הוּא נִהְיֶה גָּדוֹל']],['מָה קוֹרֶה לְמַיִם בַּמַּקְפִּיא?','הֵם קוֹפְאִים לְקֶרַח',['הֵם רוֹתְחִים','הֵם נֶעֱלָמִים']],['מָה יוֹצֵא מִקֻּמְקוּם רוֹתֵחַ?','אֵדִים',['קֶרַח','חוֹל']],['קֶרַח, מַיִם וְאֵדִים הֵם...','אוֹתוֹ חֹמֶר',['שְׁלוֹשָׁה דְּבָרִים שׁוֹנִים לְגַמְרֵי','סוּגִים שֶׁל אֶבֶן']]];let k=0;
    quiz({id:'sci-states',title:'קֶרַח, מַיִם וְאֵדִים',bg:'mount',back,n:4,gen:()=>{const [q,a,ds]=Q[k++];const opts=shuffle([a,...ds]);return {pr:`<div class="sent">${q}</div>`,opts,ans:opts.indexOf(a),cls:'tx',key:q};}});};}
/* day & night */
function dayNight(back){O.setScreen('sTal','final',back);T.hudT('יוֹם וְלַיְלָה');const s=$('#sTal');s.innerHTML='';let ang=0;
  const v=h('div','dnv');const lab=h('div','lcap');const rng=h('input','trng');rng.type='range';rng.min=0;rng.max=359;rng.value=0;rng.id='earthR';rng.setAttribute('aria-label','סיבוב');const go=h('button','bigbtn',ICON.play+'<span>לַשְּׁאֵלוֹת</span>');s.append(v,rng,lab,go);
  const draw=()=>{ang=+rng.value;const day=Math.cos(ang*Math.PI/180)>0;v.innerHTML=`<svg viewBox="0 0 320 180" class="csvg" aria-hidden="true"><circle cx="40" cy="90" r="30" fill="#ffcf4d"/><g stroke="#ffcf4d" stroke-width="4">${[0,1,2,3,4,5,6,7].map(k=>`<line x1="${40+38*Math.cos(k*Math.PI/4)}" y1="${90+38*Math.sin(k*Math.PI/4)}" x2="${40+46*Math.cos(k*Math.PI/4)}" y2="${90+46*Math.sin(k*Math.PI/4)}"/>`).join('')}</g>
    <circle cx="220" cy="90" r="60" fill="#3a8fc4"/><path d="M220 30 A60 60 0 0 1 220 150 Z" fill="rgba(10,15,40,.55)"/><g transform="rotate(${-ang} 220 90)"><rect x="152" y="80" width="14" height="14" fill="#e4572e"/><path d="M150 80 L159 70 L168 80Z" fill="#94613a"/></g></svg>`;
    lab.innerHTML=day?'☀️ בַּבַּיִת שֶׁל אוֹרֶן עַכְשָׁו יוֹם':'🌙 בַּבַּיִת שֶׁל אוֹרֶן עַכְשָׁו לַיְלָה';};
  rng.oninput=draw;draw();
  go.onclick=()=>{const Q=[['לָמָּה יֵשׁ יוֹם וְלַיְלָה?','כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב',['הַשֶּׁמֶשׁ הוֹלֶכֶת לִישֹׁן','הָעֲנָנִים מַסְתִּירִים']],['כְּשֶׁאֶצְלֵנוּ יוֹם, בַּצַּד הַשֵּׁנִי שֶׁל כַּדּוּר הָאָרֶץ...','לַיְלָה',['גַּם יוֹם','שֶׁלֶג']],['מָה מֵאִיר לָנוּ בַּיּוֹם?','הַשֶּׁמֶשׁ',['הַיָּרֵחַ','הַכּוֹכָבִים']]];let k=0;
    quiz({id:'sci-day',title:'יוֹם וְלַיְלָה',bg:'final',back,n:3,gen:()=>{const [q,a,ds]=Q[k++];const opts=shuffle([a,...ds]);return {pr:`<div class="sent">${q}</div>`,opts,ans:opts.indexOf(a),cls:'tx',key:q};}});};}
const bodyFig=(x,y)=>`<div class="bodyf">${O.AV()}<span class="arrow" style="left:${x}%;top:${y}%"></span></div>`;
building({id:'lab',name:'הַמַּעְבָּדָה',color:'#3cb371',bg:'mount',icon:()=>X.flask,blurb:'נִסּוּיִים קְטַנִּים: מְנַחֲשִׁים, בּוֹדְקִים וְלוֹמְדִים.',acts:[
  {id:'sci-float',name:'צָף אוֹ שׁוֹקֵעַ?',icon:()=>X.boat,run:back=>quiz({id:'sci-float',title:'צָף אוֹ שׁוֹקֵעַ?',bg:'sea',back,n:8,gen:()=>{const [n,k,f,g]=pick(FLOAT);const fm=g==='f';return {pr:`${tank(k)}<div class="qq">${n}: ${fm?'תָּצוּף אוֹ תִּשְׁקַע?':'יָצוּף אוֹ יִשְׁקַע?'}</div>`,opts:fm?['תָּצוּף','תִּשְׁקַע']:['יָצוּף','יִשְׁקַע'],ans:f?0:1,cls:'tx',key:n,reveal:el=>{const it=el.querySelector('#itm');if(it)it.classList.add(f?'floats':'sinks');sfx.plank();},explain:`${n} ${f?(fm?'צָפָה':'צָף'):(fm?'שׁוֹקַעַת':'שׁוֹקֵעַ')}!`};}})},
  {id:'sci-mag',name:'מַגְנֵטִים',icon:()=>X.magnet,run:back=>quiz({id:'sci-mag',title:'מַגְנֵטִים',bg:'city',back,n:8,gen:()=>{const [n,k,m]=pick(MAG);return {pr:`<div class="magv"><span class="mg">${X.magnet}</span><span class="item" id="itm">${ALLSPR(k)}</span></div><div class="qq">הַאִם הַמַּגְנֵט יִמְשֹׁךְ אֶת ${n}?</div>`,opts:['כֵּן','לֹא'],ans:m?0:1,cls:'tx',key:n,reveal:el=>{const it=el.querySelector('#itm');if(it&&m)it.classList.add('pulled');},explain:m?'מַגְנֵט מוֹשֵׁךְ בַּרְזֶל וּפְלָדָה.':'מַגְנֵט לֹא מוֹשֵׁךְ עֵץ, אֶבֶן, פְּלַסְטִיק אוֹ אֹכֶל.'};}})},
  {id:'sci-animals',name:'מִיּוּן בַּעֲלֵי חַיִּים',icon:()=>SPR.owl,run:back=>quiz({id:'sci-animals',title:'מִיּוּן בַּעֲלֵי חַיִּים',bg:'forest',back,n:8,gen:()=>{const [n,k,c,ex,fm]=pick(ANIMALS);return {pr:`<span class="pic">${ALLSPR(k)}</span><div class="qq">${n} ${fm?'הִיא':'הוּא'}...</div>`,opts:CLASSES,ans:CLASSES.indexOf(c),cls:'tx',key:n,explain:ex||''};}})},
  {id:'sci-body',name:'גּוּף הָאָדָם',icon:()=>O.AV(),run:back=>quiz({id:'sci-body',title:'גּוּף הָאָדָם',bg:'valley',back,n:7,gen:()=>{const [n,[x,y]]=pick(BODY);const opts=shuffle([n,...shuffle(BODY.filter(b=>b[0]!==n)).slice(0,2).map(b=>b[0])]);return {pr:`${bodyFig(x,y)}<div class="qq">מָה מְסֻמָּן בַּחֵץ?</div>`,opts,ans:opts.indexOf(n),cls:'tx',key:n};}})},
  {id:'sci-plant',name:'מָה צָרִיךְ צֶמַח?',icon:()=>SPR.flower,run:plant},
  {id:'sci-states',name:'קֶרַח, מַיִם וְאֵדִים',icon:()=>'<span style="font-size:34px">🧊</span>',run:states},
  {id:'sci-day',name:'יוֹם וְלַיְלָה',icon:()=>X.moon,run:dayNight},
  {id:'sci-circ',name:'מַעְגָּל חַשְׁמַלִּי',icon:()=>'<span style="font-size:34px">💡</span>',run:circuit}]});
})();

/* ===== ART STUDIO ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,ICON,SPR}=O;const {X,building,quiz}=T;const sfx=O.sfx,D=O.D;
const PAL=['#1d2631','#ffffff','#e63946','#ff8a3d','#ffd166','#4fae4f','#2d6a4f','#7fd6f5','#3a8fc4','#24467a','#8e6fd1','#ff9cc2','#94613a','#e9c8a0','#8d939a','#c9e86a'];
const HEX='0123456789abcdef';const N=16;
function artSVG(str,cls){if(!str)return '';let r='';for(let i=0;i<N*N;i++){const c=str[i];if(c&&c!=='.')r+=`<rect x="${i%N}" y="${(i/N)|0}" width="1.05" height="1.05" fill="${PAL[HEX.indexOf(c)]}"/>`;}
  return `<svg class="${cls||'artsvg'}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><rect width="16" height="16" fill="#fffaf0"/>${r}</svg>`;}
window.TAL_artSVG=s=>artSVG(s,'artsvg framed');
/* --- pixel editor --- */
function editor(back,loadIdx){const s0=T.S();let cells=(loadIdx!=null&&s0.art[loadIdx]?s0.art[loadIdx]:'.'.repeat(N*N)).split('');let col=2,tool='brush',mirror=false,editing=loadIdx,dirty=false;
  O.setScreen('sTal','valley',back);T.hudT('סְטוּדְיוֹ פִּיקְסֶלִים');O.sayNow='ציירו ציור משלכם';const s=$('#sTal');s.innerHTML='';
  const wrap=h('div','pxed');const grid=h('div','pxg');grid.style.setProperty('--n',N);
  for(let i=0;i<N*N;i++){const c=h('i','px');c.dataset.i=i;grid.appendChild(c);}
  const pal=h('div','pxpal');PAL.forEach((p,k)=>{const b=h('button','sw'+(k===col?' on':''));b.style.background=p;b.setAttribute('aria-label','צבע '+(k+1));b.onclick=()=>{col=k;if(tool==='erase')setTool('brush');pal.querySelectorAll('.sw').forEach((x,j)=>x.classList.toggle('on',j===k));sfx.pop(2);};pal.appendChild(b);});
  const tools=h('div','pxtools');const TB={};
  [['brush','🖌️','מִכְחוֹל'],['fill','🪣','דְּלִי'],['erase','🧽','מַחַק']].forEach(([id,ic,nm])=>{const b=h('button','tbtn'+(id===tool?' on':''),`<span>${ic}</span><small>${nm}</small>`);b.onclick=()=>setTool(id);TB[id]=b;tools.appendChild(b);});
  const mb=h('button','tbtn',`<span>🦋</span><small>מַרְאָה</small>`);mb.onclick=()=>{mirror=!mirror;mb.classList.toggle('on',mirror);sfx.pop(3);};tools.appendChild(mb);
  const cb=h('button','tbtn',`<span>🗑️</span><small>נִקּוּי</small>`);cb.onclick=()=>{if(!confirmClear())return;cells=cells.map(()=>'.');draw();sfx.whoosh&&sfx.whoosh();};tools.appendChild(cb);
  let clearArm=0;function confirmClear(){if(Date.now()-clearArm<2500)return true;clearArm=Date.now();O.floatText(cb,'שׁוּב לְאִשּׁוּר');return false;}
  function setTool(t){tool=t;Object.entries(TB).forEach(([k,b])=>b.classList.toggle('on',k===t));sfx.pop(1);}
  function draw(){const ch=grid.children;for(let i=0;i<N*N;i++){const c=cells[i];ch[i].style.background=c==='.'?'':PAL[HEX.indexOf(c)];}}
  function setCell(i,v){if(cells[i]===v)return false;cells[i]=v;dirty=true;return true;}
  function paint(i){const v=tool==='erase'?'.':HEX[col];if(tool==='fill'){flood(i,v);draw();sfx.pop(4);return;}
    let ch=setCell(i,v);if(mirror){const x=i%N,y=(i/N)|0;ch=setCell(y*N+(N-1-x),v)||ch;}if(ch){draw();sfx.key&&sfx.key();}}
  function flood(i,v){const from=cells[i];if(from===v)return;const st=[i];while(st.length){const j=st.pop();if(cells[j]!==from)continue;cells[j]=v;dirty=true;const x=j%N,y=(j/N)|0;if(x>0)st.push(j-1);if(x<N-1)st.push(j+1);if(y>0)st.push(j-N);if(y<N-1)st.push(j+N);}}
  let down=false;const at=e=>{const r=grid.getBoundingClientRect();const x=Math.floor((e.clientX-r.left)/r.width*N),y=Math.floor((e.clientY-r.top)/r.height*N);return x>=0&&y>=0&&x<N&&y<N?y*N+x:-1;};
  grid.onpointerdown=e=>{e.preventDefault();down=true;try{grid.setPointerCapture(e.pointerId);}catch(_){}const i=at(e);if(i>=0)paint(i);};
  grid.onpointermove=e=>{if(!down||tool==='fill')return;const i=at(e);if(i>=0)paint(i);};
  grid.onpointerup=grid.onpointercancel=()=>{down=false;};
  const row=h('div','btnrow');const sv=h('button','bigbtn',SPR.star+'<span>שְׁמֹר בַּגָּלֶרְיָה</span>');const gl=h('button','bigbtn plain sm','🖼️ <span>גָּלֶרְיָה</span>');row.append(gl,sv);
  sv.onclick=()=>{const str=cells.join('');if(!/[^.]/.test(str)){O.floatText(sv,'עוֹד רֵיק!');sfx.no();return;}const s=T.S();
    if(editing!=null&&s.art[editing]!=null)s.art[editing]=str;else{if(s.art.length>=12){s.art.shift();if(s.kpic!=null)s.kpic=s.kpic>0?s.kpic-1:null;}s.art.push(str);editing=s.art.length-1;}
    s.artT=Date.now();dirty=false;const first=!(s.tl['art-draw']);T.record('art-draw',3);if(first)O.addGems(10,sv);sfx.build&&sfx.build();O.burst(...O.center(grid),30);O.floatText(sv,'נִשְׁמַר!');};
  gl.onclick=()=>gallery(back);
  wrap.append(grid,h('div','pxside'));wrap.lastChild.append(pal,tools);s.append(wrap,row);draw();
  T.setKey(null);
  window.__art={paint:(i,c)=>{col=c;tool='brush';paint(i);},fill:(i,c)=>{col=c;tool='fill';paint(i);setTool('brush');},save:()=>sv.click(),get cells(){return cells.join('');},mirror:v=>{mirror=v;}};}
function gallery(back){const s0=T.S();O.setScreen('sTal','valley',back);T.hudT('הַגָּלֶרְיָה שֶׁלִּי');const s=$('#sTal');s.innerHTML='';
  s.appendChild(h('div','whead',`<span class="gd">🖼️</span><h1>הַגָּלֶרְיָה שֶׁלִּי</h1>`));
  if(!s0.art.length){s.appendChild(h('div','lsent','עוֹד אֵין צִיּוּרִים. בּוֹא נְצַיֵּר!'));}
  const g=h('div','gal');s0.art.forEach((a,i)=>{const c=h('div','gcard'+(s0.kpic===i?' hung':''),artSVG(a));const r=h('div','grow');
    const e=h('button','gb','✏️');e.title='לַעֲרֹךְ';e.setAttribute('aria-label','לערוך');e.onclick=()=>editor(back,i);
    const k=h('button','gb','🏰');k.title='תְּלֵה בַּמַּמְלָכָה';k.setAttribute('aria-label','לתלות בממלכה');k.onclick=()=>{s0.kpic=i;s0.kpicT=Date.now();O.persist();sfx.build&&sfx.build();gallery(back);O.floatText(k,'נִתְלָה בַּמַּמְלָכָה!');};
    const d=h('button','gb','🗑️');d.title='לִמְחֹק';d.setAttribute('aria-label','למחוק');let arm=0;d.onclick=()=>{if(Date.now()-arm>2500){arm=Date.now();O.floatText(d,'שׁוּב לִמְחִיקָה');return;}s0.art.splice(i,1);if(s0.kpic===i)s0.kpic=null;else if(s0.kpic>i)s0.kpic--;s0.artT=Date.now();O.persist();gallery(back);};
    r.append(e,k,d);c.appendChild(r);g.appendChild(c);});
  s.appendChild(g);const nb=h('button','bigbtn',ICON.play+'<span>צִיּוּר חָדָשׁ</span>');nb.onclick=()=>editor(back);const row=h('div','btnrow');row.appendChild(nb);s.appendChild(row);}
/* --- colour mixing --- */
const CN={red:['אָדֹם','#e63946'],yellow:['צָהֹב','#ffd166'],blue:['כָּחֹל','#3a8fc4'],white:['לָבָן','#ffffff'],black:['שָׁחֹר','#1d2631'],orange:['כָּתֹם','#ff8a3d'],green:['יָרֹק','#4fae4f'],purple:['סָגֹל','#8e6fd1'],pink:['וָרֹד','#ff9cc2'],sky:['תְּכֵלֶת','#9ad8f5'],gray:['אָפֹר','#8d939a'],brown:['חוּם','#94613a']};
const MIX=[['red','yellow','orange'],['blue','yellow','green'],['blue','red','purple'],['red','white','pink'],['blue','white','sky'],['black','white','gray']];
const blob=k=>`<span class="blob" style="--c:${CN[k][1]}"></span>`;
const swatch=k=>`<span class="swc" style="--c:${CN[k][1]}"></span><span>${CN[k][0]}</span>`;
function mixLab(back){O.setScreen('sTal','valley',back);T.hudT('מְעַרְבְּבִים צְבָעִים');const s=$('#sTal');s.innerHTML='';const base=['red','yellow','blue','white','black'];let sel=[];
  const pot=h('div','mixpot','<div class="potc"></div>');const lab=h('div','lcap','בַּחֲרוּ שְׁנֵי צְבָעִים וְעַרְבְּבוּ');const row=h('div','mixrow');
  base.forEach(k=>{const b=h('button','mixb',blob(k)+`<span>${CN[k][0]}</span>`);b.onclick=()=>{sel.push(k);if(sel.length>2)sel=sel.slice(-2);sfx.pop(2);show();};row.appendChild(b);});
  const show=()=>{const p=pot.firstChild;if(sel.length<2){p.style.background=sel[0]?CN[sel[0]][1]:'#e8eef2';lab.innerHTML=sel.length?`${CN[sel[0]][0]} + ...`:'בַּחֲרוּ שְׁנֵי צְבָעִים וְעַרְבְּבוּ';return;}
    const m=MIX.find(x=>(x[0]===sel[0]&&x[1]===sel[1])||(x[0]===sel[1]&&x[1]===sel[0]));p.classList.remove('swirl');void p.offsetWidth;p.classList.add('swirl');
    if(sel[0]===sel[1]){p.style.background=CN[sel[0]][1];lab.innerHTML=`${CN[sel[0]][0]} + ${CN[sel[0]][0]} = ${CN[sel[0]][0]}`;}
    else if(m){p.style.background=CN[m[2]][1];lab.innerHTML=`${CN[sel[0]][0]} + ${CN[sel[1]][0]} = <b>${CN[m[2]][0]}</b>!`;sfx.ok(2);tried.add(m[2]);}
    else{const wk=sel.includes('white')?'white':'black',oth=sel[0]===wk?sel[1]:sel[0];const hx=c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16));const a=hx(CN[oth][1]),b=hx(CN[wk][1]);const m=a.map((v,k)=>Math.round(v*.6+b[k]*.4));
      p.style.background=`rgb(${m.join(',')})`;lab.innerHTML=`${CN[sel[0]][0]} + ${CN[sel[1]][0]} = ${CN[oth][0]} ${wk==='white'?'בָּהִיר':'כֵּהֶה'}`;sfx.ok(1);}
    sel=[];};
  const tried=new Set();const go=h('button','bigbtn',ICON.play+'<span>לַחִידוֹן</span>');go.onclick=()=>mixQuiz(back);const r2=h('div','btnrow');r2.appendChild(go);
  s.append(pot,lab,row,r2);show();}
function mixQuiz(back){quiz({id:'art-mix',title:'מְעַרְבְּבִים צְבָעִים',bg:'valley',back,n:6,gen:i=>{const m=MIX[i%MIX.length];const rev=Math.random()<.35&&i>2;
  if(rev){const opts=shuffle([m[1],...shuffle(['red','blue','yellow','white','black'].filter(x=>x!==m[0]&&x!==m[1])).slice(0,2)]);return {pr:`<div class="mixq">${blob(m[0])}<b>+</b><span class="blob q">?</span><b>=</b>${blob(m[2])}</div><div class="qq">${CN[m[0]][0]} וְעוֹד אֵיזֶה צֶבַע נוֹתְנִים ${CN[m[2]][0]}?</div>`,opts:opts.map(swatch),ans:opts.indexOf(m[1]),cls:'tx sw2',key:'r'+m[2]};}
  const opts=shuffle([m[2],...shuffle(['orange','green','purple','pink','sky','gray','brown'].filter(x=>x!==m[2])).slice(0,2)]);
  return {pr:`<div class="mixq">${blob(m[0])}<b>+</b>${blob(m[1])}<b>=</b><span class="blob q">?</span></div><div class="qq">${CN[m[0]][0]} וְ${CN[m[1]][0]} נוֹתְנִים...</div>`,opts:opts.map(swatch),ans:opts.indexOf(m[2]),cls:'tx sw2',key:m[2],
    reveal:el=>{const q=el.querySelector('.blob.q');if(q){q.textContent='';q.style.setProperty('--c',CN[m[2]][1]);q.classList.remove('q');}}};}});}
/* --- symmetry --- */
function symmetry(back){const R=5,M=8;let r=0,err=0,gems=0;O.setScreen('sTal','valley',back);const s=$('#sTal');
  const run=()=>{T.hudT('סִימֶטְרִיָּה',T.progressBar(r,R));O.sayNow='השלימו את הצד השני כמו במראה';
    const colr=pick([2,8,5,10,3]);const tgt=[];for(let y=0;y<M;y++)for(let x=0;x<M/2;x++)tgt[y*M+x]=Math.random()<.34+r*.05?1:0;
    for(let y=0;y<M;y++){let any=0;for(let x=0;x<M/2;x++)any|=tgt[y*M+x];if(!any&&y%2===0)tgt[y*M+rand(0,M/2-1)]=1;}
    const cur=Array(M*M).fill(0);s.innerHTML='';s.appendChild(h('div','lsent','הַשְׁלִימוּ אֶת הַצַּד הַשֵּׁנִי — כְּמוֹ בַּמַּרְאָה 🦋'));
    const g=h('div','symg');g.style.setProperty('--n',M);
    for(let i=0;i<M*M;i++){const x=i%M;const c=h('button','sc'+(x<M/2?' given':'')+(x===M/2-1?' edge':''));if(x<M/2){if(tgt[i])c.style.background=PAL[colr];c.disabled=true;c.tabIndex=-1;}
      else c.onclick=()=>{cur[i]^=1;c.style.background=cur[i]?PAL[colr]:'';c.classList.remove('bad');sfx.key&&sfx.key();};c.dataset.i=i;g.appendChild(c);}
    const row=h('div','btnrow');const chk=h('button','bigbtn',SPR.star+'<span>בְּדִיקָה</span>');row.appendChild(chk);s.append(g,row);let tries=0;
    chk.onclick=()=>{let bad=0;for(let y=0;y<M;y++)for(let x=M/2;x<M;x++){const i=y*M+x;const want=tgt[y*M+(M-1-x)];if(cur[i]!==want){bad++;g.children[i].classList.add('bad');}}
      if(!bad){sfx.ok(r);const gg=tries?1:3;gems+=gg;O.addGems(gg,chk);chk.disabled=true;g.classList.add('done');setTimeout(()=>{if(!g.isConnected)return;r++;if(r>=R){T.setKey(null);T.finishAct('art-sym',err,R,gems,back,()=>symmetry(back));}else run();},D(1100));}
      else{tries++;err++;sfx.no();setTimeout(()=>g.querySelectorAll('.bad').forEach(c=>c.classList.remove('bad')),D(1200));
        if(tries>=3){for(let y=0;y<M;y++)for(let x=M/2;x<M;x++){const i=y*M+x;cur[i]=tgt[y*M+(M-1-x)];g.children[i].style.background=cur[i]?PAL[colr]:'';}O.floatText(chk,'כָּךְ זֶה נִרְאֶה');}}};
    window.__sym={solve:()=>{for(let y=0;y<M;y++)for(let x=M/2;x<M;x++){const i=y*M+x;cur[i]=tgt[y*M+(M-1-x)];}chk.click();}};};
  run();}
/* --- colour by number (each cell = exercise) --- */
const PICS=[
 {n:'לֵב',p:['........','.RR..RR.','RRRRRRRR','RRRRRRRR','.RRRRRR.','..RRRR..','...RR...','........'],c:{R:2}},
 {n:'עֵץ',p:['...GG...','..GGGG..','.GGgGGG.','GGGGGgGG','.GgGGGG.','...BB...','...BB...','..BBBB..'],c:{G:5,g:6,B:12}},
 {n:'בַּיִת',p:['...RR...','..RRRR..','.RRRRRR.','RRRRRRRR','.WWWWWW.','.WKWWBW.','.WKWWWW.','.WKWWWW.'],c:{R:2,W:13,K:12,B:8}},
 {n:'דָּג',p:['........','..OOO..O','.OOOOOOO','OEOOOOO.','OOOOOOO.','.OOOOOOO','..OOO..O','........'],c:{O:3,E:0}},
 {n:'פִּטְרִיָּה',p:['..RRRR..','.RWRRWR.','RRRRRRRR','RWRRRRWR','...WW...','...WW...','..WWWW..','........'],c:{R:2,W:1}},
 {n:'כּוֹכָב',p:['...YY...','...YY...','YYYYYYYY','.YYYYYY.','..YYYY..','.YY..YY.','YY....YY','........'],c:{Y:4}}];
function exFor(ans,lvl){const t=lvl===0?pick(['+','-']):lvl===1?pick(['+','-','+']):pick(['×','+','-']);
  if(t==='×'){const f=[];for(let a=2;a<=10;a++)if(ans%a===0&&ans/a<=10&&ans/a>=1)f.push(a);if(f.length){const a=pick(f);return `${a}×${ans/a}`;}}
  if(t==='-'||ans<3){const b=rand(1,9);return `${ans+b}-${b}`;}const a=rand(1,ans-1);return `${a}+${ans-a}`;}
function colorByNum(back,pi){const lvl=Math.min(2,((T.S().tl['art-cbn']||{}).n|0)>>1);pi=pi==null?((T.S().tl['art-cbn']||{}).n|0)%PICS.length:pi;const P=PICS[pi];const M=8;
  O.setScreen('sTal','valley',back);T.hudT('צוֹבְעִים לְפִי מִסְפָּרִים');O.sayNow='פתרו את התרגיל וצבעו בצבע של התשובה';const s=$('#sTal');s.innerHTML='';
  const keys=Object.keys(P.c);const nums=shuffle(Array.from({length:lvl===2?20:18},(_,k)=>k+2)).slice(0,keys.length);const ansOf={};keys.forEach((k,j)=>ansOf[k]=nums[j]);
  let sel=0,err=0,left=0;const legend=h('div','cleg');
  keys.forEach((k,j)=>{const b=h('button','lg'+(j===0?' on':''),`<span class="swc" style="--c:${PAL[P.c[k]]}"></span><b>${ansOf[k]}</b>`);b.onclick=()=>{sel=j;legend.querySelectorAll('.lg').forEach((x,q)=>x.classList.toggle('on',q===j));sfx.pop(2);};legend.appendChild(b);});
  const g=h('div','cbn');g.style.setProperty('--n',M);
  P.p.forEach((row,y)=>[...row].forEach((ch,x)=>{const c=h('button','cbc');if(ch==='.'){c.classList.add('bg');c.disabled=true;c.tabIndex=-1;}
    else{left++;c.textContent=exFor(ansOf[ch],lvl);c.onclick=()=>{if(c.classList.contains('done'))return;const k=keys[sel];
      if(k===ch){c.classList.add('done');c.style.background=PAL[P.c[ch]];c.textContent='';sfx.pop(3+((left%4)));left--;if(left===0)win();}
      else{err++;c.classList.add('bad');sfx.no();setTimeout(()=>c.classList.remove('bad'),D(500));}};c.dataset.k=ch;}
    g.appendChild(c);}));
  s.append(h('div','lsent',`פִּתְרוּ, בַּחֲרוּ צֶבַע לְפִי הַתְּשׁוּבָה, וְגַלּוּ: מָה בַּתְּמוּנָה?`),legend,g);
  function win(){g.classList.add('done');sfx.build&&sfx.build();setTimeout(()=>{if(!g.isConnected)return;T.setKey(null);T.finishAct('art-cbn',Math.floor(err/2),12,4,back,()=>colorByNum(back),`גִּלִּיתָ: ${P.n}!`);},D(900));}
  T.setKey(e=>{const n=+e.key;if(n>=1&&n<=keys.length)legend.children[n-1].click();});
  window.__cbn={solve:()=>{[...g.children].forEach(c=>{if(c.dataset.k&&!c.classList.contains('done')){sel=keys.indexOf(c.dataset.k);c.click();}});},ans:ansOf,get left(){return left;}};}
building({id:'art',name:'סְטוּדְיוֹ הָאָמָּנוּת',color:'#ff7eb6',bg:'valley',icon:()=>X.palette,blurb:'מְצַיְּרִים, מְעַרְבְּבִים צְבָעִים וּמְגַלִּים תְּמוּנוֹת.',acts:[
  {id:'art-draw',name:'סְטוּדְיוֹ פִּיקְסֶלִים',icon:()=>X.pencil,run:back=>editor(back)},
  {id:'art-cbn',name:'צְבִיעָה לְפִי מִסְפָּרִים',icon:()=>X.palette,run:back=>colorByNum(back)},
  {id:'art-mix',name:'מְעַרְבְּבִים צְבָעִים',icon:()=>X.flask,run:mixLab},
  {id:'art-sym',name:'סִימֶטְרִיָּה',icon:()=>'<span style="font-size:34px">🦋</span>',run:symmetry}]});
T.gallery=gallery;
})();

/* ===== MINDFULNESS GROVE ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,ICON,SPR}=O;const {X,FACES,building}=T;const sfx=O.sfx,D=O.D;
let amb=null,timers=[];
const clearT=()=>{timers.forEach(t=>{clearTimeout(t);clearInterval(t);});timers=[];};
let guard=null;const later=(f,ms)=>{const g=guard;const t=setTimeout(()=>{if(g&&!g.isConnected)return;f();},ms);timers.push(t);return t;};
function stopAmb(){if(amb){try{amb.stop();}catch(e){}amb=null;}}
const quiet=()=>{O.musicStop();O.hush&&O.hush();};
const leave=back=>()=>{clearT();stopAmb();if((O.save.snd|0)>=2)O.musicStart();back();};
function soft(f,dur,vol){const a=O.audio();if(!a||(O.save.snd|0)<1)return;O.tone(f,a.ctx.currentTime+.02,dur,{type:'sine',vol:vol||.12,rel:dur*.6,bus:a.sfxBus});}
/* --- breathing --- */
function breath(back,cycles){cycles=cycles||5;clearT();const bk=leave(back);O.setScreen('sTal','forest',bk);quiet();T.hudT('נְשִׁימָה שֶׁל בּוּעָה');O.sayNow='';const s=$('#sTal');s.innerHTML='';
  const v=h('div','breathv','<div class="bub"><span class="bt"></span></div><div class="bc"></div>');const lab=h('div','lsent','נוֹשְׁמִים יַחַד עִם הַבּוּעָה');s.append(v,lab);
  const bub=v.querySelector('.bub'),bt=v.querySelector('.bt'),bc=v.querySelector('.bc');let c=0;guard=v;
  const IN=D(4000),HOLD=D(2000),OUT=D(5000);
  const step=()=>{if($('#sTal').hidden)return clearT();if(c>=cycles){done();return;}bc.innerHTML=Array.from({length:cycles},(_,k)=>`<i class="${k<c?'on':''}"></i>`).join('');
    bub.style.transitionDuration=IN+'ms';bub.className='bub grow';bt.textContent='שְׁאַף...';soft(262,IN/1000,.07);
    later(()=>{bub.className='bub grow hold';bt.textContent='הַחְזֵק';later(()=>{bub.style.transitionDuration=OUT+'ms';bub.className='bub';bt.textContent='נְשֹׁף...';soft(196,OUT/1000,.06);later(()=>{c++;step();},OUT);},HOLD);},IN);};
  later(step,D(600));
  function done(){bc.innerHTML='';bt.textContent='😊';lab.innerHTML='יָפֶה מְאוֹד! אֵיךְ אַתָּה מַרְגִּישׁ עַכְשָׁו?';sfx.star(0);T.record('mind-breath',3);O.addGems(4);
    const row=h('div','faces sm');['calm','happy','tired','sad'].forEach(k=>{const b=h('button','face',`${FACES[k].s}<span>${FACES[k].n}</span>`);b.onclick=()=>{logMood(k);sfx.pop(3);bk();};row.appendChild(b);});s.appendChild(row);}
  window.__breath={finish:()=>{clearT();c=cycles;done();}};}
/* --- calm sounds --- */
const AMB={rain:['גֶּשֶׁם','🌧️'],waves:['גַּלִּים','🌊'],wind:['רוּחַ','🍃'],birds:['צִפּוֹרִים','🐦'],night:['לַיְלָה בַּשָּׂדֶה','🦗']};
function makeAmb(kind){const a=O.audio();if(!a)return null;const c=a.ctx,out=c.createGain();out.gain.value=0;out.connect(a.master);out.gain.setTargetAtTime(.9,c.currentTime,.8);
  const len=c.sampleRate*3,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=kind==='waves'||kind==='wind'?last*3.5:w;}
  const nodes=[],ivs=[];const src=c.createBufferSource();src.buffer=buf;src.loop=true;const f=c.createBiquadFilter();const g=c.createGain();src.connect(f).connect(g).connect(out);nodes.push(src);
  if(kind==='rain'){f.type='lowpass';f.frequency.value=2200;g.gain.value=.16;ivs.push(setInterval(()=>{const t=c.currentTime;for(let k=0;k<3;k++)O.noise(t+Math.random()*.3,.03,{ft:'bandpass',f:2500+Math.random()*3000,q:6,vol:.05,bus:out});},300));}
  else if(kind==='waves'){f.type='lowpass';f.frequency.value=700;g.gain.value=.0;const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.11;lg.gain.value=.5;lfo.connect(lg).connect(g.gain);const off=c.createConstantSource?c.createConstantSource():null;if(off){off.offset.value=.55;off.connect(g.gain);off.start();nodes.push(off);}else g.gain.value=.5;lfo.start();nodes.push(lfo);}
  else if(kind==='wind'){f.type='bandpass';f.Q.value=1.2;f.frequency.value=500;g.gain.value=.9;const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.07;lg.gain.value=300;lfo.connect(lg).connect(f.frequency);lfo.start();nodes.push(lfo);}
  else if(kind==='birds'){f.type='lowpass';f.frequency.value=500;g.gain.value=.03;const chirp=()=>{const t=c.currentTime+Math.random()*.4,b=2000+Math.random()*1800,n=rand(2,5);for(let k=0;k<n;k++)O.tone(b,t+k*.11,.08,{type:'sine',vol:.05,slide:b*(1.2+Math.random()*.3),bus:out});};ivs.push(setInterval(()=>{if(Math.random()<.6)chirp();},900));}
  else{f.type='lowpass';f.frequency.value=400;g.gain.value=.03;ivs.push(setInterval(()=>{const t=c.currentTime;for(let k=0;k<3;k++)O.tone(4200,t+k*.06,.03,{type:'square',vol:.012,bus:out});},700));
    ivs.push(setInterval(()=>{if(Math.random()<.3)O.tone(330,c.currentTime,.25,{type:'sine',vol:.04,slide:300,bus:out});},2300));}
  src.start();
  return {stop:()=>{ivs.forEach(clearInterval);out.gain.setTargetAtTime(0,c.currentTime,.3);setTimeout(()=>{nodes.forEach(n=>{try{n.stop();}catch(e){}});out.disconnect();},1500);}};}
function sounds(back){clearT();stopAmb();const bk=leave(back);O.setScreen('sTal','forest',bk);quiet();T.hudT('צְלִילִים מַרְגִּיעִים');O.sayNow='';const s=$('#sTal');s.innerHTML='';let cur=null,t0=0;
  s.appendChild(h('div','lsent','בְּחַר צְלִיל, עֲצֹם עֵינַיִם וְהַקְשֵׁב 🎧'));const g=h('div','ambg');
  Object.entries(AMB).forEach(([k,[n,e]])=>{const b=h('button','ambb',`<span class="ae">${e}</span><span>${n}</span>`);b.onclick=()=>{stopAmb();g.querySelectorAll('.ambb').forEach(x=>x.classList.remove('on'));if(cur===k){cur=null;return;}cur=k;b.classList.add('on');amb=makeAmb(k);if(!t0)t0=Date.now();};g.appendChild(b);});
  const tm=h('div','lcap');s.append(g,tm);const iv=setInterval(()=>{if($('#sTal').hidden){clearInterval(iv);stopAmb();return;}if(t0&&cur){const sec=((Date.now()-t0)/1000)|0;tm.textContent=`🕰️ ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;if(sec>=45&&!(T.S().tl['mind-sounds']||{}).n){T.record('mind-sounds',3);O.addGems(3);}else if(sec===45)T.record('mind-sounds',3);}},1000);timers.push(iv);}
/* --- feelings check-in --- */
const REPLY={happy:['אֵיזֶה כֵּיף! 🌞','רוֹצֶה לְהוֹסִיף מַשֶּׁהוּ לְצִנְצֶנֶת הַתּוֹדָה?','mind-jar'],calm:['נִפְלָא. רֹגַע זֶה כֹּחַ.','אֶפְשָׁר לְהַקְשִׁיב לִצְלִילִים מַרְגִּיעִים.','mind-sounds'],excited:['וָאוּ, יֵשׁ לְךָ הַרְבֵּה אֵנֶרְגִּיָּה!','נְשִׁימָה אַחַת אֲרֻכָּה עוֹזֶרֶת לְהִתְרַכֵּז.','mind-breath'],
  tired:['זֶה בְּסֵדֶר לִהְיוֹת עָיֵף.','אוּלַי מְתִיחָה קְטַנָּה אוֹ סְרִיקַת גּוּף?','mind-scan'],sad:['זֶה בְּסֵדֶר לִהְיוֹת עָצוּב. כָּל רֶגֶשׁ עוֹבֵר.','אֶפְשָׁר לְסַפֵּר לְמִישֶׁהוּ שֶׁאוֹהֵב אוֹתְךָ, אוֹ לִנְשֹׁם יַחַד.','mind-breath'],angry:['גַּם כַּעַס הוּא רֶגֶשׁ רָגִיל.','בּוֹא נִנְשֹׁם לְאַט כְּמוֹ בּוּעָה, וְהַכַּעַס יִקְטַן.','mind-breath']};
function logMood(k){const s=T.S();s.mood.push({d:O.today(),f:k,t:Date.now()});if(s.mood.length>120)s.mood=s.mood.slice(-120);s.moodT=Date.now();O.persist();}
function feel(back){clearT();O.setScreen('sTal','forest',back);T.hudT('אֵיךְ אֲנִי מַרְגִּישׁ?');O.sayNow='איך אתה מרגיש היום?';const s=$('#sTal');s.innerHTML='';
  s.appendChild(h('div','whead',`<h1>אֵיךְ אַתָּה מַרְגִּישׁ עַכְשָׁו?</h1>`));const g=h('div','faces');
  Object.entries(FACES).forEach(([k,f])=>{const b=h('button','face',`${f.s}<span>${f.n}</span>`);b.onclick=()=>{logMood(k);T.record('mind-feel',3);sfx.ok(1);const [a,b2,act]=REPLY[k];s.innerHTML='';
    s.appendChild(h('div','fresp',`<div class="fbig">${f.s}</div><h2>${a}</h2><div class="lsent">${b2}</div>`));O.say(a+' '+b2);const row=h('div','btnrow');
    const go=h('button','bigbtn',ICON.play+'<span>בּוֹא נְנַסֶּה</span>');go.onclick=()=>T.ACT[act].run(back);const no=h('button','bigbtn plain sm','<span>לֹא עַכְשָׁו</span>');no.onclick=back;row.append(no,go);s.appendChild(row);};g.appendChild(b);});
  s.appendChild(g);const hist=T.S().mood.slice(-7);if(hist.length)s.appendChild(h('div','mhist',`<span>הָרְגָשׁוֹת הָאַחֲרוֹנִים שֶׁלִּי:</span>${hist.map(m=>FACES[m.f]?`<i>${FACES[m.f].s}</i>`:'').join('')}`));}
/* --- gratitude jar --- */
const THX=[['🏠','הַמִּשְׁפָּחָה שֶׁלִּי'],['🧑‍🤝‍🧑','חֲבֵרִים'],['🐱','חַיּוֹת'],['🍎','אֹכֶל טָעִים'],['☀️','מֶזֶג אֲוִיר יָפֶה'],['⚽','מִשְׂחָק בַּחוּץ'],['📚','סִפּוּר טוֹב'],['🎨','צִיּוּר'],['🛏️','מִטָּה חַמָּה'],['🎵','מוּזִיקָה'],['🤗','חִבּוּק'],['🏫','מַשֶּׁהוּ שֶׁלָּמַדְתִּי']];
const BALL=['#e63946','#ffd166','#4fae4f','#3a8fc4','#8e6fd1','#ff9cc2','#ff8a3d','#7fd6f5'];
function jarSVG(n){const k=Math.min(n,40);let b='';for(let i=0;i<k;i++){const x=24+((i*37)%5)*14+(i%2)*5,y=150-Math.floor(i/5)*12;b+=`<circle cx="${x}" cy="${y}" r="7" fill="${BALL[i%BALL.length]}"/>`;}
  return `<svg viewBox="0 0 120 170" class="jarsvg" aria-hidden="true"><rect x="30" y="4" width="60" height="14" rx="4" fill="#c8925a"/><path d="M28 20 H92 Q100 24 100 34 V156 Q100 166 90 166 H30 Q20 166 20 156 V34 Q20 24 28 20Z" fill="rgba(200,235,255,.35)" stroke="#5a7f9a" stroke-width="3"/>${b}<path d="M30 34 V150" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/></svg>`;}
function jar(back){clearT();O.setScreen('sTal','forest',back);T.hudT('צִנְצֶנֶת הַתּוֹדָה');O.sayNow='על מה אתה מודה היום? בחר שלושה דברים';const s=$('#sTal');s.innerHTML='';const sel=new Set();
  const total=()=>T.S().jar.reduce((a,j)=>a+(j.i?j.i.length:0),0);
  const top=h('div','jartop',`<div class="jarw">${jarSVG(total())}</div><div class="lsent">עַל מָה אַתָּה מוֹדֶה הַיּוֹם? בְּחַר 3 דְּבָרִים 💛</div>`);const g=h('div','thx');
  THX.forEach(([e,n],k)=>{const b=h('button','thb',`<span class="ae">${e}</span><span>${n}</span>`);b.onclick=()=>{if(sel.has(k)){sel.delete(k);b.classList.remove('on');}else if(sel.size<3){sel.add(k);b.classList.add('on');sfx.pop(sel.size+1);}upd();};g.appendChild(b);});
  const row=h('div','btnrow');const ok=h('button','bigbtn',SPR.heart?SPR.heart:'💛');ok.innerHTML='💛 <span>לְהַכְנִיס לַצִּנְצֶנֶת</span>';ok.disabled=true;row.appendChild(ok);
  const upd=()=>{ok.disabled=sel.size<1;};
  ok.onclick=()=>{const s0=T.S();const d=O.today();const ex=s0.jar.find(j=>j.d===d);if(ex)ex.i=[...new Set([...ex.i,...sel])];else s0.jar.push({d,i:[...sel]});if(s0.jar.length>200)s0.jar=s0.jar.slice(-200);s0.jarT=Date.now();
    const first=!ex;T.record('mind-jar',3);if(first)O.addGems(4,ok);top.querySelector('.jarw').innerHTML=jarSVG(total());top.querySelector('.jarw').classList.add('pop');sfx.build&&sfx.build();
    g.remove();ok.remove();top.querySelector('.lsent').innerHTML=`תּוֹדָה! בַּצִּנְצֶנֶת יֵשׁ כְּבָר ${total()} דְּבָרִים טוֹבִים. 💛`;const b=h('button','bigbtn',ICON.play+'<span>הַמְשֵׁךְ</span>');b.onclick=back;row.appendChild(b);};
  s.append(top,g,row);}
/* --- body scan --- */
const SCAN=[['שְׁבוּ בְּנוֹחוּת וְעִצְמוּ עֵינַיִם.',null],['שִׂימוּ לֵב לְכַפּוֹת הָרַגְלַיִם. הֵן נוֹגְעוֹת בָּרִצְפָּה.',92],['עַכְשָׁו הָרַגְלַיִם. הֵן כְּבֵדוֹת וּרְגוּעוֹת.',80],['הַבֶּטֶן עוֹלָה וְיוֹרֶדֶת עִם הַנְּשִׁימָה.',62],['הַיָּדַיִם. סִגְרוּ אֶגְרוֹף חָזָק... וְשַׁחְרְרוּ.',66],['הַכְּתֵפַיִם. הָרִימוּ אוֹתָן לָאָזְנַיִם... וְהוֹרִידוּ.',46],['הַפָּנִים. חַיְּכוּ חִיּוּךְ קָטָן.',30],['כָּל הַגּוּף רָגוּעַ. פִּקְחוּ עֵינַיִם לְאַט.',null]];
function scan(back){clearT();const bk=leave(back);O.setScreen('sTal','forest',bk);quiet();T.hudT('סְרִיקַת גּוּף');const s=$('#sTal');s.innerHTML='';let i=0;
  const fig=h('div','scanf',`${O.AV()}<span class="glow"></span>`);guard=fig;const txt=h('div','lsent big2');const row=h('div','btnrow');const nx=h('button','bigbtn',ICON.play+'<span>הַלְאָה</span>');row.appendChild(nx);s.append(fig,txt,row);
  const show=()=>{clearT();const [t,y]=SCAN[i];txt.innerHTML=t;const gl=fig.querySelector('.glow');gl.style.opacity=y==null?0:1;if(y!=null)gl.style.top=y+'%';O.say(t);soft(220,1.5,.05);
    T.hudT('סְרִיקַת גּוּף',T.progressBar(i,SCAN.length));later(()=>nx.click(),D(9000));};
  nx.onclick=()=>{i++;if(i>=SCAN.length){clearT();T.record('mind-scan',3);O.addGems(4);T.result({title:'כָּל הַכָּבוֹד!',sub:'הַגּוּף וְהָרֹאשׁ נָחִים.',gems:4,back:bk});return;}show();};show();}
building({id:'mind',name:'חֻרְשַׁת הַשֶּׁקֶט',color:'#7cc3a0',bg:'forest',icon:()=>FACES.calm.s,blurb:'מָקוֹם שָׁקֵט לִנְשֹׁם, לְהַרְגִּישׁ וּלְהַקְשִׁיב.',acts:[
  {id:'mind-breath',name:'נְשִׁימַת בּוּעָה',icon:()=>'<span style="font-size:34px">🫧</span>',run:back=>breath(back)},
  {id:'mind-feel',name:'אֵיךְ אֲנִי מַרְגִּישׁ?',icon:()=>FACES.happy.s,run:feel},
  {id:'mind-jar',name:'צִנְצֶנֶת הַתּוֹדָה',icon:()=>X.jar,run:jar},
  {id:'mind-sounds',name:'צְלִילִים מַרְגִּיעִים',icon:()=>'<span style="font-size:34px">🎧</span>',run:sounds,noDaily:true},
  {id:'mind-scan',name:'סְרִיקַת גּוּף',icon:()=>O.AV(),run:scan}]});
})();

/* ===== CODE ROBOT ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,ICON,SPR}=O;const {X,building}=T;const sfx=O.sfx,D=O.D;
const NL=15;const DIRS={U:[0,-1,'⬆'],D:[0,1,'⬇'],L:[-1,0,'⬅'],R:[1,0,'➡']};
const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
function bfs(L,maxRun){const {n,w,s,g}=L;const dist=new Map([[s,0]]);const q=[s];while(q.length){const c=q.shift();if(c===g)return dist.get(c);const x=c%n,y=(c/n)|0;
  for(const [dx,dy] of Object.values(DIRS))for(let k=1;k<=maxRun;k++){const nx=x+dx*k,ny=y+dy*k;if(nx<0||ny<0||nx>=n||ny>=n||w.has(ny*n+nx))break;const id=ny*n+nx;if(!dist.has(id)){dist.set(id,dist.get(c)+1);q.push(id);}}}return -1;}
function level(i){const n=i<3?4:i<8?5:6;const r=rng(1000+i*77);const dens=.12+Math.min(.18,i*.015);const minLen=Math.min(3+i,n+5);
  for(let t=0;t<4000;t++){const w=new Set();for(let c=0;c<n*n;c++)if(r()<dens)w.add(c);const s=Math.floor(r()*n*n),g=Math.floor(r()*n*n);if(s===g||w.has(s)||w.has(g))continue;
    const L={n,w,s,g,rep:i>=6};const len=bfs(L,1);if(len<minLen)continue;L.len=len;L.opt=L.rep?bfs(L,3):len;return L;}
  return {n:4,w:new Set(),s:0,g:15,len:6,opt:6,rep:i>=6};}
const LV=Array.from({length:NL},(_,i)=>level(i));
const C=()=>{const s=T.S();s.code=s.code||{};return s.code;};
function menu(back){O.setScreen('sTal','city',back);T.hudT('רוֹבּוֹט הַקּוֹד');O.sayNow='בחרו שלב';const s=$('#sTal');s.innerHTML='';
  s.appendChild(h('div','whead',`<span class="gd">🤖</span><h1>רוֹבּוֹט הַקּוֹד</h1>`));s.appendChild(h('div','lsent','תַּכְנְתוּ אֶת הָרוֹבּוֹט: סַדְּרוּ חִצִּים כְּדֵי שֶׁיַּגִּיעַ לַיַּהֲלוֹם.'));
  const g=h('div','lvgrid');const cs=C();LV.forEach((L,i)=>{const st=cs[i]|0;const open=i===0||(cs[i-1]|0)>0||(T.S().set.all);const b=h('button','lvb'+(open?'':' locked'),`<b>${i+1}</b><span>${[0,1,2].map(k=>k<st?SPR.star:SPR.starOff).join('')}</span>`);
    b.disabled=!open;b.onclick=()=>play(i,back);g.appendChild(b);});s.appendChild(g);}
function play(li,back){const L=LV[li];const n=L.n;let prog=[],running=false,err=0;const mback=()=>menu(back);O.setScreen('sTal','city',mback);T.hudT(`רוֹבּוֹט הַקּוֹד · שָׁלָב ${li+1}`);O.sayNow='';
  const s=$('#sTal');s.innerHTML='';const maxB=L.opt+4;
  const board=h('div','cboard');board.style.setProperty('--n',n);for(let c=0;c<n*n;c++){const d=h('i','ct'+(L.w.has(c)?' wall':''));if(L.w.has(c))d.innerHTML=X.stone;if(c===L.g)d.innerHTML=`<span class="cg bob">${SPR.gem}</span>`;board.appendChild(d);}
  const bot=h('div','cbot','🤖');board.appendChild(bot);
  const place=(c,anim)=>{bot.style.transitionDuration=anim?'':'0s';bot.style.left=(c%n)/n*100+'%';bot.style.top=((c/n)|0)/n*100+'%';};
  const info=h('div','lcap',L.rep?`טִיפּ: לְחִיצָה עַל בְּלוֹק מַגְדִּילָה אוֹתוֹ פִּי 2 אוֹ פִּי 3!`:`הַדֶּרֶךְ הַקְּצָרָה בְּיוֹתֵר: ${L.opt} צְעָדִים`);
  const prow=h('div','prog');const pad=h('div','cpad');
  ['U','L','R','D'].forEach(k=>{const b=h('button','cdir d'+k,DIRS[k][2]);b.setAttribute('aria-label',{U:'למעלה',D:'למטה',L:'שמאלה',R:'ימינה'}[k]);b.onclick=()=>add(k);pad.appendChild(b);});
  const row=h('div','btnrow');const undo=h('button','bigbtn plain sm','↩️ <span>מְחַק</span>');const run=h('button','bigbtn',ICON.play+'<span>הַפְעֵל!</span>');row.append(undo,run);
  s.append(board,info,prow,pad,row);place(L.s);
  function drawP(){prow.innerHTML='';prog.forEach((p,j)=>{const b=h('button','cblk',`${DIRS[p.d][2]}${p.k>1?`<sub>×${p.k}</sub>`:''}`);b.onclick=()=>{if(running)return;if(L.rep){p.k=p.k%3+1;sfx.pop(p.k+1);}else{prog.splice(j,1);sfx.pop(1);}drawP();};prow.appendChild(b);});
    for(let j=prog.length;j<maxB;j++)prow.appendChild(h('i','cslot'));}
  function add(k){if(running||prog.length>=maxB)return;prog.push({d:k,k:1});sfx.key&&sfx.key();drawP();}
  undo.onclick=()=>{if(running)return;prog.pop();drawP();};
  run.onclick=()=>{if(running||!prog.length)return;running=true;run.disabled=true;let c=L.s;place(c);const steps=[];prog.forEach((p,j)=>{for(let k=0;k<p.k;k++)steps.push([p.d,j]);});let i=0;
    const tick=()=>{if($('#sTal').hidden||!board.isConnected)return;prow.querySelectorAll('.cblk').forEach((b,j)=>b.classList.toggle('now',steps[i]&&steps[i][1]===j));
      if(i>=steps.length){fail('הָרוֹבּוֹט לֹא הִגִּיעַ לַיַּהֲלוֹם. נְנַסֶּה שׁוּב?');return;}
      const [dx,dy]=DIRS[steps[i][0]];const x=c%n+dx,y=((c/n)|0)+dy;if(x<0||y<0||x>=n||y>=n||L.w.has(y*n+x)){bot.classList.add('bump');sfx.hit&&sfx.hit();setTimeout(()=>bot.classList.remove('bump'),400);fail('אוּפְּס! הָרוֹבּוֹט נִתְקַע. תַּקְּנוּ אֶת הַקּוֹד.');return;}
      c=y*n+x;place(c,1);sfx.jump?sfx.jump():sfx.pop(2);i++;if(c===L.g){setTimeout(()=>{if(board.isConnected)win();},D(400));return;}setTimeout(tick,D(380));};setTimeout(tick,D(200));};
  function fail(msg){err++;sfx.no();info.innerHTML=msg;setTimeout(()=>{place(L.s);running=false;run.disabled=false;prow.querySelectorAll('.now').forEach(b=>b.classList.remove('now'));},D(900));}
  function win(){const used=prog.length;const st=used<=L.opt?3:used<=L.opt+2?2:1;const cs=C();const prev=cs[li]|0;cs[li]=Math.max(prev,st);
    const doneN=Object.values(cs).filter(v=>v>0).length;const tot=Object.values(cs).reduce((a,v)=>a+(v|0),0);T.record('code-maze',Math.min(3,Math.round(tot/NL)),{b:doneN});
    const g=prev?1:5+st;O.addGems(g);T.result({title:st===3?'קוֹד מֻשְׁלָם!':'הָרוֹבּוֹט הִגִּיעַ!',sub:`הִשְׁתַּמַּשְׁתָּ בְּ-${used} בְּלוֹקִים${st<3?` · אֶפְשָׁר גַּם בְּ-${L.opt}`:''}`,stars:st,gems:g,back:li+1<NL?()=>play(li+1,back):mback,again:()=>play(li,back)});}
  drawP();
  window.__code={L,add,run:()=>run.click(),solve:()=>{prog=solution(L);drawP();run.click();}};}
function solution(L){const {n,w,s,g}=L;const maxRun=L.rep?3:1;const prev=new Map([[s,null]]);const q=[s];while(q.length){const c=q.shift();if(c===g)break;const x=c%n,y=(c/n)|0;
  for(const [d,[dx,dy]] of Object.entries(DIRS))for(let k=1;k<=maxRun;k++){const nx=x+dx*k,ny=y+dy*k;if(nx<0||ny<0||nx>=n||ny>=n||w.has(ny*n+nx))break;const id=ny*n+nx;if(!prev.has(id)){prev.set(id,[c,d,k]);q.push(id);}}}
  const out=[];let c=g;while(prev.get(c)){const [p,d,k]=prev.get(c);out.unshift({d,k});c=p;}return out;}
building({id:'code',name:'מַעְבֶּדֶת הַקּוֹד',color:'#5b8def',bg:'city',icon:()=>'<span style="font-size:34px">🤖</span>',blurb:'מְתַכְנְתִים רוֹבּוֹט צַעַד אַחַר צַעַד.',acts:[
  {id:'code-maze',name:'רוֹבּוֹט הַקּוֹד',icon:()=>'<span style="font-size:34px">🤖</span>',run:menu}]});
T.codeLV=LV;
})();

/* ===== THINKING TOWER ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,rand,pick,shuffle,ICON,SPR}=O;const {X,ALLSPR,building,quiz}=T;const sfx=O.sfx,D=O.D;
const plays=id=>((T.S().tl[id]||{}).n|0);
/* --- sudoku 4x4 --- */
function sudokuGrid(){const base=[[0,1,2,3],[2,3,0,1],[1,0,3,2],[3,2,1,0]];const sym=shuffle([0,1,2,3]);let rows=[...(Math.random()<.5?[0,1,2,3]:[1,0,3,2])];
  if(Math.random()<.5)rows=[rows[2],rows[3],rows[0],rows[1]];const cols=Math.random()<.5?[0,1,2,3]:[1,0,2,3];const g=rows.map(r=>cols.map(c=>sym[base[r][c]]));if(Math.random()<.5)return g[0].map((_,c)=>g.map(r=>r[c]));return g;}
function sudoku(back){const SYM=shuffle(['apple','ball','fish','sun','heart','car','bird','cake']).slice(0,4);const R=3;let r=0,err=0,gems=0;O.setScreen('sTal','mount',back);const s=$('#sTal');
  const run=()=>{T.hudT('סוּדוֹקוּ',T.progressBar(r,R));O.sayNow='בכל שורה, בכל טור ובכל ריבוע: כל תמונה פעם אחת';const sol=sudokuGrid();const holes=Math.min(10,5+r+Math.min(3,plays('think-sudoku')));
    const cells=shuffle([...Array(16).keys()]).slice(0,holes);const cur=sol.flat().map((v,i)=>cells.includes(i)?-1:v);let sel=0,left=holes;
    s.innerHTML='';s.appendChild(h('div','lsent','בְּכָל שׁוּרָה, בְּכָל טוּר וּבְכָל רִבּוּעַ — כָּל תְּמוּנָה פַּעַם אַחַת בִּלְבַד.'));
    const g=h('div','sud');cur.forEach((v,i)=>{const c=h('button','sdc'+(v>=0?' fix':'')+((i%4)===1?' br':'')+(((i/4)|0)===1?' bb':''),v>=0?ALLSPR(SYM[v]):'');
      if(v<0)c.onclick=()=>{if(cur[i]>=0)return;if(sol.flat()[i]===sel){cur[i]=sel;c.innerHTML=ALLSPR(SYM[sel]);c.classList.add('ok');sfx.ok(left);left--;if(!left)solved();}else{err++;tries++;c.classList.add('bad');sfx.no();setTimeout(()=>c.classList.remove('bad'),D(500));}};
      else{c.disabled=true;c.tabIndex=-1;}g.appendChild(c);});
    const pal=h('div','sudp');SYM.forEach((k,j)=>{const b=h('button','sdp'+(j===0?' on':''),ALLSPR(k));b.setAttribute('aria-label','תמונה '+(j+1));b.onclick=()=>{sel=j;pal.querySelectorAll('.sdp').forEach((x,q)=>x.classList.toggle('on',q===j));sfx.pop(2);};pal.appendChild(b);});
    s.append(g,pal);let tries=0;
    T.setKey(e=>{const n=+e.key;if(n>=1&&n<=4)pal.children[n-1].click();});
    function solved(){const gg=tries?1:3;gems+=gg;O.addGems(gg);g.classList.add('done');setTimeout(()=>{if(!g.isConnected)return;r++;if(r>=R){T.setKey(null);T.finishAct('think-sudoku',Math.floor(err/2),R*3,gems,back,()=>sudoku(back));}else run();},D(1000));}
    window.__sud={solve:()=>{cur.forEach((v,i)=>{if(v<0){sel=sol.flat()[i];g.children[i].click();}});}};};
  run();}
/* --- maze --- */
function genMaze(n){const W=Array.from({length:n*n},()=>[1,1,1,1]);const vis=new Set([0]);const st=[0];const D4=[[0,-1,0,2],[1,0,1,3],[0,1,2,0],[-1,0,3,1]];
  while(st.length){const c=st[st.length-1],x=c%n,y=(c/n)|0;const nb=shuffle(D4).filter(([dx,dy])=>{const nx=x+dx,ny=y+dy;return nx>=0&&ny>=0&&nx<n&&ny<n&&!vis.has(ny*n+nx);});
    if(!nb.length){st.pop();continue;}const [dx,dy,a,b]=nb[0];const id=(y+dy)*n+x+dx;W[c][a]=0;W[id][b]=0;vis.add(id);st.push(id);}return W;}
function maze(back){const n=[5,6,7,8][Math.min(3,plays('think-maze'))];const W=genMaze(n);let p=0,moves=0;const goal=n*n-1;O.setScreen('sTal','forest',back);T.hudT('מָבוֹךְ');O.sayNow='עזרו לחתול להגיע לעוגה';
  const s=$('#sTal');s.innerHTML='';const wrap=h('div','mzw');const sz=100/n;
  let svg=`<svg viewBox="0 0 ${n*10} ${n*10}" class="mz" aria-hidden="true"><rect width="${n*10}" height="${n*10}" fill="#eaf6e1"/>`;
  W.forEach((w,c)=>{const x=(c%n)*10,y=((c/n)|0)*10;if(w[0])svg+=`<line x1="${x}" y1="${y}" x2="${x+10}" y2="${y}"/>`;if(w[1])svg+=`<line x1="${x+10}" y1="${y}" x2="${x+10}" y2="${y+10}"/>`;if(w[2])svg+=`<line x1="${x}" y1="${y+10}" x2="${x+10}" y2="${y+10}"/>`;if(w[3])svg+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+10}"/>`;});
  svg+='</svg>';wrap.innerHTML=svg+`<span class="mzg" style="left:${(n-1)*sz}%;top:${(n-1)*sz}%;width:${sz}%;height:${sz}%">${ALLSPR('cake')}</span><span class="mzp" style="width:${sz}%;height:${sz}%">${SPR.cat||'🐱'}</span>`;
  const trail=h('div','mzt');wrap.appendChild(trail);const pl=wrap.querySelector('.mzp');
  const pos=()=>{pl.style.left=(p%n)*sz+'%';pl.style.top=((p/n)|0)*sz+'%';};pos();
  const mv=(dir)=>{const D4={U:[0,-1,0],R:[1,0,1],D:[0,1,2],L:[-1,0,3]}[dir];if(W[p][D4[2]]){sfx.hit&&sfx.hit();pl.classList.add('bump');setTimeout(()=>pl.classList.remove('bump'),250);return;}
    const dot=h('i','');dot.style.cssText=`left:${(p%n+.5)*sz}%;top:${(((p/n)|0)+.5)*sz}%`;trail.appendChild(dot);p+=D4[0]+D4[1]*n;moves++;pos();sfx.key&&sfx.key();if(p===goal)win();};
  const pad=h('div','cpad');['U','L','R','D'].forEach(k=>{const b=h('button','cdir d'+k,{U:'⬆',D:'⬇',L:'⬅',R:'➡'}[k]);b.onclick=()=>mv(k);pad.appendChild(b);});
  wrap.onclick=e=>{const r=wrap.getBoundingClientRect();const x=Math.floor((e.clientX-r.left)/r.width*n),y=Math.floor((e.clientY-r.top)/r.height*n);const px=p%n,py=(p/n)|0;
    if(x===px&&y===py-1)mv('U');else if(x===px&&y===py+1)mv('D');else if(y===py&&x===px+1)mv('R');else if(y===py&&x===px-1)mv('L');};
  s.append(h('div','lsent','עִזְרוּ לֶחָתוּל לְהַגִּיעַ לָעוּגָה! (אֶפְשָׁר גַּם עִם הַחִצִּים בַּמִּקְלֶדֶת)'),wrap,pad);
  T.setKey(e=>{const k={ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R'}[e.key];if(k){e.preventDefault();mv(k);}});
  let done=false;function win(){if(done)return;done=true;T.setKey(null);sfx.build&&sfx.build();setTimeout(()=>wrap.isConnected&&T.finishAct('think-maze',0,1,3,back,()=>maze(back),'יָצָאתָ מֵהַמָּבוֹךְ!'),D(600));}
  window.__maze={solve:()=>{const prev=new Map([[0,null]]);const q=[0];const DD=[['U',0,-1,0],['R',1,0,1],['D',0,1,2],['L',-1,0,3]];while(q.length){const c=q.shift();for(const [d,dx,dy,wi] of DD){if(W[c][wi])continue;const id=c+dx+dy*n;if(!prev.has(id)){prev.set(id,[c,d]);q.push(id);}}}
    const path=[];let c=goal;while(prev.get(c)){path.unshift(prev.get(c)[1]);c=prev.get(c)[0];}path.forEach(mv);},n};}
/* --- memory --- */
function memory(back){const lv=Math.min(2,plays('think-mem'));const pairs=[4,6,8][lv];const pool=shuffle(['apple','ball','fish','sun','heart','car','bird','cake','boat','hat','key','cup','egg','shoe']).slice(0,pairs);
  const deck=shuffle([...pool,...pool]);let open=[],moves=0,found=0,lock=false;O.setScreen('sTal','city',back);T.hudT('זִכָּרוֹן');O.sayNow='מצאו זוגות';const s=$('#sTal');s.innerHTML='';
  const info=h('div','lcap','מִצְאוּ אֶת כָּל הַזּוּגוֹת');const g=h('div','memg c'+(pairs>6?4:pairs>4?4:4));
  deck.forEach((k,i)=>{const c=h('button','mc',`<span class="fr">${ALLSPR(k)}</span><span class="bk2">?</span>`);c.dataset.k=k;c.setAttribute('aria-label','קלף '+(i+1));
    c.onclick=()=>{if(lock||c.classList.contains('flip'))return;c.classList.add('flip');sfx.pop(2);open.push(c);if(open.length===2){moves++;lock=true;const [a,b]=open;
      if(a.dataset.k===b.dataset.k){setTimeout(()=>{a.classList.add('got');b.classList.add('got');sfx.ok(found);found++;open=[];lock=false;info.textContent=`מָצָאתָ ${found} מִתּוֹךְ ${pairs}`;if(found===pairs)win();},D(350));}
      else setTimeout(()=>{a.classList.remove('flip');b.classList.remove('flip');open=[];lock=false;},D(900));}};g.appendChild(c);});
  s.append(info,g);
  function win(){const extra=moves-pairs;const err=extra<=pairs*.5?0:extra<=pairs?2:5;setTimeout(()=>g.isConnected&&T.finishAct('think-mem',err,10,2,back,()=>memory(back),`מָצָאתָ הַכֹּל בְּ-${moves} נִסְיוֹנוֹת!`),D(600));}
  window.__mem={solve:()=>{const by={};[...g.children].forEach(c=>(by[c.dataset.k]=by[c.dataset.k]||[]).push(c));let t=0;Object.values(by).forEach(([a,b])=>{setTimeout(()=>{a.click();b.click();},t);t+=D(500);});}};}
/* --- patterns --- */
const PS=['apple','ball','fish','sun','heart','car','bird','cake','boat','star'];
function patGen(i){const lv=Math.min(3,Math.floor(i/2));const kinds=[['AB','AAB','ABB'],['ABC','AABB','ABB'],['ABCD','AABC','num'],['num','num2','ABAC']][lv];const k=pick(kinds);
  if(k==='num'||k==='num2'){const st=rand(1,k==='num'?5:10),d=k==='num'?pick([2,3,5,10]):pick([2,3,4,5]);const sq=Array.from({length:5},(_,j)=>st+d*j);const a=sq[4];const opts=shuffle([a,a+d,a-1].filter((v,j,arr)=>arr.indexOf(v)===j));
    return {pr:`<div class="pat num">${sq.slice(0,4).map(v=>`<b>${v}</b>`).join('')}<b class="q">?</b></div><div class="qq">אֵיזֶה מִסְפָּר בָּא אַחַר כָּךְ?</div>`,opts:opts.map(String),ans:opts.indexOf(a),cls:'num',key:sq.join(),explain:`כָּל פַּעַם מוֹסִיפִים ${d}`};}
  const syms=shuffle(PS).slice(0,4);const unit=[...k].map(c=>syms[c.charCodeAt(0)-65]);const len=unit.length*2+(unit.length<3?2:1);const seq=Array.from({length:len+1},(_,j)=>unit[j%unit.length]);const a=seq[len];
  const opts=shuffle([...new Set([a,...syms.slice(0,unit.length<3?3:4)])]).slice(0,3);if(!opts.includes(a))opts[0]=a;const o2=shuffle(opts);
  return {pr:`<div class="pat">${seq.slice(0,len).map(x=>`<span>${ALLSPR(x)}</span>`).join('')}<span class="q">?</span></div><div class="qq">מָה בָּא אַחַר כָּךְ?</div>`,opts:o2.map(x=>`<span class="pic sm">${ALLSPR(x)}</span>`),ans:o2.indexOf(a),cls:'pc',key:seq.join()};}
building({id:'think',name:'מִגְדַּל הַחֲשִׁיבָה',color:'#e8a33d',bg:'mount',icon:()=>X.puzzle,blurb:'חִידוֹת שֶׁמְּאַמְּנוֹת אֶת הַמֹּחַ.',acts:[
  {id:'think-sudoku',name:'סוּדוֹקוּ',icon:()=>X.puzzle,run:sudoku},
  {id:'think-maze',name:'מָבוֹךְ',icon:()=>'<span style="font-size:34px">🌀</span>',run:maze},
  {id:'think-mem',name:'זִכָּרוֹן',icon:()=>'<span style="font-size:34px">🃏</span>',run:memory},
  {id:'think-pat',name:'מָה בָּא אַחַר כָּךְ?',icon:()=>'<span style="font-size:34px">🔁</span>',run:back=>quiz({id:'think-pat',title:'מָה בָּא אַחַר כָּךְ?',bg:'mount',back,n:8,gen:patGen})}]});
})();

/* ===== WRITING HOUSE ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,shuffle,ICON,SPR}=O;const {X,ALLSPR,building}=T;const sfx=O.sfx,D=O.D;
const AB=[['א','אָלֶף'],['ב','בֵּית'],['ג','גִּימֶל'],['ד','דָּלֶת'],['ה','הֵא'],['ו','וָו'],['ז','זַיִן'],['ח','חֵית'],['ט','טֵית'],['י','יוֹד'],['כ','כַּף'],['ל','לָמֶד'],['מ','מֵם'],['נ','נוּן'],['ס','סָמֶךְ'],['ע','עַיִן'],['פ','פֵּא'],['צ','צָדִי'],['ק','קוֹף'],['ר','רֵישׁ'],['ש','שִׁין'],['ת','תָּו']];
const W=()=>{const s=T.S();s.wr=s.wr||{};return s.wr;};
const wordFor=l=>(T.WORDS||[]).find(w=>w.w.replace(/[֑-ׇ]/g,'')[0]===l);
const FONT='bold 230px "Segoe UI", Arial, "Noto Sans Hebrew", sans-serif';
function menu(back){O.setScreen('sTal','meadow',back);T.hudT('בֵּית הַכְּתִיבָה');O.sayNow='בחרו אות לכתוב';const s=$('#sTal');s.innerHTML='';
  s.appendChild(h('div','whead',`<span class="gd">${X.pen}</span><h1>כּוֹתְבִים אוֹתִיּוֹת</h1>`));s.appendChild(h('div','lsent','עוֹבְרִים עִם הָאֶצְבַּע אוֹ הָעַכְבָּר עַל הָאוֹת הָאֲפֹרָה.'));
  const g=h('div','abg');const w=W();AB.forEach(([l],i)=>{const st=w[l]|0;const b=h('button','abb'+(st?' got':''),`<b>${l}</b><span>${[0,1,2].map(k=>k<st?SPR.star:SPR.starOff).join('')}</span>`);b.onclick=()=>trace(i,back,[i,...[1,2,3].map(k=>(i+k)%AB.length)]);g.appendChild(b);});
  s.appendChild(g);const nx=AB.findIndex(([l])=>!(w[l]|0));const row=h('div','btnrow');const go=h('button','bigbtn',ICON.play+'<span>4 אוֹתִיּוֹת לְתִרְגּוּל</span>');const st=nx<0?Math.floor(Math.random()*AB.length):nx;
  go.onclick=()=>trace(st,back,[0,1,2,3].map(k=>(st+k)%AB.length));row.appendChild(go);s.appendChild(row);}
function trace(i0,back,queue){let qi=0,err=0,gems=0;const mback=()=>menu(back);O.setScreen('sTal','meadow',mback);const s=$('#sTal');
  const run=()=>{const [l,name]=AB[queue[qi]];T.hudT('כּוֹתְבִים: '+l,T.progressBar(qi,queue.length));O.sayNow='האות '+T.plainHe(name);s.innerHTML='';let tries=0;
    const wd=wordFor(l);s.appendChild(h('div','wrhead',`<span class="wrl">${l}</span><span class="wrn">${name}</span>${wd?`<span class="wrw"><span class="pic sm">${ALLSPR(wd.spr)}</span><b>${wd.w}</b></span>`:''}`));
    const box=h('div','wrbox');const cv=document.createElement('canvas');cv.className='wrc';box.appendChild(cv);s.appendChild(box);
    const row=h('div','btnrow');const clr=h('button','bigbtn plain sm','🧽 <span>מְחַק</span>');const ok=h('button','bigbtn',SPR.star+'<span>סִיַּמְתִּי</span>');row.append(clr,ok);s.appendChild(row);
    const fb=h('div','lcap','');s.appendChild(fb);
    const R=300,dpr=Math.min(2,window.devicePixelRatio||1);cv.width=R*dpr;cv.height=R*dpr;const c=cv.getContext('2d');c.scale(dpr,dpr);
    const G=document.createElement('canvas');G.width=G.height=100;const gc=G.getContext('2d');gc.scale(1/3,1/3);gc.font=FONT;gc.textAlign='center';gc.textBaseline='middle';gc.fillStyle='#000';gc.fillText(l,150,160);
    const gd=gc.getImageData(0,0,100,100).data;const guide=[];for(let k=0;k<1e4;k++)guide[k]=gd[k*4+3]>100;const gN=guide.filter(Boolean).length||1;
    const near=new Uint8Array(1e4);for(let k=0;k<1e4;k++)if(guide[k]){const x=k%100,y=(k/100)|0;for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<100&&yy<100)near[yy*100+xx]=1;}}
    const ink=new Uint8Array(1e4);let inkN=0;
    const bg=()=>{c.clearRect(0,0,R,R);c.fillStyle='#fffaf0';c.fillRect(0,0,R,R);c.strokeStyle='#e3d6b8';c.lineWidth=2;c.setLineDash([8,8]);c.beginPath();c.moveTo(0,R*.25);c.lineTo(R,R*.25);c.moveTo(0,R*.82);c.lineTo(R,R*.82);c.stroke();c.setLineDash([]);
      c.font=FONT;c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(120,130,140,.28)';c.fillText(l,150,160);};
    bg();let down=false,last=null;
    const pt=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*R,(e.clientY-r.top)/r.height*R];};
    const mark=(x,y)=>{const gx=Math.round(x/3),gy=Math.round(y/3);for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){if(dx*dx+dy*dy>16)continue;const xx=gx+dx,yy=gy+dy;if(xx>=0&&yy>=0&&xx<100&&yy<100){const k=yy*100+xx;if(!ink[k]){ink[k]=1;inkN++;}}}};
    const seg=(a,b)=>{c.strokeStyle='#3a8fc4';c.lineWidth=22;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4));for(let k=0;k<=n;k++)mark(a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n);};
    cv.onpointerdown=e=>{e.preventDefault();down=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}last=pt(e);seg(last,last);};
    cv.onpointermove=e=>{if(!down)return;const p=pt(e);seg(last,p);last=p;};cv.onpointerup=cv.onpointercancel=()=>{down=false;};
    const score=()=>{let cov=0,out=0;for(let k=0;k<1e4;k++){if(guide[k]&&ink[k])cov++;if(ink[k]&&!near[k])out++;}return {cov:cov/gN,out:inkN?out/inkN:1};};
    clr.onclick=()=>{ink.fill(0);inkN=0;bg();sfx.pop(1);fb.textContent='';};
    ok.onclick=()=>{const {cov,out}=score();if(cov>=.62&&out<=.3){const st=tries===0&&cov>.75?3:tries<=1?2:1;const w=W();w[l]=Math.max(w[l]|0,st);T.S().wrT=Date.now();const g=tries?1:3;gems+=g;O.addGems(g,ok);sfx.ok(qi);
        box.classList.add('done');O.say&&O.say(name);fb.innerHTML='מְצֻיָּן! ✨';setTimeout(()=>{if(!box.isConnected)return;qi++;if(qi>=queue.length){T.finishAct('write-trace',err,queue.length*2,gems,mback,()=>trace(i0,back,queue));}else run();},D(1100));}
      else{tries++;err++;sfx.no();if(out>.3)clr.click();fb.innerHTML=cov<.62&&out<=.3?'עוֹד קְצָת! עִבְרוּ עַל כָּל הָאוֹת.':'יָצָאתָ מִחוּץ לָאוֹת. נְנַסֶּה שׁוּב?';}};
    window.__wr={fill:()=>{for(let k=0;k<1e4;k++)if(guide[k]){ink[k]=1;}inkN=ink.reduce((a,v)=>a+v,0);},score,ok:()=>ok.click(),scribble:()=>{for(let k=0;k<1e4;k+=3)ink[k]=1;inkN=ink.reduce((a,v)=>a+v,0);}};};
  run();}
building({id:'write',name:'בֵּית הַכְּתִיבָה',color:'#c27c4e',bg:'meadow',icon:()=>X.pen,blurb:'לוֹמְדִים לִכְתֹּב אֶת כָּל הָאוֹתִיּוֹת.',acts:[
  {id:'write-trace',name:'כּוֹתְבִים אוֹתִיּוֹת',icon:()=>X.pen,run:menu}]});
})();

/* ===== PARENT PANEL ===== */
(()=>{'use strict';const O=window.OREN,T=window.TAL;if(!O||!T)return;const {h,$,ICON,SPR}=O;const {FACES,BUILD}=T;const sfx=O.sfx;
const BAR=(v,max,col)=>`<span class="pbar"><i style="width:${max?Math.min(100,v/max*100):0}%;background:${col||'#4fae4f'}"></i></span>`;
function gate(){const ov=$('#ov');ov.hidden=false;ov.innerHTML=`<div class="card"><h2>כְּנִיסָה לַהוֹרִים</h2><div class="sub">כַּמָּה זֶה 12 × 13?</div><input id="pgIn" class="pgin" inputmode="numeric" autocomplete="off" aria-label="תשובה"><div class="pgerr" id="pgErr"></div></div>`;
  const row=h('div','btnrow');const no=h('button','bigbtn plain sm','<span>בִּטּוּל</span>');no.onclick=()=>{ov.hidden=true;};const ok=h('button','bigbtn','<span>כְּנִיסָה</span>');row.append(no,ok);ov.firstChild.appendChild(row);
  const inp=$('#pgIn');setTimeout(()=>inp.focus(),50);const go=()=>{if(inp.value.trim()==='156'){ov.hidden=true;panel();}else{$('#pgErr').textContent='לֹא נָכוֹן';inp.value='';sfx.no();}};ok.onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go();};}
window.TAL_parentGate=gate;
const fmtMin=sec=>{const m=Math.round(sec/60);return m<60?m+' דק׳':(m/60).toFixed(1)+' שע׳';};
function lastDays(n){const out=[];const d=new Date();for(let i=n-1;i>=0;i--){const x=new Date(d);x.setDate(d.getDate()-i);const k=x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');out.push([k,x]);}return out;}
function panel(){const s0=T.S(),sv=O.save;O.setScreen('sPar','valley',O.showMap);O.hud('<div class="chip">לוּחַ הוֹרִים</div>');const s=$('#sPar');s.innerHTML='';
  const sec=(t,html)=>{const d=h('section','psec',`<h3>${t}</h3>`);if(html)d.insertAdjacentHTML('beforeend',html);s.appendChild(d);return d;};
  s.appendChild(h('div','whead',`<h1>לוּחַ הוֹרִים</h1>`));
  const acc=sv.ans?Math.round((sv.ok|0)/sv.ans*100):0;const totT=Object.values(s0.time).reduce((a,v)=>a+(v|0),0);const talSt=Object.values(s0.tl).reduce((a,c)=>a+(c.s|0),0);
  sec('סִכּוּם',`<div class="ptiles">
    <div><b>${(sv.days||[]).length}</b><span>יְמֵי מִשְׂחָק</span></div><div><b>${O.dayStreak()}</b><span>רֶצֶף יָמִים</span></div>
    <div><b>${acc}%</b><span>דִּיּוּק בְּחֶשְׁבּוֹן (${sv.ans|0} שְׁאֵלוֹת)</span></div><div><b>${O.totalStars()}</b><span>כּוֹכָבִים בַּמַּסָּע</span></div>
    <div><b>${O.masteredCount()}/100</b><span>עֻבְדּוֹת בְּלוּחַ הַכֶּפֶל</span></div><div><b>${fmtMin(totT)}</b><span>זְמַן כּוֹלֵל</span></div>
    <div><b>${talSt}</b><span>כּוֹכָבִים בְּעִיר הַכִּשְׁרוֹנוֹת</span></div><div><b>${sv.gems|0}</b><span>יַהֲלוֹמִים</span></div></div>`);
  const days=lastDays(14);const mx=Math.max(600,...days.map(([k])=>s0.time[k]|0));
  sec('זְמַן מִשְׂחָק — 14 יָמִים אַחֲרוֹנִים',`<div class="pchart">${days.map(([k,x])=>{const v=s0.time[k]|0;return `<div class="pcol" title="${k}: ${fmtMin(v)}"><span class="pv">${v?Math.round(v/60):''}</span><i style="height:${v/mx*100}%"></i><small>${'אבגדהוש'[x.getDay()]}</small></div>`;}).join('')}</div><div class="pnote">בְּדַקּוֹת. נִסְפָּר רַק זְמַן פָּעִיל (בְּלִי חַלּוֹן בָּרֶקַע).</div>`);
  sec('הִתְקַדְּמוּת בְּעוֹלָמוֹת הַמַּסָּע',O.WORLDS.map(w=>{const got=w.levels.reduce((a,l)=>a+O.stars(l.id),0),max=w.levels.length*3;return `<div class="prow"><span class="pn">${w.name}</span>${BAR(got,max,w.color)}<span class="pc">${got}/${max}</span></div>`;}).join(''));
  const st=sv.st||{};const units=O.ALLU.filter(u=>!u.boss&&st[u.id]&&st[u.id].a>=4).map(u=>({u,a:st[u.id].a,r:st[u.id].o/st[u.id].a}));
  const weak=[...units].sort((a,b)=>a.r-b.r).slice(0,5),strong=[...units].sort((a,b)=>b.r-a.r).slice(0,3);
  sec('נוֹשְׂאִים בְּחֶשְׁבּוֹן',units.length?`<div class="psub">צָרִיךְ עוֹד תִּרְגּוּל:</div>${weak.map(x=>`<div class="prow"><span class="pn">${x.u.name} <small>(${x.u.w.name})</small></span>${BAR(x.r,1,x.r<.6?'#e4572e':x.r<.8?'#e9b949':'#4fae4f')}<span class="pc">${Math.round(x.r*100)}%</span></div>`).join('')}
    <div class="psub">הֲכִי חָזָק:</div>${strong.map(x=>`<div class="prow"><span class="pn">${x.u.name}</span>${BAR(x.r,1)}<span class="pc">${Math.round(x.r*100)}%</span></div>`).join('')}<div class="pnote">אֲחוּז = תְּשׁוּבוֹת נְכוֹנוֹת בְּנִסָּיוֹן רִאשׁוֹן וּבְלִי רֶמֶז (לֹא כּוֹלֵל אִמּוּן וּמְהִירוּת).</div>`:'<div class="pnote">עוֹד אֵין מַסְפִּיק נְתוּנִים. יוֹפִיעַ אַחֲרֵי כַּמָּה שְׁלַבִּים.</div>');
  sec('עִיר הַכִּשְׁרוֹנוֹת',BUILD.map(b=>{const got=b.acts.reduce((a,x)=>a+((s0.tl[x.id]||{}).s|0),0),max=b.acts.length*3,plays=b.acts.reduce((a,x)=>a+((s0.tl[x.id]||{}).n|0),0);return `<div class="prow"><span class="pn">${b.name}</span>${BAR(got,max,b.color)}<span class="pc">${got}/${max} · ${plays} פְּעָמִים</span></div>`;}).join('')+
    `<div class="pnote">הַקְלָדָה: ${s0.typ.wpm|0} מִלִּים בְּדַקָּה · דִּיּוּק אַחֲרוֹן ${s0.typ.acc!=null?s0.typ.acc+'%':'—'} · ${Object.keys(s0.typ.best).length}/13 שִׁעוּרִים<br>כְּתִיבָה: ${Object.keys(s0.wr||{}).length}/22 אוֹתִיּוֹת · קוֹד: ${Object.values(s0.code||{}).filter(v=>v>0).length}/15 שְׁלַבִּים · צִיּוּרִים: ${s0.art.length}</div>`);
  const md=s0.mood.slice(-14);const jarN=s0.jar.reduce((a,j)=>a+(j.i?j.i.length:0),0);
  sec('רְגָשׁוֹת וְתוֹדָה',`${md.length?`<div class="pmood">${md.map(m=>FACES[m.f]?`<span title="${m.d}">${FACES[m.f].s}<small>${m.d.slice(5).replace('-','/')}</small></span>`:'').join('')}</div>`:'<div class="pnote">עוֹד לֹא נִרְשְׁמוּ רְגָשׁוֹת.</div>'}<div class="pnote">בְּצִנְצֶנֶת הַתּוֹדָה: ${jarN} דְּבָרִים טוֹבִים.</div>`);
  /* settings */
  const set=sec('הַגְדָּרוֹת');
  const brk=h('div','popt','<span>תִּזְכֹּרֶת הַפְסָקָה:</span>');[[0,'כָּבוּי'],[15,'15 דק׳'],[25,'25 דק׳'],[40,'40 דק׳']].forEach(([v,n])=>{const b=h('button','pchip'+((s0.set.brk|0)===v?' on':''),n);b.onclick=()=>{s0.set.brk=v;O.persist();panel();};brk.appendChild(b);});set.appendChild(brk);
  const hd=h('div','popt','<span>בִּנְיָנִים בָּעִיר:</span>');BUILD.forEach(b=>{const on=!s0.set.hide[b.id];const c=h('button','pchip'+(on?' on':''),(on?'✓ ':'')+b.name);c.onclick=()=>{if(on)s0.set.hide[b.id]=1;else delete s0.set.hide[b.id];O.persist();panel();};hd.appendChild(c);});set.appendChild(hd);
  const al=h('div','popt','<span>פְּתִיחַת כָּל הַשְּׁלַבִּים:</span>');const ab=h('button','pchip'+(s0.set.all?' on':''),s0.set.all?'✓ פָּתוּחַ':'כָּבוּי');ab.onclick=()=>{s0.set.all=!s0.set.all;O.persist();panel();};al.appendChild(ab);set.appendChild(al);
  /* backup */
  const bk=sec('גִּבּוּי','<div class="pnote">הַהִתְקַדְּמוּת נִשְׁמֶרֶת אוֹטוֹמָטִית בֶּעָנָן. אֶפְשָׁר גַּם לְהַעְתִּיק גִּבּוּי יָדָנִי, וּלְהַדְבִּיק אוֹתוֹ בְּמַחְשֵׁב אַחֵר.</div>');
  const ta=h('textarea','pta');ta.setAttribute('aria-label','גיבוי');ta.rows=3;const r=h('div','btnrow');
  const ex=h('button','bigbtn plain sm','<span>הַצֵּג גִּבּוּי</span>');ex.onclick=()=>{ta.value=JSON.stringify(O.save);ta.select();try{navigator.clipboard&&navigator.clipboard.writeText(ta.value).then(()=>O.floatText(ex,'הוּעְתַּק!'),()=>{});}catch(e){}};
  const im=h('button','bigbtn sm','<span>שַׁחְזֵר מִגִּבּוּי</span>');im.onclick=()=>{try{const o=JSON.parse(ta.value);if(!o||typeof o!=='object'||!o.v)throw 0;const t=o.t;o.t=Date.now()+1;O.mergeIn(o);O.persist();O.floatText(im,'שֻׁחְזַר!');sfx.win();setTimeout(panel,600);}catch(e){O.floatText(im,'גִּבּוּי לֹא תָּקִין');sfx.no();}};
  r.append(ex,im);bk.append(ta,r);
  const out=h('div','btnrow');const bb=h('button','bigbtn',ICON.home+'<span>חֲזָרָה לַמַּפָּה</span>');bb.onclick=O.showMap;out.appendChild(bb);s.appendChild(out);
  window.__par=true;}
T.parentPanel=panel;
})();
