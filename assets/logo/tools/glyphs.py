#!/usr/bin/env python3
"""Outline a string to SVG path data with true font metrics (needs fontTools).

Returns the path data with the x-origin at the pen start and the baseline at y=0,
plus the total advance and the ink bounding box, so callers can lay the wordmark
out precisely instead of estimating.

    d, advance, (xmin, ymin, xmax, ymax) = outline_wordmark("Alwebiee", font, 120, -2)
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform


def outline_wordmark(text, font_file, size, tracking=0.0, decimals=2):
    font = TTFont(font_file)
    upem = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    glyphset = font.getGlyphSet()
    scale = size / upem
    ntos = lambda v: f"{v:.{decimals}f}"  # noqa: E731

    x = 0.0
    parts = []
    bounds = BoundsPen(glyphset)
    n = 0
    for ch in text:
        gname = cmap.get(ord(ch))
        if gname is None:
            continue
        t = Transform(scale, 0, 0, -scale, x, 0)
        pen = SVGPathPen(glyphset, ntos=ntos)
        glyphset[gname].draw(TransformPen(pen, t))
        d = pen.getCommands()
        if d:
            parts.append(d)
        glyphset[gname].draw(TransformPen(bounds, t))
        x += hmtx[gname][0] * scale
        n += 1
        if n < len(text):
            x += tracking
    return " ".join(parts), x, bounds.bounds


def cap_ratio(font_file):
    """Cap height as a fraction of the em (from OS/2, falling back to measuring an 'H')."""
    font = TTFont(font_file)
    upem = font["head"].unitsPerEm
    cap = getattr(font["OS/2"], "sCapHeight", 0) or 0
    if cap:
        return cap / upem
    glyphset = font.getGlyphSet()
    cmap = font.getBestCmap()
    bp = BoundsPen(glyphset)
    glyphset[cmap[ord("H")]].draw(bp)
    return bp.bounds[3] / upem


def family_name(font_file):
    """The font's full name (family + style) for build comments, e.g. \"Inter SemiBold\"."""
    font = TTFont(font_file)
    name = font["name"]
    return (name.getDebugName(4) or name.getDebugName(1) or name.getDebugName(6) or "font")


if __name__ == "__main__":
    import sys
    d, adv, bb = outline_wordmark(sys.argv[1] if len(sys.argv) > 1 else "Alwebiee",
                                 "/usr/share/fonts/opentype/urw-base35/URWGothic-Demi.otf",
                                 120.0, -2.0)
    print("advance", adv, "bounds", bb)
