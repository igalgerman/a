#!/usr/bin/env python3
"""Inject talents.css + talents.js into index.html between the TALENTS markers."""
import pathlib,re
d=pathlib.Path(__file__).parent
idx=(d/'index.html').read_text(encoding='utf-8')
css=(d/'talents.css').read_text(encoding='utf-8')
js=(d/'talents.js').read_text(encoding='utf-8')
for extra in ['arcade','reading']:
    if (d/(extra+'.css')).exists(): css+='\n'+(d/(extra+'.css')).read_text(encoding='utf-8')
    if (d/(extra+'.js')).exists(): js+='\n'+(d/(extra+'.js')).read_text(encoding='utf-8')
assert '</script' not in js and '</style' not in css
a,b='<!--TALENTS-->','<!--/TALENTS-->'
i,j=idx.index(a),idx.index(b)
idx=idx[:i+len(a)]+'\n<style>\n'+css+'</style>\n<script>\n'+js+'\n</script>\n'+idx[j:]
(d/'index.html').write_text(idx,encoding='utf-8')
print('injected',len(css),len(js))

# standalone website copy for Cloudflare Pages (cf/public)
head=('<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">'
 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 '<title>הַמַּסָּע שֶׁל אוֹרֶן</title><meta name="theme-color" content="#6aa84f">'
 '<link rel="manifest" href="/manifest.webmanifest"><link rel="icon" href="/icon-192.png">'
 '<link rel="apple-touch-icon" href="/icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes">'
 '</head><body>')
pub=d/'cf'/'public'
if pub.is_dir():
    (pub/'index.html').write_text(head+idx+'</body></html>',encoding='utf-8')
    print('website copy written')
