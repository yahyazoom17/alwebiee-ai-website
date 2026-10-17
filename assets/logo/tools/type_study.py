#!/usr/bin/env python3
"""Build a type study: "Alwebiee" set in candidate faces, at matched cap height.

Each candidate is instantiated to a static weight, then the wordmark is outlined and laid out
with the *same cap height* and the *same relative tracking*, so the comparison is optical, not
nominal — a font with a big cap-to-em ratio no longer looks bigger than the others.

Writes one HTML page (self-contained) plus prints a metrics table.

Usage:
  python3 tools/type_study.py --symbol master-a.svg -o type-options.html \
      --font "Inter SemiBold=/tmp/opencode/fonts/Inter.ttf" --wght 600 ...
"""
import argparse
import html
import importlib.util
import os
import re
import subprocess
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load(name, *rel):
    if rel:
        p = os.path.normpath(os.path.join(HERE, *rel))
    else:
        p = os.path.join(HERE, name if name.endswith(".py") else name + ".py")
    spec = importlib.util.spec_from_file_location(name, p)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def inner_svg(path):
    raw = open(path, encoding="utf-8").read()
    raw = re.sub(r"^.*?<svg\b[^>]*>", "", raw, flags=re.S)
    return re.sub(r"</svg>\s*$", "", raw, flags=re.S)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--symbol", default="master-a.svg")
    ap.add_argument("-o", "--out", default="type-options.html")
    ap.add_argument("--font", action="append", required=True,
                    metavar="LABEL=FILE", help="repeatable")
    ap.add_argument("--wght", type=float, default=600.0)
    ap.add_argument("--opsz", default="max")
    ap.add_argument("--cap-height", type=float, default=89.0)
    ap.add_argument("--tracking", type=float, default=-0.015, help="as a fraction of the size")
    ap.add_argument("--work", default="/tmp/opencode/type-test")
    ap.add_argument("--bg", default=None)
    a = ap.parse_args()

    glyphs = load("glyphs")
    os.makedirs(a.work, exist_ok=True)
    py = sys.executable

    rows, metrics = [], []
    for item in a.font:
        label, _, src = item.partition("=")
        label = label.strip() or os.path.basename(src)
        slug = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")

        # 1. pin the variable axes -> static instance
        static = os.path.join(a.work, f"{slug}.ttf")
        need = True
        if os.path.exists(static) and os.path.getmtime(static) > os.path.getmtime(src):
            need = False
        if need:
            cmd = [py, os.path.join(HERE, "font_instance.py"), src, static,
                   "--wght", str(a.wght)]
            if a.opsz:
                cmd += ["--opsz", a.opsz]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL)
        if os.path.getsize(static) == 0:
            print(f"  !! {label}: failed to instantiate")
            continue

        family = glyphs.family_name(static)
        ratio = glyphs.cap_ratio(static)
        size = a.cap_height / ratio
        track = a.tracking * size

        # 2. horizontal lockup + wordmark-only, both outlined
        lk = os.path.join(a.work, f"{slug}-lockup.svg")
        wm = os.path.join(a.work, f"{slug}-wordmark.svg")
        lcmd = [py, os.path.join(HERE, "make_lockup.py"), a.symbol, lk, "--outline",
                "--font-file", static, "--size", f"{size:.3f}", "--tracking", f"{track:.3f}",
                "--ink", "#111"]
        scmd = [py, os.path.join(HERE, "make_stacked.py"), a.symbol, wm, "--outline",
                "--no-symbol", "--font-file", static, "--word-size", f"{size:.3f}",
                "--tracking", f"{track:.3f}", "--pad", "26", "--ink", "#111"]
        ol = subprocess.run(lcmd, capture_output=True, text=True)
        ow = subprocess.run(scmd, capture_output=True, text=True)
        if ol.returncode or ow.returncode:
            print(f"  !! {label} build failed\n{ol.stdout}{ol.stderr}{ow.stdout}{ow.stderr}")
            continue

        d, adv, bb = glyphs.outline_wordmark("Alwebiee", static, size, track)
        ink_w = bb[2] - bb[0]
        m = re.search(r"viewBox 0 0 (\S+) (\S+)", ol.stdout)
        lw = m.group(1) if m else "?"

        rows.append({"label": label, "family": family, "lockup": lk, "wordmark": wm,
                     "size": size, "cap": a.cap_height, "ratio": ratio,
                     "ink_w": ink_w, "adv": adv, "lockup_w": lw})
        metrics.append((label, family, ratio, size, ink_w, ink_w / a.cap_height, adv))

    if not rows:
        raise SystemExit("no candidates built")

    # one shared scale so every option is shown at its TRUE relative size (not fit-to-width)
    sizes = {}
    for r in rows:
        wb, hb = _wh(r["wordmark"])
        wl, hl = _wh(r["lockup"])
        r["wb"], r["hb"], r["wl"], r["hl"] = wb, hb, wl, hl
    k_big = 1000.0 / max(r["wb"] for r in rows)
    k_lock = 1040.0 / max(r["wl"] for r in rows)

    warn = ('<p class="warn">Pick a number and the whole kit rebuilds in one pass — lockups, '
            'stacked, wordmark-only, tiles, social, PDFs, guidelines and the web icons. '
            'Typeface is the one choice I cannot judge for you, because I cannot see the render.</p>')

    cards = ""
    for i, r in enumerate(rows, 1):
        cards += f"""
<div class="card">
  <div class="head"><span class="num">{i}</span><div><b>{html.escape(r['label'])}</b>
    <span class="sub">{html.escape(r['family'])} · cap {r['cap']:.0f} of 176 ({(r['cap'] / 176 * 100):.0f}% of symbol)
    · wordmark {r['ink_w'] / r['cap']:.2f}× cap wide</span></div></div>
  <div class="big"><svg viewBox="{_vb(r['wordmark'])}" width="{r['wb'] * k_big:.0f}" height="{r['hb'] * k_big:.0f}">{inner_svg(r['wordmark'])}</svg></div>
  <div class="lock"><svg viewBox="{_vb(r['lockup'])}" width="{r['wl'] * k_lock:.0f}" height="{r['hl'] * k_lock:.0f}">{inner_svg(r['lockup'])}</svg></div>
  <div class="small">
    <div><svg viewBox="{_vb(r['lockup'])}" width="150">{inner_svg(r['lockup'])}</svg><span>150 px wide</span></div>
    <div><svg viewBox="{_vb(r['lockup'])}" width="96">{inner_svg(r['lockup'])}</svg><span>96 px</span></div>
    <div><svg viewBox="{_vb(r['lockup'])}" width="64">{inner_svg(r['lockup'])}</svg><span>64 px</span></div>
    <div><svg viewBox="{_vb(r['wordmark'])}" width="120">{inner_svg(r['wordmark'])}</svg><span>wordmark 120 px</span></div>
  </div>
</div>"""

    doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Alwebiee — wordmark type study</title><style>
