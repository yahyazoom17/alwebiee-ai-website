#!/usr/bin/env python3
"""Build a horizontal lockup (symbol + wordmark) from a symbol SVG.

The symbol is scaled so its *ink* is 176 units tall, optically centred in a 200-wide slot at
x=100. The wordmark sits to its right with its **cap height** centred on the symbol's centre.

The wordmark is placed as REAL OUTLINED PATHS when fontTools is available (`--outline`,
using --font-file), otherwise as a flagged <text> PLACEHOLDER. Outlining uses the font's own
advance widths + tracking, so the spacing is true metrics, and the file carries no live text
(portable, nothing to install at render time).

`--size` sets the font size, but the vertical placement always uses the font's real cap height
(read from OS/2 sCapHeight), so switching typeface keeps the wordmark the same optical size.
`--cap-height` lets you fix the cap height directly and derive the size from it.

Usage:
  python3 tools/make_lockup.py SYMBOL.svg OUT.svg --outline --text Alwebiee \
      --font-file fonts/PlusJakartaSans-SemiBold.ttf --cap-height 89
"""
import argparse
import importlib.util
import os
import re

SYMBOL_SLOT = 200.0          # width reserved for the symbol
SLOT_CENTRE = 100.0          # x centre of the symbol slot
INK_HEIGHT = 176.0           # target ink height of the symbol
TEXT_X = 230.0               # x origin (pen start) of the wordmark
LINE_CENTRE = 128.0          # y centre shared by symbol and wordmark
RIGHT_PAD = 30.0
CAP_RATIO = 0.7404           # fallback cap/size ratio (URW Gothic) when no font file is given


def _load(name, *rel):
    p = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *rel))
    spec = importlib.util.spec_from_file_location(name, p)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("symbol")
    ap.add_argument("out")
    ap.add_argument("--text", default="Alwebiee")
    ap.add_argument("--font", default="URW Gothic")
    ap.add_argument("--font-file",
                    default="/usr/share/fonts/opentype/urw-base35/URWGothic-Demi.otf")
    ap.add_argument("--size", type=float, default=120.0)
    ap.add_argument("--cap-height", type=float, default=None,
                    help="fix the cap height and derive --size from the font (recommended)")
    ap.add_argument("--tracking", type=float, default=-2.0)
    ap.add_argument("--outline", action="store_true",
                    help="outline the wordmark to paths (needs fontTools); else live <text>")
    ap.add_argument("--title", default=None)
    ap.add_argument("--ink", default="#111", help="colour for symbol + wordmark")
    ap.add_argument("--bg", default=None, help="optional full-bleed background colour")
    ap.add_argument("--pad", type=float, default=0.0, help="padding around content when --bg is used")
    ap.add_argument("--note", default=None, help="override the build comment")
    a = ap.parse_args()

    src = open(a.symbol, encoding="utf-8").read()
    inner = re.sub(r"^.*?<svg[^>]*>", "", src, flags=re.S)
    inner = re.sub(r"</svg>\s*$", "", inner, flags=re.S)
    inner = inner.replace('#111', a.ink)
    title = a.title or "Alwebiee"

    mod = _load("svg_audit", "..", "..", ".opencode", "skills", "logo-design",
                "scripts", "svg_audit.py")

    # ink bbox of the symbol in its own viewBox units
    mg = mod.audit(a.symbol)["margins"]
    x0, y0 = mg["left"], mg["top"]
    x1, y1 = 256.0 - mg["right"], 256.0 - mg["bottom"]
    h = y1 - y0
    s = INK_HEIGHT / h
    tx = SLOT_CENTRE - ((x0 + x1) / 2.0) * s
    ty = LINE_CENTRE - ((y0 + y1) / 2.0) * s

    note = ''
    if a.outline:
        glyphs = _load("glyphs", "glyphs.py")
        ratio = glyphs.cap_ratio(a.font_file)
        size = a.size if a.cap_height is None else a.cap_height / ratio
        d, adv, _bb = glyphs.outline_wordmark(a.text, a.font_file, size, a.tracking)
        cap = size * ratio
        baseline = LINE_CENTRE + cap / 2.0
        fam = glyphs.family_name(a.font_file)
        wordmark = (f'  <g transform="translate({TEXT_X:.1f},{baseline:.2f})">\n'
                    f'    <path fill="{a.ink}" d="{d}"/>\n  </g>')
        note = a.note or (f'Wordmark "{a.text}" outlined from {fam} at {size:.1f} pt '
                          f'(cap height {cap:.1f} units, tracking {a.tracking:g}).')
    else:
        size = a.size
        cap = a.size * CAP_RATIO
        baseline = LINE_CENTRE + cap / 2.0
        adv = 4.564 * a.size
        wordmark = (f'  <text x="{TEXT_X:.0f}" y="{baseline:.1f}" font-family="{a.font}" '
                    f'font-size="{a.size:.0f}" font-weight="600" fill="{a.ink}" '
                    f'letter-spacing="{a.tracking:.0f}">{a.text}</text>')
        note = (f'The wordmark is <text> in "{a.font}" — a PLACEHOLDER font, not outlined. '
                f'Do not ship as-is.')

    width = round(TEXT_X + adv + RIGHT_PAD)

    body = (f'  <g transform="translate({tx:.2f},{ty:.2f}) scale({s:.4f})">\n'
            f'{inner.rstrip()}\n  </g>\n{wordmark}\n')

    header = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{W}} {{H}}" '
              f'width="{{W}}" height="{{H}}" role="img" aria-labelledby="lt">\n'
              f'  <title id="lt">{title} — lockup</title>\n'
              f'  <!-- Symbol ink scaled to {INK_HEIGHT:.0f} units tall, centred in a '
              f'{SYMBOL_SLOT:.0f}-unit slot. {note} -->\n')

    def assemble(W, H, bg_rect, body):
        return (header.replace("{W}", f"{W}").replace("{H}", f"{H}")
                + bg_rect + body + "</svg>\n")

    if a.bg and a.pad:
        # two-pass: measure the lockup's ink, then pad the *ink* evenly on the colour
        import tempfile
        probe = os.path.join(tempfile.gettempdir(), "_lockup_probe.svg")
        open(probe, "w", encoding="utf-8").write(assemble(width, 256, "", body))
        mg2 = mod.audit(probe)["margins"]
        px0, py0 = mg2["left"], mg2["top"]
        px1, py1 = width - mg2["right"], 256 - mg2["bottom"]
        p = a.pad
        W, H = round((px1 - px0) + 2 * p), round((py1 - py0) + 2 * p)
        bg_rect = f'  <rect x="0" y="0" width="{W}" height="{H}" fill="{a.bg}"/>\n'
        body = (f'  <g transform="translate({p - px0:.2f},{p - py0:.2f})">\n'
                + body + "  </g>\n")
    elif a.bg:
        W, H = width, 256
        bg_rect = f'  <rect x="0" y="0" width="{W}" height="{H}" fill="{a.bg}"/>\n'
    else:
        W, H = width, 256
        bg_rect = ""

    open(a.out, "w", encoding="utf-8").write(assemble(W, H, bg_rect, body))
    print(f"wrote {a.out}  viewBox 0 0 {W} {H}  symbol scale {s:.4f}  "
          f"wordmark {'outlined' if a.outline else 'PLACEHOLDER <text>'}  "
          f"size {size:.1f} cap {cap:.1f} adv {adv:.1f}  pad {a.pad:.0f}")


main()
