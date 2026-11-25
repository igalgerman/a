/* Preloaded by tests/run.sh (NODE_OPTIONS=--require): every Chromium the tests launch is muted. */
try{const pw=require(require.resolve('playwright',{paths:[process.cwd(),__dirname]}));const c=pw.chromium,orig=c.launch.bind(c);
  c.launch=(o={})=>orig({...o,args:[...(o.args||[]),'--mute-audio']});}catch(e){}
