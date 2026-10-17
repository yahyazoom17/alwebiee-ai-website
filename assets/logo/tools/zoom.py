#!/usr/bin/env python3
"""Zoom inspector: print a high-resolution ASCII crop of a render region.

Usage: python3 tools/zoom.py IMG.png X Y W H [COLS ROWS]
X Y W H are in *render* pixels. Prints an ink profile of the centre row/column.
"""
import sys
import numpy as np
from PIL import Image

RAMP = " .:-=+*#%@"


def load(path):
    a = np.asarray(Image.open(path).convert("RGBA")).astype(float) / 255.0
    return a[:, :, 3] * (1.0 - a[:, :, :3].mean(axis=2))


def main():
    path = sys.argv[1]
    x, y, w, h = (int(v) for v in sys.argv[2:6])
    cols = int(sys.argv[6]) if len(sys.argv) > 6 else 60
    rows = int(sys.argv[7]) if len(sys.argv) > 7 else 30
    ink = load(path)[y:y + h, x:x + w]
    H, W = ink.shape
    print(f"crop x[{x}..{x+w-1}] y[{y}..{y+h-1}]  {W}x{H}px  {cols}x{rows} cells")
    for r in range(rows):
        line = []
        for c in range(cols):
            y0, y1 = int(r * H / rows), max(int((r + 1) * H / rows), int(r * H / rows) + 1)
            x0, x1 = int(c * W / cols), max(int((c + 1) * W / cols), int(c * W / cols) + 1)
            v = ink[y0:y1, x0:x1].max()
            line.append(RAMP[min(int(v * len(RAMP)), len(RAMP) - 1)])
        print("".join(line))
    # numeric profiles through the centre of the crop
    cy, cx = H // 2, W // 2
    print("centre row  ", " ".join(f"{v:.2f}" for v in ink[cy, ::max(1, W // 24)]))
    print("centre col  ", " ".join(f"{v:.2f}" for v in ink[::max(1, H // 24), cx]))


main()
