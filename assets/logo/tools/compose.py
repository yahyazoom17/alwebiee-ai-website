#!/usr/bin/env python3
"""Place one SVG's artwork, centred and scaled, on a coloured square/rect canvas.

Useful for social posts and link cards: a full-bleed brand-colour background with
the lockup or symbol sitting in it. The source SVG's own background (if any) is
dropped; its ink (#111) is recoloured.

Usage: python3 tools/compose.py FG.svg OUT.svg --canvas 1080x1080 \
           --bg "#0F7A4F" --ink "#ffffff" --width 760
"""
import argparse
import re


def inner_of(path):
    src = open(path, encoding="utf-8").read()
    vb = re.search(r'viewBox="([^"]+)"', src)
    w, h = (float(v) for v in vb.group(1).split()[2:4]) if vb else (256.0, 256.0)
    inner = re.sub(r"^.*?<svg[^>]*>", "", src, flags=re.S)
    inner = re.sub(r"</svg>\s*$", "", inner, flags=re.S)
    # drop any full-bleed background rect the source may carry
    inner = re.sub(r'\s*<rect[^>]*width="100%"[^>]*/>', "", inner)
    return inner, w, h


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("fg")
    ap.add_argument("out")
    ap.add_argument("--canvas", default="1080x1080", help="WxH")
    ap.add_argument("--bg", default="#0F7A4F")
    ap.add_argument("--ink", default="#ffffff")
    ap.add_argument("--width", type=float, required=True, help="display width of the foreground")
    ap.add_argument("--y", type=float, default=0.5, help="vertical centre as a fraction (0..1)")
    ap.add_argument("--title", default="Alwebiee")
    ap.add_argument("--corner", type=float, default=0.0)
    a = ap.parse_args()

    cw, ch = (float(v) for v in a.canvas.lower().split("x"))
    inner, fw, fh = inner_of(a.fg)
    inner = inner.replace("#111", a.ink)
    k = a.width / fw
    dh = fh * k
    tx = (cw - a.width) / 2.0
    ty = a.y * ch - dh / 2.0
    r = f' rx="{a.corner:g}" ry="{a.corner:g}"' if a.corner else ""

    out = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw:g} {ch:g}" width="{cw:g}" height="{ch:g}" role="img" aria-labelledby="t">
  <title id="t">{a.title}</title>
  <rect x="0" y="0" width="{cw:g}" height="{ch:g}"{r} fill="{a.bg}"/>
  <g transform="translate({tx:.2f},{ty:.2f}) scale({k:.4f})">
{inner.rstrip()}
  </g>
</svg>
'''
    open(a.out, "w", encoding="utf-8").write(out)
    print(f"wrote {a.out}  {cw:g}x{ch:g}  fg {a.width:g} wide (x{k:.3f})")


main()
