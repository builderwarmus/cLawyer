#!/usr/bin/env python3
"""Generate the self-contained artifact (body-only + inlined image data-URIs)
from index.html, for the claude.ai live preview. Deployed site uses the real
files under images/ instead."""
import re, base64, glob, os, json, sys
BASE = os.path.dirname(os.path.abspath(__file__))
html = open(os.path.join(BASE, 'index.html')).read()
style = re.search(r'<style>.*?</style>', html, re.S).group(0)
body  = re.search(r'<body>(.*)</body>', html, re.S).group(1)
imgs = {}
for path in sorted(glob.glob(os.path.join(BASE, 'images', '*.jpg'))):
    name = os.path.basename(path)
    with open(path, 'rb') as fh:
        imgs[name] = 'data:image/jpeg;base64,' + base64.b64encode(fh.read()).decode()
data_script = '<script>window.__OASIS_IMG__=' + json.dumps(imgs) + ';</script>\n'
out = data_script + style + '\n' + body
dst = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE, 'artifact.html')
open(dst, 'w').write(out)
print(f'wrote {dst}  ({len(out)//1024} KB, {len(imgs)} images)')
