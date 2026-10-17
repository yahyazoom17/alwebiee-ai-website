#!/usr/bin/env python3
"""Build a square tile (icon / social avatar) from a symbol SVG.

Centres the symbol's *ink* on a square canvas with a chosen ink height (default
160 units of a 256 canvas, i.e. ~18.75 % margin on each side — inside the safe
zone for circular avatar crops), optional full-bleed background colour, and a
recoloured ink.

Usage: python3 tools/make_tile.py SYMBOL.svg OUT.svg \
           --canvas 256 --ink-height 160 --ink "#ffffff" --bg "#0F7A4F"
"""
import argparse
import importlib.util
import os
import re


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("symbol")
    ap.add_argument("out")
    ap.add_argument("--canvas", type=float, default=256.0)
    ap.add_argument("--ink-height", type=float, default=160.0)
    ap.add_argument("--ink", default="#111")
    ap.add_argument("--bg", default=None)
    ap.add_argument("--corner", type=float, default=0.0,
                    help="corner radius of the background tile (0 = square)")
    ap.add_argument("--title", default="Alwebiee")
    a = ap.parse_args()

    src = open(a.symbol, encoding="utf-8").read()
    inner = re.sub(r"^.*?<svg[^>]*>", "", src, flags=re.S)
    inner = re.sub(r"</svg>\s*$", "", inner, flags=re.S)
    inner = inner.replace('#111', a.ink)

    skill = os.path.normpath(os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..", "..", ".opencode", "skills", "logo-design", "scripts", "svg_audit.py"))
    spec = importlib.util.spec_from_file_location("svg_audit", skill)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mg = mod.audit(a.symbol)["margins"]
    x0, y0 = mg["left"], mg["top"]
    x1, y1 = 256.0 - mg["right"], 256.0 - mg["bottom"]
    w, h = x1 - x0, y1 - y0
    s = a.ink_height / h
    c = a.canvas / 2.0
    tx = c - ((x0 + x1) / 2.0) * s
    ty = c - ((y0 + y1) / 2.0) * s

    if a.bg:
        r = a.corner
        if r > 0:
            bg = (f'  <rect x="0" y="0" width="{a.canvas:g}" height="{a.canvas:g}" '
                  f'rx="{r:g}" ry="{r:g}" fill="{a.bg}"/>\n')
        else:
            bg = f'  <rect x="0" y="0" width="{a.canvas:g}" height="{a.canvas:g}" fill="{a.bg}"/>\n'
    else:
        bg = ""

    out = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {a.canvas:g} {a.canvas:g}" width="{a.canvas:g}" height="{a.canvas:g}" role="img" aria-labelledby="t">
  <title id="t">{a.title} — icon</title>
  <!-- Symbol ink scaled to {a.ink_height:g} units on a {a.canvas:g} canvas (~{(a.canvas - a.ink_height) / 2:.0f}-unit
       margin on each side, inside the safe zone for circular social-avatar crops). -->
{bg}  <g transform="translate({tx:.2f},{ty:.2f}) scale({s:.4f})">
{inner.rstrip()}
  </g>
</svg>
'''
    open(a.out, "w", encoding="utf-8").write(out)
    print(f"wrote {a.out}  canvas {a.canvas:g}  scale {s:.4f}  ink {w:.0f}x{h:.0f} -> {a.ink_height:g}")


main()
