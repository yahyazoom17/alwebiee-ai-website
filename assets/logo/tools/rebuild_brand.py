#!/usr/bin/env python3
"""Rebuild every wordmark-bearing asset from ONE font file — the reproducible typeface swap.

Only the wordmark comes from a typeface. The mark, the colours, the geometry, the clear space
and the minimum sizes are all font-independent, so changing the typeface means regenerating
exactly the files that carry the wordmark and touching nothing else. This script does that in a
single pass, so a typeface change is reproducible and can never leave a stale asset behind.

Cap heights are held at the shipped values (88.85 horizontal, 81.44 stacked/wordmark), and the
tracking at the shipped ratio (-1.667% of the size), so the swap changes the letterforms and
nothing else — the lockups keep their optical size and only get wider or narrower.

Usage:
  python3 tools/rebuild_brand.py --font-file fonts/PlusJakartaSans-SemiBold.ttf
  python3 tools/rebuild_brand.py --font-file /tmp/fonts/Foo.ttf --no-render
  python3 tools/rebuild_brand.py --font-file fonts/Foo.ttf --ofl /tmp/fonts/OFL-Foo.txt
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ML = os.path.join(HERE, "make_lockup.py")
MS = os.path.join(HERE, "make_stacked.py")
CP = os.path.join(HERE, "compose.py")
PDF = os.path.join(HERE, "svg_to_pdf.py")
MG = os.path.join(HERE, "make_guidelines.py")
FTENV = "/tmp/opencode/ftenv/bin/python"
RENDER = os.path.join(ROOT, "..", ".opencode", "skills", "logo-design", "scripts",
                      "render_png.py")
BOARD = os.path.join(ROOT, "..", ".opencode", "skills", "logo-design", "scripts",
                     "presentation_board.py")

# shipped optical sizes — the typeface changes, these do not
CAP_HORIZONTAL = 88.848     # 120 pt x URW Gothic's 0.7404 cap ratio
CAP_STACKED = 81.444        # 110 pt x 0.7404
TRACKING_EM = -1.0 / 60.0   # -1.667% of the size, i.e. the shipped -2 at 120 pt
PAD = 48.0

# (output, ink, background) for the horizontal lockups
HORIZONTAL = [
    ("lockup-a-master.svg", "#111", None),
    ("lockup-a-green.svg", "#ffffff", "#0F7A4F"),
    ("lockup-a-green-emerald.svg", "#ffffff", "#0E6B45"),
    ("lockup-a-green-forest.svg", "#ffffff", "#0B5F3A"),
    ("lockup-a-green-vivid.svg", "#062A18", "#16A34A"),
]
STACKED = [
    ("stacked-a.svg", "#111", None),
    ("stacked-a-green.svg", "#ffffff", "#0F7A4F"),
]
WORDMARK_ONLY = [
    ("wordmark-a.svg", "#111", None),
    ("wordmark-a-green.svg", "#ffffff", "#0F7A4F"),
]
# shipped colour variants of the horizontal lockup: output, colour
VARIANTS = [
    ("variants/alwebiee-horizontal-black.svg", "#000000"),
    ("variants/alwebiee-horizontal-white.svg", "#ffffff"),
    ("variants/alwebiee-horizontal-mono-0f7a4f.svg", "#0f7a4f"),
]
# social placements built from the black lockup: output, canvas, wide, title
PLACEMENTS = [
    ("post-a-green.svg", "1080x1080", 760, "Alwebiee \u2014 social post"),
    ("card-a-green.svg", "1200x630", 820, "Alwebiee \u2014 link card"),
]
# print masters: file, width in mm, optional page background
PRINT = [
    ("lockup-a-master.svg", "print/alwebiee-logo-horizontal.pdf", 100, None),
    ("lockup-a-green.svg", "print/alwebiee-logo-horizontal-green.pdf", 100, "#0F7A4F"),
    ("stacked-a.svg", "print/alwebiee-logo-stacked.pdf", 60, None),
    ("wordmark-a.svg", "print/alwebiee-wordmark.pdf", 80, None),
]
# raster renders: source, output, multiple of the artwork's own width
RASTER = [
    ("lockup-a-master.svg", "renders/lockup-a-master.png", 2.0),
    ("lockup-a-green.svg", "renders/lockup-a-green.png", 2.0),
    ("lockup-a-green-emerald.svg", "renders/lockup-a-green-emerald.png", 1.5),
    ("lockup-a-green-forest.svg", "renders/lockup-a-green-forest.png", 1.5),
    ("lockup-a-green-vivid.svg", "renders/lockup-a-green-vivid.png", 1.5),
    ("stacked-a.svg", "renders/stacked-a.png", 2.0),
    ("stacked-a-green.svg", "renders/stacked-a-green.png", 2.0),
    ("wordmark-a.svg", "renders/wordmark-a.png", 2.0),
    ("wordmark-a-green.svg", "renders/wordmark-a-green.png", 2.0),
    ("post-a-green.svg", "renders/post-a-green.png", 1.0),
    ("card-a-green.svg", "renders/card-a-green.png", 1.0),
    ("variants/alwebiee-horizontal-black.svg", "variants/alwebiee-horizontal-black-1600.png", None),
    ("variants/alwebiee-horizontal-white.svg", "variants/alwebiee-horizontal-white-1600.png", None),
    ("variants/alwebiee-horizontal-mono-0f7a4f.svg",
     "variants/alwebiee-horizontal-mono-0f7a4f-1600.png", None),
]
# pages that show the wordmark: html, output png, viewport width
PAGES = [
    ("brandsheet.html", "renders/brandsheet.png", 1180),
    ("greens.html", "renders/green-options.png", 1100),
    ("guidelines.html", "renders/guidelines.png", 1180),
]


_FT_PROBE = (
    "import importlib.util, sys\n"
    "spec = importlib.util.spec_from_file_location('glyphs', sys.argv[1])\n"
    "g = importlib.util.module_from_spec(spec)\n"
    "spec.loader.exec_module(g)\n"
    "print('%.6f' % g.cap_ratio(sys.argv[2]))\n"
    "print(g.family_name(sys.argv[2]))\n"
)


def font_metrics(py, font_file):
    """Read the cap ratio and family label with the fontTools interpreter, in a subprocess, so
    this driver itself needs only the standard library plus Pillow (for trimming page renders)."""
    out = subprocess.run([py, "-c", _FT_PROBE, os.path.join(HERE, "glyphs.py"), font_file],
                         capture_output=True, text=True)
    if out.returncode != 0:
        sys.stderr.write(out.stdout + out.stderr)
        raise SystemExit("could not read font metrics")
    ratio, fam = out.stdout.strip().splitlines()[:2]
    return float(ratio), fam


def run(cmd, py):
    full = [py] + cmd if py else cmd
    p = subprocess.run(full, capture_output=True, text=True)
    if p.returncode != 0:
        sys.stderr.write(p.stdout + p.stderr)
        raise SystemExit(f"failed: {' '.join(str(c) for c in full)}")
    out = (p.stdout or "").strip().splitlines()
    return out[-1] if out else ""


def vb_width(path):
    raw = open(path, encoding="utf-8").read(400)
    m = re.search(r'viewBox="[\d.\-]+[\s,]+[\d.\-]+[\s,]+([\d.]+)', raw)
    return float(m.group(1))


def shot(html, out, width, py3, tall=9000):
    """Screenshot an HTML page at `width`, then trim the uniform border so the PNG is exact."""
    tmp = tempfile.mkdtemp()
    raw_png = os.path.join(tmp, "raw.png")
    run([RENDER, html, "-o", raw_png, "--width", str(width), "--height", str(tall)], py3)
    try:
        from PIL import Image, ImageChops
    except ImportError:
        shutil.copy(raw_png, os.path.join(ROOT, out))
        shutil.rmtree(tmp, ignore_errors=True)
        return "no-PIL (untrimmed)"
    im = Image.open(raw_png).convert("RGBA")
    flat = Image.alpha_composite(Image.new("RGBA", im.size, (255, 255, 255, 255)), im).convert("RGB")
    box = ImageChops.difference(flat, Image.new("RGB", im.size, (255, 255, 255))).getbbox()
    shutil.rmtree(tmp, ignore_errors=True)
    if not box:
        raise SystemExit(f"{html}: page rendered blank")
    pad = 22
    x0, y0, x1, y1 = box
    crop = im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))
    crop.save(os.path.join(ROOT, out))
    return f"{crop.size[0]}x{crop.size[1]}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font-file", required=True, help="a static TTF/OTF for the wordmark")
    ap.add_argument("--font-dir", default=os.path.join(ROOT, "fonts"))
    ap.add_argument("--ofl", default=None, help="SIL OFL licence text to ship beside the font")
    ap.add_argument("--py-ft", default=FTENV if os.path.exists(FTENV) else sys.executable,
                    help="python with fontTools, for the outlining builders")
    ap.add_argument("--no-render", action="store_true", help="skip PDF + PNG + page regeneration")
    ap.add_argument("--no-pages", action="store_true", help="skip the HTML page screenshots/board")
    a = ap.parse_args()

    ratio, fam = font_metrics(a.py_ft, a.font_file)
    size_h = CAP_HORIZONTAL / ratio
    size_s = CAP_STACKED / ratio
    track_h = TRACKING_EM * size_h
    track_s = TRACKING_EM * size_s

    print(f"typeface: {fam}\n  cap/em {ratio:.4f}  ->  horizontal {size_h:.3f} pt "
          f"(cap {CAP_HORIZONTAL:.2f}, tracking {track_h:.3f})")
    print(f"  {'':11}  ->  stacked    {size_s:.3f} pt "
          f"(cap {CAP_STACKED:.2f}, tracking {track_s:.3f})")

    # ---- ship the font + its licence for provenance ----------------------
    os.makedirs(a.font_dir, exist_ok=True)
    slug = re.sub(r"[^A-Za-z0-9]+", "", fam)
    dest_font = os.path.join(a.font_dir, slug + os.path.splitext(a.font_file)[1].lower())
    shutil.copy(a.font_file, dest_font)
    with open(os.path.join(a.font_dir, "TYPEFACE"), "w", encoding="utf-8") as fh:
        fh.write(fam + "\n")
    print(f"  font shipped: {os.path.relpath(dest_font, ROOT)}")
    if a.ofl and os.path.exists(a.ofl):
        shutil.copy(a.ofl, os.path.join(a.font_dir, "OFL-" + slug + ".txt"))
        print(f"  licence shipped: fonts/OFL-{slug}.txt")
    elif a.ofl:
        print(f"  WARNING: OFL text not found at {a.ofl} — licence NOT copied")

    symbol = os.path.join(ROOT, "master-a.svg")

    # ---- horizontal lockups ---------------------------------------------
    print("\nhorizontal lockups")
    for out, ink, bg in HORIZONTAL:
        cmd = [ML, symbol, os.path.join(ROOT, out), "--outline",
               "--font-file", dest_font, "--size", f"{size_h:.4f}",
               "--tracking", f"{track_h:.4f}", "--ink", ink]
        if bg:
            cmd += ["--bg", bg, "--pad", f"{PAD:g}"]
        print("  " + run(cmd, a.py_ft).replace(str(ROOT) + "/", ""))

    # ---- stacked / wordmark-only ----------------------------------------
    print("stacked + wordmark-only")
    for out, ink, bg in STACKED + WORDMARK_ONLY:
        cmd = [MS, symbol, os.path.join(ROOT, out), "--outline",
               "--font-file", dest_font, "--word-size", f"{size_s:.4f}",
               "--tracking", f"{track_s:.4f}", "--ink", ink, "--pad", f"{PAD:g}"]
        if out.startswith("wordmark"):
            cmd += ["--no-symbol"]
        if bg:
            cmd += ["--bg", bg]
        print("  " + run(cmd, a.py_ft).replace(str(ROOT) + "/", ""))

    # ---- colour variants of the horizontal lockup -----------------------
    print("colour variants (horizontal)")
    for out, col in VARIANTS:
        tmp = os.path.join(tempfile.gettempdir(), "_variant.svg")
        cmd = [ML, symbol, tmp, "--outline", "--font-file", dest_font,
               "--size", f"{size_h:.4f}", "--tracking", f"{track_h:.4f}", "--ink", col,
               "--title", "Alwebiee"]
        run(cmd, a.py_ft)
        raw = open(tmp, encoding="utf-8").read()
        raw = raw.replace('<svg xmlns=', f'<svg fill="{col}" xmlns=', 1)
        open(os.path.join(ROOT, out), "w", encoding="utf-8").write(raw)
        print(f"  wrote {out}  {vb_width(os.path.join(ROOT, out)):.0f} wide  ink {col}")

    # ---- social placements ----------------------------------------------
    print("social placements")
    master = os.path.join(ROOT, "lockup-a-master.svg")
    for out, canvas, wide, title in PLACEMENTS:
        print("  " + run([CP, master, os.path.join(ROOT, out), "--canvas", canvas,
                          "--bg", "#0F7A4F", "--ink", "#ffffff", "--width", f"{wide:g}",
                          "--title", title], a.py_ft).replace(str(ROOT) + "/", ""))

    if a.no_render:
        print("\n--no-render: skipping PDFs, PNGs and pages")
        return

    # ---- print PDFs ------------------------------------------------------
    print("print masters (vector PDF)")
    for src, out, mm, bg in PRINT:
        cmd = [PDF, os.path.join(ROOT, src), os.path.join(ROOT, out),
               "--width-mm", f"{mm:g}"]
        if bg:
            cmd += ["--bg", bg]
        print("  " + run(cmd, sys.executable).replace(str(ROOT) + "/", ""))

    # ---- raster renders --------------------------------------------------
    print("raster renders")
    for src, out, mult in RASTER:
        w = 1600 if mult is None else round(vb_width(os.path.join(ROOT, src)) * mult)
        print("  " + run([RENDER, os.path.join(ROOT, src), "-o", os.path.join(ROOT, out),
                          "--width", str(w)], sys.executable).replace(str(ROOT) + "/", ""))

    # ---- pages -----------------------------------------------------------
    if a.no_pages:
        print("\n--no-pages: skipping the HTML pages and the board")
        return
    print("guidelines page")
    print("  " + run([MG], a.py_ft).replace(str(ROOT) + "/", ""))
    print("presentation board + slides")
    print("  " + run([BOARD, os.path.join(ROOT, "presentation-spec.json"), "-o",
                      os.path.join(ROOT, "presentation.html"), "--png-dir",
                      os.path.join(ROOT, "slides")], sys.executable).replace(str(ROOT) + "/", ""))
    print("page screenshots")
    for html, out, width in PAGES:
        print(f"  {out}: {shot(os.path.join(ROOT, html), out, width, sys.executable)}")


if __name__ == "__main__":
    main()
