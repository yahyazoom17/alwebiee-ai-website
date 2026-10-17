# Alwebiee — logo brief (working)

**Name:** Alwebiee  ·  **What:** AI startup  ·  **Audience:** mixed (buyers + technical users)
**Adjectives:** precise & intelligent · calm & trustworthy · human & approachable
**Mark type:** abstract symbol (social/avatar first: must read at 16 px, one colour, square crop)
**Colour chosen:** green background with white symbol + wordmark (chosen at the checkpoint)
**Direction chosen:** Concept A — The Woven Frame
*Assumption:* no existing equity; name carries "AI + web/weave" flavour; wordmark type is Plus Jakarta Sans SemiBold (SIL OFL), outlined to paths.

## Category clichés (off-limits unless genuinely reframed)
brain outlines · neural nodes & dots-with-lines · sparkles ✨ · circuit traces · hexagons ·
purple/blue gradients & glows · upward arrows · shields · globes · infinity loops · chat bubbles.

## Longlist (one-liners) — scored: idea clarity / distinction / simplicity / relevance / small-size
1. **The Woven Frame** — two rounded hooks interlace into a square frame with a true over-under weave. `5·5·4·5·4 = 23`
2. **The Lens Tile** — a solid soft-square with one clear lens of negative space cut through it. `4·4·5·4·5 = 22`
3. **The Settled Ripple** — a dot and two rings cut by a single aligned slit: calm resonance. `4·3·5·4·5 = 21`
4. Soft-delta "A" — a solid caret with a chevron counter. `5·3·5·4·5 = 22` *(dropped: reads as a generic caret / letterform, user asked for abstract)*
5. Interlocked "ee" rings — two linked rings. `3·2·5·4·5 = 19` *(dropped: partnership/integration cliché, no ownable twist)*
6. Ink comet — disc with a tapered tail. `4·4·4·4·4 = 20` *(dropped: reads as a comma/balloon)*
7. Paragraph bars — stepped rounded bars. `3·1·5·3·5 = 13` *(dropped: text-icon generic)*
8. Orbit dot — ring with a clasped satellite. `3·2·5·3·5 = 18` *(dropped: orbital generic)*
9. Aperture petals — four quarter-arcs pinwheeling round a void. `3·3·4·3·3 = 16` *(dropped: reads as refresh/loading)*
10. Bee/honeycomb echo — single hex cell. `2·1·5·3·5 = 16` *(dropped: hexagons are the category convention + honeycomb is a tech trope)*

**Built:** 1 (A), 2 (B), 3 (C).

## Geometry notes (canvas 256, one-colour #111, ink bbox shown per mark)
- **A Woven Frame** (`a-woven-frame-v3.svg`) — two threads on one rounded-square frame, true over/under weave
  at TL and BR (rotational, so BR is free). Centre lines 80/176, corner r 34, **stroke 28** (half 14), thread
  ends poke 31 past the join, under-thread cut with a 5-unit seam; butt caps. Ink bbox 187×187, margins 35.
  180° symmetry 100 %, mirror 73.7 % (intentional — the weave breaks it), ink 19.5 %. Audit 99/100.
- **B Lens Tile** (`b-lens-tile-v2.svg`) — solid squircle 34→222 (r 63) with one lens window knocked out
  (two r-65 arcs, 80 wide × 120 tall, `evenodd`). Ink bbox 189×189, margins 34. 4-fold symmetry 100 %/100 %,
  ink 38.1 %. Audit 100/100, no issues. *(recommended)*
- **C Settled Ripple** (`c-ripple-v2.svg`) — centre disc r 27 + one ring r 88 (**stroke 26**) split by two
  aligned 36-unit gaps (≈23.5° each) on the vertical axis. Ink bbox 176×172, margins ≈41. Mirror 100 %,
  180° 99.9 %, ink 17.7 %. Audit 99/100.

All three were rendered at 16 px and 32 px on white and checked by nearest-neighbour upscale: each survives
16 px (A reads as a square with two notches, B as a tile with a clear lens window, C as a split ring + dot).
Stroke-based marks (A, C) carry an audit INFO to expand strokes to filled outlines in the production master.

