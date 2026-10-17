#!/usr/bin/env python3
"""Text-mode logo inspector: ASCII preview + metrics (bbox, coverage, symmetry, min gap)."""
import sys
import numpy as np
from PIL import Image

RAMP = " .:-=+*#%@"


def load(path):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im).astype(float) / 255.0
    # ink = alpha * darkness (works on transparent or white bg renders)
    alpha = a[:, :, 3]
    lum = a[:, :, :3].mean(axis=2)
    ink = alpha * (1.0 - lum)
    return ink


def ascii_preview(ink, cols=76, rows=36):
    h, w = ink.shape
    out = []
    for r in range(rows):
        line = []
        for c in range(cols):
            y0, y1 = int(r * h / rows), max(int((r + 1) * h / rows), int(r * h / rows) + 1)
            x0, x1 = int(c * w / cols), max(int((c + 1) * w / cols), int(c * w / cols) + 1)
            block = ink[y0:y1, x0:x1]
            v = block.max() if block.size else 0.0
            line.append(RAMP[min(int(v * len(RAMP)), len(RAMP) - 1)])
        out.append("".join(line))
    return "\n".join(out)


def metrics(ink):
    m = ink > 0.5
    ys, xs = np.where(m)
    if len(xs) == 0:
        return "empty"
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    h, w = ink.shape
    cov = m.mean()
    # 180-degree rotational symmetry: compare mark with rotated mark on its own bbox
    crop = m[y0:y1 + 1, x0:x1 + 1]
    rot = crop[::-1, ::-1]
    sym = (crop == rot).mean() if crop.shape == rot.shape else 0.0
    # mirror symmetry (vertical axis)
    mir = (crop == crop[:, ::-1]).mean()
    lines = [
        f"canvas {w}x{h}  bbox x[{x0}..{x1}] y[{y0}..{y1}]  size {x1-x0+1}x{y1-y0+1}",
        f"margins  L{x0} R{w-1-x1} T{y0} B{h-1-y1}   ink coverage {cov*100:.1f}%",
        f"rotational(180) match {sym*100:.1f}%   mirror(vertical) match {mir*100:.1f}%",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    for path in sys.argv[1:]:
        ink = load(path)
        print(f"=== {path}")
        print(metrics(ink))
        print(ascii_preview(ink))
        print()
