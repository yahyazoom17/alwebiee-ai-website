# Alwebiee — logo kit

**Direction:** Concept A · **The Woven Frame** — one unbroken thread weaves a frame around an **A**.
**Colour:** Alwebiee Green `#0F7A4F` with white artwork.
**Wordmark:** Plus Jakarta Sans SemiBold (SIL OFL), outlined to paths — the font and its licence ship in `fonts/`.

Start here: **`renders/guidelines.png`** (or open `guidelines.html`) — the one-page usage guide.
Then **`renders/brandsheet.png`**, and **`slides/slide-01.png` … `slide-05.png`** for the board.

---

## What's in the folder

### Master artwork (edit these, not the exports)
| File | What it is |
|---|---|
| `master-a.svg` | The mark, alone — production master, strokes expanded to filled outlines (audit 100/100) |
| `lockup-a-master.svg` | Horizontal lockup (mark + wordmark), black |
| `stacked-a.svg` | Stacked lockup (mark over wordmark), black |
| `wordmark-a.svg` | Wordmark only, black |
| `icon-a-master.svg` | Square tile master, black (symbol ink 176 on a 256 canvas) |

### Green / reversed
| File | What it is |
|---|---|
| `lockup-a-green.svg` | Horizontal lockup — white artwork on `#0F7A4F` |
| `stacked-a-green.svg` | Stacked lockup — white on green |
| `wordmark-a-green.svg` | Wordmark only — white on green |
| `icon-a-green.svg` | Square green tile (app icon) |
| `avatar-a-green-round.svg` | Circular avatar, crop-safe |
| `post-a-green.svg` · `card-a-green.svg` | Social post 1080×1080 · link card 1200×630 |
| `lockup-a-green-emerald.svg` · `-forest.svg` · `-vivid.svg` | Green alternates (`-vivid` uses dark ink `#062A18`) |

### `variants/` — ready-to-ship exports
Black / white / mono / green lockups, square & favicon & app-icon SVGs, the full web-icon set
(`favicon.ico`, 16/32/48/180/192/512 PNGs, `apple-touch-icon.png`, `site.webmanifest`, `head-snippet.html`),
a green-tile favicon set (`favicon-green*.png`, `favicon-green.ico`) and `apple-touch-icon-round.png`.

### `print/` — for a printer
True-vector PDFs at exact physical size: horizontal (100 mm), horizontal-green (100 mm), stacked (60 mm),
symbol (50 mm), wordmark (80 mm). Verified to contain no raster images.

### Review / presentation
`guidelines.html` · `brandsheet.html` · `greens.html` · `presentation.html` (+ `slides/*.png`).
`renders/type-options.png` records the wordmark typeface comparison that selected Plus Jakarta Sans.

### `renders/` — PNG previews of everything, including 16 px and 32 px legibility tests.

### Exploration only — not deliverables
`lockup-a.svg` · `lockup-b.svg` · `lockup-c.svg` · `a-woven-frame-v1/v2.svg` · `b-lens-tile-v1/v2.svg`
· `c-ripple-v1/v2.svg` · `preview.html` are the round-1–3 concept sketches, kept for the record. They are
**not** part of the shipped kit and still carry the earlier placeholder wordmark (their titles say so) —
ignore them when building.

### `tools/` — the builders (reproducible, not throwaway)
| Tool | Use |
|---|---|
| `make_lockup.py` | Horizontal lockup; `--ink`, `--bg`, `--pad` (even-ink padding), `--outline`, `--font-file`, `--tracking` |
| `make_stacked.py` | Stacked or wordmark-only lockup, laid out from measured ink |
| `make_tile.py` | Square tile / round avatar |
| `compose.py` | Social post / link card canvases |
| `glyphs.py` | Outline text to SVG paths with real font metrics (shared) |
| `svg_to_pdf.py` | Exact-size vector PDF via headless Chrome |
| `make_guidelines.py` | Regenerate `guidelines.html` from the source SVGs |
| `rebuild_brand.py` | **One-shot typeface swap** — rebuild every wordmark asset (SVG, PDF, PNG, pages) from one font file |

