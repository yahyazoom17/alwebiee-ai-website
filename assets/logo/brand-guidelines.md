# Alwebiee — Logo Guidelines (compact)

> One-page usage guide for non-designers. Master files live in this folder.

## 1. The logo

- **Idea**: one unbroken thread weaves a frame around an **A** — the monogram and the "human hand" share a single line.
- **Versions**: primary (horizontal) · stacked · symbol-only · wordmark-only; each in colour, one-colour black,
  one-colour white (reversed) and one-colour Alwebiee Green.
- **Files**: `*.svg` for screens and dev · `print/*.pdf` for printers · `variants/*.png` for raster use.
  **Never send the RGB screen file to a printer** — send the `print/` PDF, or the spot/Pantone spec below.

## 2. Clear space

Keep a clear zone of **1 × the woven band width** on all sides — that is **≈ 15 % of the symbol's height**
(the band is 28 units wide against 186 units of symbol). The zone **scales with the logo**: never use a fixed
pixel margin. At the horizontal lockup's natural size (788 px wide) the zone is ≈ 26 px.

Nothing enters the zone: no text, no rules, no other logos, no image edges.

## 3. Minimum size

| Version | Screen | Print |
|---|---|---|
| Horizontal lockup | **96 px wide** | **25 mm wide** |
| Stacked lockup | **80 px wide** | **20 mm wide** |
| Wordmark only | **80 px wide** | **20 mm wide** |
| Symbol only | **16 px** (use `variants/favicon-green.ico`) | **6 mm** |

Below these sizes the wordmark's joins close up. Drop the wordmark and use the symbol instead.

## 4. Colour

| Name | HEX | RGB | CMYK (process) | Pantone (nearest) |
|---|---|---|---|---|
| Alwebiee Green | `#0F7A4F` | 15 122 79 | 88 · 0 · 35 · 52 | **341 C** (alt. 3415 C) |
| Ink (text/neutral) | `#111111` | 17 17 17 | 0 · 0 · 0 · 93 | Process Black |
| White | `#FFFFFF` | 255 255 255 | 0 · 0 · 0 · 0 | — |
| Emerald (alt.) | `#0E6B45` | 14 107 69 | 87 · 0 · 36 · 58 | match on chip |
| Forest (alt.) | `#0B5F3A` | 11 95 58 | 88 · 0 · 39 · 63 | match on chip |
| Vivid (alt.) | `#16A34A` | 22 163 74 | 87 · 0 · 55 · 36 | match on chip |

> **Print honesty:** the CMYK builds are a plain RGB→CMYK conversion — a *starting point*, not a proof. The Pantone
> values are nearest-match suggestions from publicly published approximate RGB data, **not** certified PMS values.
> Confirm both against a physical Pantone chip and a proofed sheet before specifying print.

**Approved logo / background pairs**
- White symbol + wordmark on Alwebiee Green — 5.36 : 1, passes WCAG AA. **This is the primary pair.**
- Black (Ink) on white — the default for documents and invoices.
- White on Ink, and Alwebiee Green on white.
- On photos: use the white or green version over a calm area, or drop the mark into a solid Alwebiee Green square.

**Contrast reference (white artwork)** — Emerald 6.55 : 1 · Forest 7.74 : 1 · Green 5.36 : 1 · Vivid **3.30 : 1
(fails — Vivid requires dark ink `#062A18`, 4.71 : 1).**

## 5. Typography

- **Wordmark**: **Plus Jakarta Sans SemiBold** (SIL OFL), outlined to paths, so the logo files need no fonts
  installed and nothing re-typesets. The shipped font and its licence are in `fonts/`.
- **Headings**: keep one voice — use Plus Jakarta Sans Medium/SemiBold for headings too. For contrast, a neutral
  grotesque such as **Inter** pairs cleanly for body and UI text.
- **Web fallback stack**: `"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Licence**: Plus Jakarta Sans is licensed under the **SIL Open Font License 1.1** — commercial use is
  permitted, and the licence text ships in `fonts/`.

## 6. Don'ts

Don't stretch or squash · don't recolour outside the palette · don't rotate · don't add shadows, outlines,
gradients or glows · don't rearrange or resize the parts of a lockup · don't place on busy backgrounds without a
solid container · don't recreate the wordmark by typing it · don't crop the frame to make it fit.

## 7. Which file where

| Use | File |
|---|---|
| Website header, light bg | `variants/alwebiee-horizontal-black.svg` |
| Website header, dark bg | `variants/alwebiee-horizontal-white.svg` |
| Our green header/footer | `lockup-a-green.svg` |
| App icon / store listing | `variants/icon-512.png`, `variants/apple-touch-icon.png` |
| Circular social avatar | `avatar-a-green-round.svg` |
| Favicon (tab) | `variants/favicon-green.ico`, `variants/favicon.svg` |
| PWA manifest + icons | `variants/site.webmanifest`, `variants/icon-192.png`, `variants/icon-512.png` |
| Social post 1080² / link card | `post-a-green.svg`, `card-a-green.svg` |
| Print | `print/*.pdf` |

## 8. Open items

1. Pantone chip check + CMYK proof (see the print honesty note above).
2. Trademark search on the name and mark before launch.
3. Confirm the tagline before it appears anywhere public.

Questions about usage: `<your name / email>`. Master files: this folder.
