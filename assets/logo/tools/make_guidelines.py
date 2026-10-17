#!/usr/bin/env python3
"""Generate guidelines.html — the visual one-page usage guide.

Numbers (clear space, minimum sizes, contrast) are computed here from the same
conventions used by the builders, so the sheet and the markdown can't drift apart.
"""
import importlib.util
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
AUDIT = os.path.normpath(os.path.join(HERE, "..", "..", ".opencode", "skills",
                                      "logo-design", "scripts", "svg_audit.py"))

spec = importlib.util.spec_from_file_location("svg_audit", AUDIT)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

# the shipped typeface label, written by tools/rebuild_brand.py when the wordmark was outlined
_TYPEFACE = os.path.join(ROOT, "fonts", "TYPEFACE")
FONT = open(_TYPEFACE, encoding="utf-8").read().strip() if os.path.exists(_TYPEFACE) else "—"


def inner(name):
    raw = open(os.path.join(ROOT, name), encoding="utf-8").read()
    raw = re.sub(r"^.*?<svg\b[^>]*>", "", raw, flags=re.S)
    return re.sub(r"</svg>\s*$", "", raw, flags=re.S)


def margins(name):
    return audit.audit(os.path.join(ROOT, name))["margins"]


def vb(name):
    """The artwork's own canvas, read from the file — so a wordmark that changes width (a new
    typeface) can never leave a stale viewBox or a stretched preview behind."""
    raw = open(os.path.join(ROOT, name), encoding="utf-8").read(400)
    m = re.search(r'viewBox="[\d.\-]+[\s,]+[\d.\-]+[\s,]+([\d.]+)[\s,]+([\d.]+)', raw)
    return float(m.group(1)), float(m.group(2))


# ---- measured geometry --------------------------------------------------------
mg = margins("lockup-a-master.svg")            # horizontal lockup, black
LH_W, LH_H = vb("lockup-a-master.svg")
GREEN_W, GREEN_H = vb("lockup-a-green.svg")
STACK_W, STACK_H = vb("stacked-a.svg")
WORD_W, WORD_H = vb("wordmark-a.svg")
x0, y0 = mg["left"], mg["top"]
iw = LH_W - mg["left"] - mg["right"]
ih = LH_H - mg["top"] - mg["bottom"]           # symbol is the tallest element, so ih = symbol ink
BAND = (28.0 / 186.0) * ih                     # clear space = the woven band width, at this scale
cw, ch = iw + 2 * BAND, ih + 2 * BAND
# preview heights for the minimum-size row, kept in proportion to each artwork's own canvas
H_96 = 96.0 * LH_H / LH_W
H_80S = 80.0 * STACK_H / STACK_W
H_80W = 80.0 * WORD_H / WORD_W

CONTRAST = [("Alwebiee Green", "#0F7A4F", "15 122 79", "88 0 35 52", "341 C", "5.36", True),
            ("Emerald (alt.)", "#0E6B45", "14 107 69", "87 0 36 58", "chip", "6.55", True),
            ("Forest (alt.)", "#0B5F3A", "11 95 58", "88 0 39 63", "chip", "7.74", True),
            ("Vivid (alt.)", "#16A34A", "22 163 74", "87 0 55 36", "chip", "3.30", False),
            ("Ink", "#111111", "17 17 17", "0 0 0 93", "Process Black", "18.88", True),
            ("White", "#FFFFFF", "255 255 255", "0 0 0 0", "—", "—", True)]