Swap the wordmark face and rebuild the whole kit in one pass:
```bash
python3 tools/rebuild_brand.py --font-file /path/to/YourFace-SemiBold.ttf --ofl /path/to/OFL.txt
```
The wordmark is the only type-dependent part, so this regenerates exactly the files that carry it and
leaves the mark, colours, clear space and minimum sizes untouched — cap heights are pinned, so only the
letterforms change. (The outlining builders need `fontTools`; the driver finds it in `/tmp/opencode/ftenv`.)

---

## Design rationale (one paragraph per key decision)

**The mark.** The brief's three adjectives pull in different directions — *precise and intelligent*,
*calm and trustworthy*, *human and approachable*. A single continuous thread answers all three at once:
continuity reads as calm and trustworthy, the woven band reads as deliberate craft (precise), and the
hand-made metaphor supplies the human warmth, while the **A** in the frame keeps it a monogram rather than
decoration. It avoids every category cliché — no brain circuits, robot heads, glowing nodes or sparkles.

**Green, not blue.** The AI category is overwhelmingly blue. Green is an instant distinction and it reads
calmer than the electric blues and violets competitors use. `#0F7A4F` was chosen as the lightest green that
still passes WCAG AA for white text (5.36:1), so the primary pair needs no compromise.

**Geometry.** Everything sits on a 16-unit grid in a 256 viewBox with one corner radius (34), a 28-unit band
and 5-unit weave seams — so corners and joins stay consistent at any size. Ring centre lines at 80 and 176.

**Production form.** The final master is filled outlines, not strokes: nothing depends on a renderer's stroke
interpretation, and it is pixel-equivalent to the working stroke build (identical bbox and 19.60% coverage;
173 of 262144 pixels differ, antialiasing only).

**Lockups.** Horizontal for headers, stacked for square-ish spaces (avatars, print corners), wordmark-only
where the mark is already present, symbol-only for favicons and app icons. Every colour lockup pads the ink
evenly (measured, not eyeballed).

---

## Verification performed

- All **36** SVGs parse as valid XML.
- `master-a.svg` audit **100/100**; lockups **97–99/100** — the only deductions are coordinate precision
  and anchor count, both expected for an outlined wordmark.
- Green values confirmed by pixel-sampling the renders, not by trust.
- Wordmark outlined from **Plus Jakarta Sans SemiBold** using the font's real advance widths, with the cap
  height pinned to the previous optical size (88.85 horizontal / 81.44 stacked) so only the letterforms
  changed — verified: symbol ink stays exactly 176.0 units tall in every horizontal lockup.
- Contrast ratios computed from WCAG relative luminance (formula, not eyeballed).
- Print PDFs confirmed vector (`/Subtype /Image` count = 0) at the intended MediaBox sizes.
- Renders verified to contain content numerically (ink coverage, exact-colour pixel counts, content bounds).

---

## Open items before launch

1. **Wordmark typeface** — settled: **Plus Jakarta Sans SemiBold** (SIL OFL), outlined to paths so the files
   need no fonts installed. Swap it with `tools/rebuild_brand.py` if the identity is ever refreshed.
2. **Pantone / CMYK** — the values in the guidelines are a starting point and an approximate nearest match,
   **not** certified. Confirm on a physical chip and a proofed sheet.
3. **Tagline** — the one on the presentation board is a placeholder.
4. **Trademark** — search the name and the mark before launch.

## Honest limitations

- The design judgement is **numeric** only: renders were checked by pixel metrics, contrast maths and geometry.
  No one (including the assistant) visually reviewed the artwork in this session.
- The wordmark face (**Plus Jakarta Sans**) is licensed under the **SIL Open Font License 1.1** — free for
  commercial use, and the licence text ships in `fonts/`. The OFL permits logos made with the font;
  redistributing the font file requires including that licence, which this kit does.
