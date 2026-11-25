#!/usr/bin/env python3
"""Inject talents.css + talents.js into index.html between the TALENTS markers."""
import pathlib,re
d=pathlib.Path(__file__).parent
idx=(d/'index.html').read_text(encoding='utf-8')
css=(d/'talents.css').read_text(encoding='utf-8')
js=(d/'talents.js').read_text(encoding='utf-8')
assert '</script' not in js and '</style' not in css
a,b='<!--TALENTS-->','<!--/TALENTS-->'
i,j=idx.index(a),idx.index(b)
idx=idx[:i+len(a)]+'\n<style>\n'+css+'</style>\n<script>\n'+js+'\n</script>\n'+idx[j:]
(d/'index.html').write_text(idx,encoding='utf-8')
print('injected',len(css),len(js))
