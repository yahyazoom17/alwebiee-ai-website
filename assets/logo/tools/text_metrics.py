#!/usr/bin/env python3
"""Measure text metrics for a wordmark so a lockup SVG can be sized exactly.

Usage: python3 tools/text_metrics.py FONT.ttf "Alwebiee" 104
Prints advance width, ink bbox, cap height and ascender/descender for that size.
"""
import sys
from PIL import ImageFont

font_path, text = sys.argv[1], sys.argv[2]
size = int(sys.argv[3]) if len(sys.argv) > 3 else 100
f = ImageFont.truetype(font_path, size)
adv = f.getlength(text)
bbox = f.getbbox(text)  # ink box: (l, t, r, b) with t measured from the ascender line
a, d = f.getmetrics()
print(f"font      {font_path}")
print(f"size      {size}")
print(f"advance   {adv:.2f}")
print(f"ink bbox  {bbox}  ink w {bbox[2]-bbox[0]} h {bbox[3]-bbox[1]}")
print(f"ascender  {a}  descender {d}  units/em {f.size}")
try:
    print(f"capheight {f.getbbox('H')}")
    print(f"xheight   {f.getbbox('x')}")
except Exception as e:
    print("cap/x metrics unavailable:", e)