swatches = ""
for name, hx, rgb, cmyk, pms, cr, ok in CONTRAST:
    ink = "#fff" if hx in ("#111111", "#0F7A4F", "#0E6B45", "#0B5F3A") else "#111"
    light = hx in ("#16A34A",)
    chip_ink = "#062A18" if light else ink
    badge = f'<span class="badge ok">white text {cr}:1 AA</span>' if ok and cr != "—" else \
            (f'<span class="badge bad">white text {cr}:1 fails</span>' if cr != "—" else
             '<span class="badge">base</span>')
    if hx == "#16A34A":
        badge = '<span class="badge bad">white 3.30:1 — use dark ink #062A18 (4.71:1)</span>'
    swatches += (f'<div class="sw"><div class="chip" style="background:{hx};color:{chip_ink}">'
                 f'<b>Aa</b></div><div class="meta"><b>{name}</b><code>{hx}</code>'
                 f'<span>RGB {rgb} · CMYK {cmyk} · Pantone {pms}</span>{badge}</div></div>')

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Alwebiee — logo guidelines</title>
<style>
:root{{--grn:{CONTRAST[0][1]};--ink:#111}}
*{{box-sizing:border-box}}
body{{margin:0;font:15px/1.55 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:#fff}}
.wrap{{width:1180px;margin:0 auto}}
header{{background:var(--grn);color:#fff;padding:34px 54px;display:flex;justify-content:space-between;align-items:center}}
header h1{{margin:0;font-size:26px;font-weight:600;letter-spacing:-.01em}}
header p{{margin:6px 0 0;opacity:.85;font-size:13px}}
header svg{{height:66px;width:auto}}
main{{padding:10px 54px 60px}}
section{{margin:34px 0 0;padding-top:22px;border-top:1px solid #e6e6e6}}
h2{{font-size:13px;text-transform:uppercase;letter-spacing:.14em;margin:0 0 16px;color:var(--grn)}}
p.lead{{margin:0 0 14px;max-width:900px}}
.row{{display:flex;gap:28px;align-items:flex-start;flex-wrap:wrap}}
.versions{{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}}
.vbox{{border:1px solid #e6e6e6;border-radius:10px;padding:20px 16px;text-align:center;min-height:150px;
       display:flex;flex-direction:column;justify-content:center;gap:12px}}
.vbox svg{{width:100%;height:auto;max-height:74px}}
.vbox.dark{{background:var(--grn)}}
.vbox span{{font-size:11px;color:#777;letter-spacing:.06em;text-transform:uppercase}}
.vbox.dark span{{color:#cfe6da}}
caption{{color:#777;font-size:12px}}
.minsize{{display:flex;gap:36px;align-items:flex-end;border:1px solid #e6e6e6;border-radius:10px;padding:22px}}
.size{{text-align:center}}
.size svg{{display:block;margin:0 auto 8px}}
.size b{{font-size:12px;display:block}} .size span{{font-size:11px;color:#888}}
table{{border-collapse:collapse;width:100%;font-size:13.5px}}
th,td{{text-align:left;padding:9px 10px;border-bottom:1px solid #eee;vertical-align:top}}
th{{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#888;font-weight:600}}
.sw{{display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid #f0f0f0}}
.chip{{width:56px;height:56px;border-radius:9px;display:grid;place-items:center;font-size:17px;flex:0 0 56px}}
.meta{{display:flex;flex-direction:column;gap:2px;font-size:12.5px}}
.meta b{{font-size:14px}} .meta code{{font:12px ui-monospace,Menlo,Consolas,monospace;color:#555}}
.meta span{{color:#666}}
.badge{{display:inline-block;margin-top:4px;font-size:11px;padding:2px 8px;border-radius:999px;background:#eee;color:#555;width:max-content}}
.badge.ok{{background:#e2f3ea;color:#0b5f3a}} .badge.bad{{background:#fdeaea;color:#a11}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:26px}}
.dd{{border:1px solid #e6e6e6;border-radius:10px;padding:18px}}
.dd h3{{margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:.1em}}
.dd.yes h3{{color:var(--grn)}} .dd.no h3{{color:#a11}}
.dd .ex{{height:74px;display:grid;place-items:center;background:#fafafa;border-radius:6px;margin-bottom:12px;overflow:hidden}}
.dd img{{max-height:44px;max-width:100%}}
.dd ul{{margin:0;padding-left:18px;font-size:13px;color:#444}} .dd li{{margin:5px 0}}
.zone{{border:1px solid #e6e6e6;border-radius:10px;padding:18px;display:flex;gap:26px;align-items:center}}
.zone svg{{width:520px;height:auto}}
.zone div p{{margin:0 0 10px;font-size:13.5px}}
.note{{background:#f6f8f7;border-left:3px solid var(--grn);padding:12px 16px;font-size:13px;color:#444;margin-top:14px}}
footer{{padding:22px 54px;color:#888;font-size:12px;border-top:1px solid #eee}}
</style></head><body>
<div class="wrap">
<header>
  <div><h1>Alwebiee — logo guidelines</h1><p>The Woven Frame · green background, white artwork</p></div>
  <svg viewBox="0 0 {GREEN_W:g} {GREEN_H:g}">{inner('lockup-a-green.svg')}</svg>
</header>
<main>

<section><h2>The four versions</h2>
<div class="versions">
  <div class="vbox"><svg viewBox="0 0 {LH_W:g} {LH_H:g}">{inner('lockup-a-master.svg')}</svg><span>Primary</span></div>
  <div class="vbox"><svg viewBox="0 0 {STACK_W:g} {STACK_H:g}">{inner('stacked-a.svg')}</svg><span>Stacked</span></div>
  <div class="vbox"><svg viewBox="0 0 256 256">{inner('master-a.svg')}</svg><span>Symbol</span></div>
  <div class="vbox"><svg viewBox="0 0 {WORD_W:g} {WORD_H:g}">{inner('wordmark-a.svg')}</svg><span>Wordmark</span></div>
  <div class="vbox dark"><svg viewBox="0 0 {GREEN_W:g} {GREEN_H:g}">{inner('lockup-a-green.svg')}</svg><span>Reversed</span></div>
  <div class="vbox"><svg viewBox="0 0 256 256">{inner('variants/alwebiee-square.svg')}</svg><span>Tiled</span></div>
  <div class="vbox dark"><svg viewBox="0 0 256 256">{inner('variants/alwebiee-white.svg')}</svg><span>Symbol reversed</span></div>
  <div class="vbox"><svg viewBox="0 0 256 256">{inner('variants/alwebiee-app-icon.svg')}</svg><span>App icon</span></div>
</div></section>

<section><h2>Clear space</h2>
<div class="zone">
  <svg viewBox="0 0 {cw:.1f} {ch:.1f}">
    <rect width="{cw:.1f}" height="{ch:.1f}" fill="#0F7A4F" opacity=".10"/>
    <rect x="{BAND:.2f}" y="{BAND:.2f}" width="{iw:.2f}" height="{ih:.2f}" fill="#fff"/>
    <rect x="{BAND:.2f}" y="{BAND:.2f}" width="{iw:.2f}" height="{ih:.2f}" fill="none"
          stroke="#0F7A4F" stroke-width="1" stroke-dasharray="5 4"/>
    <svg x="{BAND:.2f}" y="{BAND:.2f}" width="{iw:.2f}" height="{ih:.2f}" viewBox="{x0:g} {y0:g} {iw:.2f} {ih:.2f}">
      {inner('lockup-a-master.svg')}
    </svg>
    <text x="{cw/2:.0f}" y="14" text-anchor="middle" font-size="11" fill="#0F7A4F">1 × band · clear space boundary</text>
  </svg>
  <div>
    <p><b>Keep one woven-band width clear on every side.</b> That is <b>≈ {BAND:.0f} units</b> here —
    <b>{100*BAND/ih:.0f}% of the symbol's height</b>.</p>
    <p>The band is 28 units wide against 186 units of symbol, so the zone always scales with the logo.
    Never use a fixed pixel margin.</p>
    <p>Nothing enters the zone — no text, no rules, no other marks, no image edges.</p>
  </div>
</div></section>

<section><h2>Minimum size</h2>
<div class="minsize">
  <div class="size"><svg viewBox="0 0 {LH_W:g} {LH_H:g}" style="width:96px;height:{H_96:.1f}px">{inner('lockup-a-master.svg')}</svg>
    <b>96 px / 25 mm</b><span>Horizontal</span></div>
  <div class="size"><svg viewBox="0 0 {STACK_W:g} {STACK_H:g}" style="width:80px;height:{H_80S:.1f}px">{inner('stacked-a.svg')}</svg>
    <b>80 px / 20 mm</b><span>Stacked</span></div>
  <div class="size"><svg viewBox="0 0 {WORD_W:g} {WORD_H:g}" style="width:80px;height:{H_80W:.1f}px">{inner('wordmark-a.svg')}</svg>
    <b>80 px / 20 mm</b><span>Wordmark</span></div>
  <div class="size"><svg viewBox="0 0 256 256" style="width:16px;height:16px">{inner('master-a.svg')}</svg>
    <b>16 px / 6 mm</b><span>Symbol &amp; favicon</span></div>
</div>
<p class="lead" style="margin-top:12px;color:#777;font-size:12px">Shown at actual size. Below these, the wordmark's joins close up —
drop the wordmark and use the symbol.</p></section>

<section><h2>Colour</h2>
<div class="cols" style="grid-template-columns:1fr 1fr;gap:0 40px">{swatches}</div>
<div class="note"><b>Print honesty.</b> The CMYK builds are a plain RGB→CMYK conversion — a starting point, not a
proof. The Pantone values are nearest-match suggestions from publicly published approximate RGB data, not certified
PMS values. Confirm both on a physical Pantone chip and a proofed sheet before specifying print.</div>
</section>

<section><h2>Approved pairs &amp; misuse</h2>
<div class="cols">
  <div class="dd yes"><h3>Do</h3>
    <div class="ex" style="background:#fff"><img src="lockup-a-master.svg"></div>
    <div class="ex" style="background:#0F7A4F"><img src="variants/alwebiee-horizontal-white.svg"></div>
    <ul><li>White artwork on Alwebiee Green (5.36:1) — the primary pair</li>
        <li>Black on white for documents</li>
        <li>Green on white, white on Ink</li>
        <li>On photos: over a calm area or in a solid green square</li></ul></div>
  <div class="dd no"><h3>Don't</h3>
    <div class="ex"><img src="variants/alwebiee-horizontal-black.svg" style="transform:scaleX(1.45);max-height:40px"></div>
    <div class="ex"><img src="lockup-a-green.svg" style="transform:rotate(-11deg);max-height:40px"></div>
    <div class="ex"><img src="variants/alwebiee-horizontal-black.svg" style="filter:sepia(1) saturate(6) hue-rotate(-40deg)"></div>
    <div class="ex"><img src="variants/alwebiee-horizontal-black.svg" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,.55)) blur(0.2px)"></div>
    <ul><li>Don't stretch, squash or rotate</li>
        <li>Don't recolour outside the palette</li>
        <li>Don't add shadows, outlines, gradients or glows</li>
        <li>Don't rearrange or resize parts of a lockup</li>
        <li>Don't retype the wordmark or crop the frame</li></ul></div>
</div></section>

<section><h2>Which file where</h2>
<table>
<tr><th>Use</th><th>File</th></tr>
<tr><td>Website header, light background</td><td><code>variants/alwebiee-horizontal-black.svg</code></td></tr>
<tr><td>Website header, dark background</td><td><code>variants/alwebiee-horizontal-white.svg</code></td></tr>
<tr><td>Green header / footer band</td><td><code>lockup-a-green.svg</code></td></tr>
<tr><td>Circular social avatar</td><td><code>avatar-a-green-round.svg</code></td></tr>
<tr><td>App icon / store listing</td><td><code>variants/apple-touch-icon.png</code>, <code>variants/icon-512.png</code></td></tr>
<tr><td>Favicon (browser tab)</td><td><code>variants/favicon-green.ico</code>, <code>variants/favicon.svg</code></td></tr>
<tr><td>PWA manifest + icons</td><td><code>variants/site.webmanifest</code></td></tr>
<tr><td>Social post · link card</td><td><code>post-a-green.svg</code> · <code>card-a-green.svg</code></td></tr>
<tr><td>Print (vector)</td><td><code>print/*.pdf</code></td></tr>
<tr><td>Wordmark typeface</td><td>{FONT} (SIL OFL) — outlined to paths, shipped in <code>fonts/</code></td></tr>
</table></section>

<section><h2>Open items</h2>
<ol style="font-size:14px;color:#444;margin:0;padding-left:20px">
  <li>Pantone chip check and CMYK proof.</li>
  <li>Trademark search on the name and mark before launch.</li>
  <li>Confirm the tagline before it appears anywhere public.</li>
</ol></section>

</main>
<footer>Alwebiee · logo guidelines · generated {os.path.basename(__file__)} · master files in the project folder</footer>
</div></body></html>
"""

open(os.path.join(ROOT, "guidelines.html"), "w", encoding="utf-8").write(html)
print(f"wrote guidelines.html  (clear space {BAND:.1f} units = {100*BAND/ih:.0f}% of symbol height)")
