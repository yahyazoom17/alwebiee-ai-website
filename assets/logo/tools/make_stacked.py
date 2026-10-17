#!/usr/bin/env python3
"""Build a STACKED lockup (symbol above wordmark) or a wordmark-only lockup.

Unlike the horizontal builder this lays everything out from *measured* ink boxes,
so the stack is exactly centred and the colour background pads the ink evenly.

Usage:
  python3 tools/make_stacked.py SYMBOL.svg OUT.svg --outline
  python3 tools/make_stacked.py SYMBOL.svg OUT.svg --outline --ink "#ffffff" --bg "#0F7A4F"
  python3 tools/make_stacked.py SYMBOL.svg wordmark-only.svg --outline --no-symbol
"""
import argparse
import importlib.util
import os
import re

SYMBOL_INK = 200.0     # target ink height (and width — the symbol is square)
WORD_SIZE = 110.0      # wordmark font size
GAP = 46.0             # gap between symbol ink bottom and wordmark ink top
TRACKING = -2.0


def _load(name, relpath):
    p = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                      *relpath))
    spec = importlib.util.spec_from_file_location(name, p)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("symbol")
    ap.add_argument("out")
    ap.add_argument("--text", default="Alwebiee")
    ap.add_argument("--font-file",
                    default="/usr/share/fonts/opentype/urw-base35/URWGothic-Demi.otf")
    ap.add_argument("--symbol-ink", type=float, default=SYMBOL_INK)
    ap.add_argument("--word-size", type=float, default=WORD_SIZE)
    ap.add_argument("--gap", type=float, default=GAP)
    ap.add_argument("--tracking", type=float, default=TRACKING)
    ap.add_argument("--outline", action="store_true")
    ap.add_argument("--no-symbol", action="store_true", help="wordmark only")
    ap.add_argument("--ink", default="#111")
    ap.add_argument("--bg", default=None)
    ap.add_argument("--pad", type=float, default=48.0)
    ap.add_argument("--title", default="Alwebiee")
    a = ap.parse_args()

    glyphs = _load("glyphs", ("glyphs.py",))
    audit = _load("svg_audit", ("..", "..", ".opencode", "skills", "logo-design",
                                "scripts", "svg_audit.py"))

    # ---- symbol ---------------------------------------------------------
    src = open(a.symbol, encoding="utf-8").read()
    inner = re.sub(r"^.*?<svg[^>]*>", "", src, flags=re.S)
    inner = re.sub(r"</svg>\s*$", "", inner, flags=re.S).replace("#111", a.ink)
    mg = audit.audit(a.symbol)["margins"]
    sx0, sy0 = mg["left"], mg["top"]
    sx1, sy1 = 256.0 - mg["right"], 256.0 - mg["bottom"]
    sw, sh = sx1 - sx0, sy1 - sy0
    s = a.symbol_ink / sh
    sym_w = sw * s

    # ---- wordmark -------------------------------------------------------
    d, adv, (wx0, wy0, wx1, wy1) = glyphs.outline_wordmark(
        a.text, a.font_file, a.word_size, a.tracking)
    wm_w, wm_h = wx1 - wx0, wy1 - wy0

    Cw = 0.0 if a.no_symbol else sym_w
    Cw = max(Cw, wm_w)
    Ch = wm_h if a.no_symbol else (a.symbol_ink + a.gap + wm_h)

    p = a.pad
    W, H = round(Cw + 2 * p), round(Ch + 2 * p)

    body = ""
    if not a.no_symbol:
        tx = p + (Cw - sym_w) / 2.0 - sx0 * s
        ty = p - sy0 * s
        body += (f'  <g transform="translate({tx:.2f},{ty:.2f}) scale({s:.4f})">\n'
                 f'{inner.rstrip()}\n  </g>\n')
    top = 0.0 if a.no_symbol else a.symbol_ink + a.gap
    wtx = p + (Cw - wm_w) / 2.0 - wx0
    wty = p + top - wy0
    body += (f'  <g transform="translate({wtx:.2f},{wty:.2f})">\n'
             f'    <path fill="{a.ink}" d="{d}"/>\n  </g>\n')

    bg = (f'  <rect x="0" y="0" width="{W}" height="{H}" fill="{a.bg}"/>\n'
          if a.bg else "")
    kind = "wordmark only" if a.no_symbol else "stacked"
    out = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="st">
  <title id="st">{a.title} — {kind} lockup</title>
  <!-- {kind}: symbol ink {a.symbol_ink:g} tall (if any), gap {a.gap:g}, wordmark {a.word_size:g} pt
       (cap height {glyphs.cap_ratio(a.font_file) * a.word_size:.1f} units).
       Wordmark outlined from {glyphs.family_name(a.font_file)}. -->
{bg}{body}</svg>
'''
    open(a.out, "w", encoding="utf-8").write(out)
    print(f"wrote {a.out}  viewBox 0 0 {W} {H}  {kind}  sym {sym_w:.0f}px@x{s:.3f}  "
          f"wm {wm_w:.0f}x{wm_h:.0f}")


main()
