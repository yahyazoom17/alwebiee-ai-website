#!/usr/bin/env python3
"""Export an SVG to an exact-size vector PDF using headless Chrome's print-to-pdf.

The page is sized to the artwork in millimetres, so the PDF is a true vector file at a known
physical size — the right thing to hand a printer. (Chrome, not a rasteriser, so curves stay curves.)

Usage:
  python3 tools/svg_to_pdf.py logo.svg print/logo.pdf --width-mm 100
  python3 tools/svg_to_pdf.py lockup.svg out.pdf --width-mm 120 --bg "#0F7A4F"
"""
import argparse
import os
import re
import shutil
import subprocess
import tempfile
import time

CHROME_CANDIDATES = [
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
    "microsoft-edge", "brave-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]


def find_chrome():
    for c in CHROME_CANDIDATES:
        if os.path.isabs(c):
            if os.path.exists(c):
                return c
        elif shutil.which(c):
            return shutil.which(c)
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("svg")
    ap.add_argument("out")
    ap.add_argument("--width-mm", type=float, default=None, help="page width (default 100 mm)")
    ap.add_argument("--height-mm", type=float, default=None, help="default: keep the SVG aspect")
    ap.add_argument("--bg", default=None, help="page background (e.g. \"#0F7A4F\")")
    a = ap.parse_args()

    raw = open(a.svg, encoding="utf-8").read()
    vb = re.search(r'viewBox\s*=\s*"[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"', raw)
    if not vb:
        raise SystemExit(f"no viewBox in {a.svg}")
    ratio = float(vb.group(1)) / float(vb.group(2))

    w = a.width_mm or 100.0
    h = a.height_mm or round(w / ratio, 3)

    page = (f"<!doctype html><html><head><meta charset='utf-8'><style>"
            f"@page{{size:{w}mm {h}mm;margin:0}}"
            f"html,body{{margin:0;padding:0;background:{a.bg or 'transparent'}}}"
            f"svg{{display:block;width:{w}mm;height:{h}mm}}"
            f"</style></head><body>{raw}</body></html>")

    chrome = find_chrome()
    if not chrome:
        raise SystemExit("no Chromium-based browser found")
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)

    tmp = tempfile.mkdtemp()
    html = os.path.join(tmp, "page.html")
    shot = os.path.join(tmp, "out.pdf")   # never poll the destination: an older PDF may already be there
    open(html, "w", encoding="utf-8").write(page)
    cmd = [chrome, "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
           "--no-pdf-header-footer", f"--print-to-pdf={shot}",
           f"--user-data-dir={os.path.join(tmp, 'profile')}", "file://" + os.path.abspath(html)]
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    deadline = time.time() + 60
    last = -1
    while time.time() < deadline:
        if os.path.exists(shot):
            size = os.path.getsize(shot)
            if size > 0 and size == last:      # two equal reads = chrome has finished writing
                break
            last = size
        if proc.poll() is not None and os.path.exists(shot):
            break
        time.sleep(0.25)
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        proc.kill()

    if not os.path.exists(shot):
        shutil.rmtree(tmp, ignore_errors=True)
        raise SystemExit("chrome produced no PDF")
    shutil.move(shot, a.out)
    shutil.rmtree(tmp, ignore_errors=True)

    size = os.path.getsize(a.out)
    print(f"wrote {a.out}  {w:g}×{h:g} mm  {size} bytes")


main()
