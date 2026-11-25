/* Mutes every browser the tests launch: Chromium audio (--mute-audio) AND the browser voice
   (speechSynthesis on Windows plays through the OS, not Chromium, so --mute-audio alone is not enough).
   Loaded by tests/lib.js and by run.sh (NODE_OPTIONS), so any script that uses either is silent. Idempotent. */
try{const pw=require(require.resolve('playwright',{paths:[process.cwd(),__dirname]}));const c=pw.chromium;
if(!c.__muted){c.__muted=1;const orig=c.launch.bind(c);
  const SILENT=()=>{try{const s=window.speechSynthesis;if(s&&!s.__muted){s.__muted=1;const sp=s.speak.bind(s);s.speak=u=>{try{u.volume=0;}catch(e){}return sp(u);};}
    const P=HTMLMediaElement.prototype,pl=P.play;P.play=function(){this.muted=true;this.volume=0;return pl.apply(this,arguments);};}catch(e){}};
  c.launch=async(o={})=>{const b=await orig({...o,args:[...(o.args||[]),'--mute-audio']});
    const nc=b.newContext.bind(b),np=b.newPage.bind(b);
    b.newContext=async(...a)=>{const x=await nc(...a);await x.addInitScript(SILENT);return x;};
    b.newPage=async(...a)=>{const p=await np(...a);await p.addInitScript(SILENT);return p;};return b;};}}catch(e){}