*{{box-sizing:border-box}}
body{{margin:0;font:15px/1.5 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#111;background:#fff}}
.wrap{{width:1180px;margin:0 auto;padding:44px 54px 70px}}
h1{{margin:0 0 6px;font-size:30px;letter-spacing:-.02em}}
p.lead{{margin:0 0 6px;color:#444;max-width:900px}}
p.warn{{margin:12px 0 26px;padding:10px 14px;background:#f1f7f4;border-left:3px solid #0F7A4F;font-size:13.5px;color:#333}}
.card{{border:1px solid #e6e6e6;border-radius:12px;padding:22px 24px;margin-bottom:22px}}
.head{{display:flex;gap:14px;align-items:center;margin-bottom:18px}}
.num{{width:26px;height:26px;border-radius:50%;background:#0F7A4F;color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700;flex:0 0 26px}}
.head b{{font-size:16px}}
.head .sub{{display:block;color:#888;font-size:12px;margin-top:2px}}
.big{{padding:18px 26px 14px;background:#fafafa;border-radius:8px;border:1px solid #eee;overflow:hidden}}
.big svg,.lock svg{{display:block}}
.lock{{margin:18px 0 0;padding:16px 0 4px;border-top:1px solid #f0f0f0;overflow:hidden}}
.small{{display:flex;gap:30px;align-items:flex-end;border-top:1px solid #f0f0f0;padding-top:16px;margin-top:6px}}
.small div{{text-align:left}} .small span{{display:block;font-size:11px;color:#999;margin-top:8px}}
.small svg{{display:block}}
</style></head><body><div class="wrap">
<h1>Alwebiee — wordmark options</h1>
<p class="lead">Every option below is drawn at the <b>same optical size</b> — cap height 89 units,
against the 176-unit symbol, with the same relative tracking — and every row shares one scale, so
widths are directly comparable. What changes is the letterforms: the shapes of the <b>a</b>,
<b>e</b> and <b>w</b>, the terminals, and the overall width. All are outlined to real paths.</p>
{warn}
{cards}
<p class="sub" style="color:#888;font-size:12.5px">All faces are open-source (SIL OFL), so they are
safe for commercial use, print and embedding. The number in the green circle is just for reference —
reply with it.</p>
</div></body></html>
"""
    open(a.out, "w", encoding="utf-8").write(doc)
    print(f"wrote {a.out}  ({len(rows)} candidates)")
    print(f"{'candidate':24} {'family':26} {'cap/em':>7} {'size':>7} {'ink_w':>7} {'w/cap':>6}")
    for label, family, ratio, size, ink_w, wc, adv in metrics:
        print(f"{label:24} {family:26} {ratio:7.4f} {size:7.1f} {ink_w:7.1f} {wc:6.2f}")


def _vb(path):
    raw = open(path, encoding="utf-8").read(400)
    m = re.search(r'viewBox="([^"]+)"', raw)
    return m.group(1) if m else "0 0 100 100"


def _wh(path):
    vb = _vb(path).split()
    return float(vb[2]), float(vb[3])


main()