## Lockups (wordmark outlined from Plus Jakarta Sans SemiBold)
`lockup-a-master.svg` (black) and `lockup-a-green*.svg` (white on green). Symbol ink scaled to 176 tall and
centred in a 200-unit slot at x = 100; wordmark cap-height centred on the symbol's centre (cap 88.85 units →
font-size 119.26, tracking −1.99). The wordmark is **Plus Jakarta Sans SemiBold outlined to paths** (SIL OFL;
the font and its licence ship in `fonts/`), so the files need no fonts installed. Only the wordmark is
type-dependent — `tools/rebuild_brand.py` regenerates every wordmark asset from one font file in a single pass.
`lockup-a-master.svg` = 788×256; the green versions add 48 units of padding on each side.

## Colour decision (green background, white ink)
| Name | HEX | RGB | white-text contrast |
|---|---|---|---|
| **Alwebiee Green** (recommended) | `#0F7A4F` | 15 122 79 | 5.36:1 (AA+) |
| Emerald | `#0E6B45` | 14 107 69 | 6.55:1 (AAA) |
| Forest | `#0B5F3A` | 11 95 58 | 7.74:1 (AAA) |
| Vivid (needs **dark** ink) | `#16A34A` | 22 163 74 | white fails 3.30:1; dark ink 4.71:1 |

Greyscale and one-colour versions still work (form carries the mark, not colour). Pantone/CMYK to be matched
before print. Tech is a sea of blue, so a green signature is an easy distinction win.

## Phase 7 progress — delivered (Concept A, full kit)
- **`master-a.svg`** — production master, every stroke expanded to filled outlines (audit **100/100**, no issues).
  Verified pixel-equivalent to the working stroke version (same bbox + 19.60 % coverage; 173/262144 px differ — antialiasing only).
- **Lockups (all four):** `lockup-a-master.svg` (horizontal, black), `lockup-a-green.svg` (+ `-forest` `-emerald` `-vivid`),
  `stacked-a.svg` / `stacked-a-green.svg` (symbol over wordmark, ink-measured centring),
  `wordmark-a.svg` / `wordmark-a-green.svg` (wordmark only). Symbol-only = `master-a.svg`.
- **Green tiles:** `icon-a-green.svg` (square, ink 168/256), `avatar-a-green-round.svg` (circle, ink 150/256, safe for round crops).
- **Social:** `post-a-green.svg` (1080×1080), `card-a-green.svg` (1200×630).
- **Web icons** (`variants/`): standard black/white/mono/square/favicon/app-icon SVGs, `--web-icons` set
  (favicon.ico + PNGs + webmanifest + head snippet), plus a green-tile set (`favicon-green*.png`, `favicon-green.ico`).
- **Print:** `print/*.pdf` — five true-vector PDFs at exact physical sizes (100 mm horizontal, 60 mm stacked,
  50 mm symbol, 80 mm wordmark), written by `tools/svg_to_pdf.py` (Chrome print-to-pdf; verified `/Subtype /Image` = 0).
- **Presentation board:** `presentation-spec.json` → `presentation.html` + `slides/slide-01..05.png`
  (final-design board: cover, brief, the mark, in-use mockups, notes).
- **Guidelines:** `brand-guidelines.md` + `guidelines.html` → `renders/guidelines.png` (1180×2982) —
  clear space, minimum sizes, colour table with contrast, approved pairs, do/don't, file map, open items.
- **Renders** in `renders/`; review pages `greens.html` → `renders/green-options.png`, `brandsheet.html` → `renders/brandsheet.png`.

### Colour (chosen) and print conversion
- Primary **Alwebiee Green `#0F7A4F`** (RGB 15 122 79). Naive process build **C88 M0 Y35 K52**.
  Nearest coated spot **Pantone 341 C** (alt. 3415 C) — approximate, chip-check before print.
- Contrast of white artwork: Green 5.36:1 · Emerald 6.55:1 · Forest 7.74:1 · Vivid 3.30:1 (needs dark ink `#062A18`).
- Clear space = 1 × woven band = **28 units in master = 26.5 at lockup scale ≈ 15 % of symbol height**.
- Minimum sizes: horizontal 96 px / 25 mm · stacked 80 px / 20 mm · wordmark 80 px / 20 mm · symbol 16 px / 6 mm.

### Known OPEN items (not yet done)
- Pantone/CMYK are **unverified** (no physical chip or proof) — flagged in the guidelines themselves.
- Tagline on the presentation board is a **placeholder** — needs the real one.
- Trademark search on the name and the mark before launch.
- I cannot see images; all checks are numeric (render metrics, contrast, geometry, pixel counts).
