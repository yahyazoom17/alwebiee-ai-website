#!/usr/bin/env python3
"""Instantiate a static instance from a variable font (needs fontTools).

Variable fonts draw their *default* instance when outlined, so a weight axis has to be
pinned first. This writes a plain static TTF at the requested weight (and optical size,
if the font has one) that every other tool can then treat like any single-weight font.

Usage:
  python3 tools/font_instance.py Inter.ttf Inter-600.ttf --wght 600 --opsz max
"""
import argparse
import os
import sys

sys.dont_write_bytecode = True


def _weight_label(weight):
    grid = [(100, "Thin"), (200, "ExtraLight"), (300, "Light"), (400, "Regular"),
            (500, "Medium"), (600, "SemiBold"), (700, "Bold"), (800, "ExtraBold"),
            (900, "Black")]
    return min(grid, key=lambda g: abs(g[0] - weight))[1]


def _rename_instance(font, loc):
    """Give the static instance an honest family/style name for the chosen weight.

    The instancer leaves the variable font's *default* style name in place (so a 600 cut of
    Space Grotesk would still call itself "Light"). Everything downstream that reports which
    face was used reads these names, so they have to be right.
    """
    weight = loc.get("wght")
    if weight is None:
        return
    label = _weight_label(weight)
    name = font["name"]
    family = (name.getDebugName(16) or name.getDebugName(1) or "Font").strip()
    for style_words in ("Light", "ExtraLight", "Thin", "Bold", "Regular", "Medium",
                        "SemiBold", "ExtraBold", "Black", "Book"):
        if family.endswith(" " + style_words):
            family = family[: -len(style_words) - 1].strip()
    full = f"{family} {label}"
    ps = full.replace(" ", "")

    def put(nid, value):
        for plat, enc, lang in ((3, 1, 0x409), (1, 0, 0)):
            name.setName(value, nid, plat, enc, lang)

    put(1, family)
    put(2, label)
    put(3, f"{full};{label}")
    put(4, full)
    put(6, ps)
    put(16, family)
    put(17, label)
    font["OS/2"].usWeightClass = int(round(weight))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--wght", type=float, default=600.0)
    ap.add_argument("--opsz", default=None, help="'max', 'min', 'default', or a number")
    ap.add_argument("--wdth", type=float, default=None)
    a = ap.parse_args()

    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    font = TTFont(a.src)
    loc = {}
    axes = {ax.axisTag: ax for ax in font["fvar"].axes} if "fvar" in font else {}

    if "wght" in axes:
        lo, hi = axes["wght"].minValue, axes["wght"].maxValue
        loc["wght"] = max(lo, min(hi, a.wght))
    if a.wdth is not None and "wdth" in axes:
        loc["wdth"] = a.wdth
    if a.opsz is not None and "opsz" in axes:
        ax = axes["opsz"]
        if a.opsz == "max":
            loc["opsz"] = ax.maxValue
        elif a.opsz == "min":
            loc["opsz"] = ax.minValue
        elif a.opsz != "default":
            loc["opsz"] = float(a.opsz)

    if loc:
        instancer.instantiateVariableFont(font, loc, inplace=True, updateFontNames=False)
        _rename_instance(font, loc)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    font.save(a.out)

    # report what we made
    f2 = TTFont(a.out)
    upem = f2["head"].unitsPerEm
    cap = getattr(f2["OS/2"], "sCapHeight", 0) or 0
    fam = f2["name"].getDebugName(1)
    style = f2["name"].getDebugName(2)
    print(f"wrote {a.out}  {fam} {style}  loc={loc}  upem={upem}  "
          f"capRatio={cap/upem:.4f}" if cap else
          f"wrote {a.out}  {fam} {style}  loc={loc}  upem={upem}")


main()
