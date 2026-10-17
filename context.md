# Task Context: Alwebiee site — art-direction enhancement pass

Session ID: 2026-10-17-design-enhancement
Created: 2026-10-17
Status: in_progress

## Current Request

"Use all your skills @frontend-design and enhance the same website."

The site was already built and verified (see `Implementation.md` §14). This pass raises its
art direction. Approval given for the **full pass** with **Plus Jakarta Sans headings +
Geist body**.

## Context Files (Standards to Follow)

ContextScout found **no `.opencode/context/` standards root**. The governing standards are
project docs instead:

- `PRD.md` — the brief. Explicit art-direction rules that this pass must satisfy:
  - §4 L106 "Refined rounded corners rather than excessive pill-shaped containers"
  - §4 L114 "Avoid: Excessive cards and repetitive layouts"
  - §4 L118 "Avoid: Template-like layouts without a clear visual hierarchy"
  - §4 L120 "intentionally art-directed, not automatically assembled"
  - §4 L105 "Subtle grid patterns or technical textures" (sanctioned — keeps .grid-backdrop)
  - §5B L175 "A carefully controlled accent gradient on selected words" (MANDATORY — hero
    gradient STAYS)
  - §5D L222 "a deliberate visual system with custom icons, **varied card compositions**,
    interactive hover states, and restrained animations"
  - §5F L265 "Use a connected visual sequence, numbered steps, or another original layout"
  - §5G L281 "Make this section visually different from the earlier card grids. Use editorial
    typography, asymmetric layout, or a strong statement paired with supporting principles"
  - §6 L341 "Refined card hover states"; §6 L342 "Subtle reveal animations for **selected**
    sections"
  - §4 L117 "Avoid: Constant animations, distracting backgrounds, oversized decorative graphics"
  - §7 L372 "Use next/font or an already configured local font where appropriate"
  - §9 L438 "Do not use color alone to communicate important information"
- `Implementation.md` — engineering standards established for this repo:
  - Tokens live in `globals.css` and nowhere else. **No component uses a `dark:` variant** —
    all theming flows through semantic tokens via `@theme inline`.
  - Server Components by default; `"use client"` only for real behaviour.
  - WCAG 2.2 AA. Contrast is *measured*, never eyeballed.
  - No new dependencies. Minimal client JS.
  - Verification protocol: `tsc --noEmit` → `lint` → `build` → `curl` route assertions →
    contrast arithmetic → a11y scan. No visual inspection is possible in this environment.
- `AGENTS.md` — this Next.js version differs from training data; read
  `node_modules/next/dist/docs/` before writing code.
- `assets/logo/brand-guidelines.md` — brand colours, clear space, Plus Jakarta Sans wordmark.

## Reference Files (Source Material to Look At)

- `src/app/globals.css` — tokens, `@theme inline`, `@layer components`, motion block (491 lines)
- `src/components/layout/section.tsx` — the section shell to be re-laid-out
- `src/components/ui/eyebrow.tsx` — becomes the stitch rail label
- `src/components/ui/reveal.tsx` — scroll reveal, to be applied more sparingly
- `src/components/ui/button-link.tsx`, `ui/icons.tsx` — CTA + glyph vocabulary
- `src/components/sections/*.tsx` (8) — the composition work
- `src/app/{products,solutions,resources,about}/page.tsx` — inner-route compositions
- `src/components/visuals/hero-lattice.tsx`, `system-diagram.tsx` — motion trim
- `src/content/*.ts` — read-only this pass

## External Docs Fetched

None needed — no new dependency. `next/font` is already in use (Geist).

## Components

1. **Type foundation** — Plus Jakarta Sans as `--font-display` (headings + labels); Geist
   retained for body/UI; Geist Mono retired once labels stop being mono.
2. **The stitch rail** — the one memorable device. On `lg`, each section gains a narrow left
   rail holding a vertical stitched hairline with a node at the section label. Collapses to a
   short horizontal stitch beside the label on small screens. Encodes the brand's one idea
   (two woven threads) into the page's structure.
3. **Varied compositions** — featured panels + editorial lists replacing the uniform card grid
   across capabilities, resources, solutions, why, approach, innovation lab and the products page.
4. **Motion restraint** — hero keeps its single orchestrated load; reveals limited to ~3
   sections; card glow wash deleted; lattice loops trimmed.
5. **Detail** — trailing arrows removed from primary CTAs; mobile nav links get hover/focus.

## Constraints

- The hero accent gradient is **brief-mandated** (PRD §5B L175) and stays.
- No new dependencies, no added client JS, no `dark:` variants, no hardcoded colours outside
  the palette block.
- Contrast must be re-measured after any change to text colour, weight or size.
- `.grid-backdrop` is brief-sanctioned (§4 L105) and stays.
- No visual verification is possible here; layout and motion remain unverified by eye.

## Exit Criteria

- [ ] Type foundation live: Plus Jakarta Sans headings, Geist body, Geist Mono retired
- [ ] Stitch rail present on `lg` and collapsed sensibly below it, on home and all 4 routes
- [ ] No two section types share the same composition; cards no longer uniform
- [ ] Reveals limited to selected sections only
- [ ] Card glow wash gone; hover refined
- [ ] `tsc --noEmit`, `lint`, `build` all clean; all routes still 200 / 404 as before
- [ ] Contrast re-swept: every pair still passes in both themes
- [ ] a11y scan: no new findings beyond the documented false positives
- [ ] Assertion suite re-run and updated honestly
- [ ] `Implementation.md` §15 written

## Execution Note

The change chain is strictly sequential — every component depends on the type tokens and the
rail primitive landing first. Parallel CoderAgent fan-out would produce aesthetic incoherence,
so this is executed as single-task batches with verification after each step.
