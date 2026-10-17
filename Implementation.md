# Implementation Plan — Alwebiee AI Website

Derived from `PRD.md`. Target repo: `alwebiee-website` (Next.js 16 App Router, React 19, TypeScript, Tailwind v4).

**Plan-mode note:** this file lives in `/home/yahya/.opencode/plan/Implementation.md`. To have it at the repo root as `./Implementation.md`, switch out of Plan mode (or ask) — Plan mode cannot write into the project.

---

## 0. Confirmed decisions

| # | Decision | Choice |
|---|---|---|
| 1 | CTA destination | `mailto:` driven by `src/content/site.ts` → `contact.email`. While empty, every CTA scrolls/links to `#contact`, which renders the configurable contact block. No form, no fake success state. |
| 2 | Theme | Dual light **and** dark, both art-directed, driven by `prefers-color-scheme` (zero JS, no FOUC, no hydration risk). Tokens are also expressed as `[data-theme]` overrides so an in-page toggle is a later ~10-line addition. |
| 3 | Nav destinations | Real anchors on `/` **and** real stub routes `/products`, `/solutions`, `/resources`, `/about` with substantive, honest content (no "coming soon" filler). |

---

## 1. Repo audit (verified facts)

| Item | Finding | Consequence |
|---|---|---|
| Framework | `next@16.4.2`, App Router | Must read `node_modules/next/dist/docs/` before coding (AGENTS.md). Typed routes are on (`LayoutProps<"/">` already used). |
| Runtime | `react@19.3.0` | Server Components by default; `"use client"` only where needed. |
| Language | TypeScript 5, `strict: true`, paths `@/* → ./src/*` | No `any`; `npx tsc --noEmit` as part of verification. |
| Styling | Tailwind v4 via `@tailwindcss/turbopack`; `globals.css` uses `@import "tailwindcss"` + `@theme inline` | Extend tokens in `@theme`; keep `@source not "../../.opencode"` (prevents skill markdown being parsed as utilities). |
| Config | `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, turbopack CSS rule | Keep routes fully static (no `cookies()`/`headers()`); verify build output shows static routes. |
| Lint | ESLint 9 flat config, `eslint-config-next/core-web-vitals` + `/typescript`, `.opencode/**` ignored | `npm run lint` must pass. |
| Scripts | `dev`, `build`, `start`, `lint` — **no** typecheck script | Use `npx tsc --noEmit` directly; do not invent scripts. |
| Fonts | `next/font/google` Geist + Geist_Mono → `--font-geist-sans` / `--font-geist-mono` | Reuse; no new font dependency. |
| Anim libs | None installed | CSS transitions/keyframes + IntersectionObserver only. No new dependency. |
| Brand assets | `assets/` (not served). Logos, favicons, `card-a-green.png` (1200×630), `brand-guidelines.md`, Plus Jakarta Sans TTF + OFL licence. | Copy only what must be served into `public/`; inline SVG geometry as React components (no SVGR installed). |
| Served icons | `src/app/{favicon.ico, icon.svg, apple-icon.png}`, `public/{icon-192,icon-512,maskable-512}.png`, `public/site.webmanifest` (name "Alwebiee", theme `#0F7A4F`) already exist | **User work — do not overwrite.** Only additive changes if any. |
| Uncommitted work | `eslint.config.mjs`, `src/app/favicon.ico`, `globals.css`, `layout.tsx` modified; `.opencode/` untracked | Preserve; extend rather than rewrite. Tree is clean after commit. |
| Dead template assets | `public/{next,vercel,file,globe,window}.svg`, referenced only by the default `page.tsx` | Optional cleanup once `page.tsx` is replaced (delete 5 unused SVGs). Flagged, not required. |
| Browser tooling | No browser/visual tool in this environment | Verification is lint + typecheck + build + rendered-HTML inspection via `curl`. **Never claim visual inspection.** A11y/contrast checks use `.opencode/skills/a11y-audit/scripts/` Python tools. |

---

## 2. Brand direction

### 2.1 Colours — green-forward (deliberate PRD deviation, flagged)

`PRD.md` §4 says colour follows the logo **and** suggests "controlled violet and blue glows". The logo brief (`assets/logo/brief.md`) explicitly lists *"purple/blue gradients & glows"* as forbidden category clichés and names green as the differentiator ("tech is a sea of blue"). **Decision: green-led palette.** Violet/blue is excluded; depth comes from ink, hairlines and green luminance. One-line override available if the user prefers the PRD's literal violet/blue note.

Contrast rules baked into the tokens (verify numerically with `a11y-audit/scripts/contrast_checker.py`):

- `#0F7A4F` is a **surface** colour with white ink (5.36:1 — AA). It is *not* used as small text on dark (≈2.7:1 on ink → fails).
- On dark surfaces, on-dark accent text uses a lightened signal green; on light surfaces, links use Forest `#0B5F3A` (7.74:1).
- Colour never carries meaning alone (status badges pair colour + text label; the "concept" indicator uses a glyph + word).

### 2.2 Tokens (both themes, in `globals.css`)

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FBFCFB` | `#060D0A` |
| `--bg-elev` (surface) | `#FFFFFF` | `#0B1512` |
| `--bg-inset` | `#F2F5F3` | `#0F1D18` |
| `--fg` | `#08120E` | `#E9F1ED` |
| `--fg-muted` | `#4A5C55` | `#A3B4AD` |
| `--fg-subtle` | `#6B7C75` | `#7E918A` |
| `--line` | `rgba(8,18,14,.10)` | `rgba(255,255,255,.09)` |
| `--line-strong` | `rgba(8,18,14,.18)` | `rgba(255,255,255,.16)` |
| `--brand` (fill surface) | `#0F7A4F` | `#0F7A4F` |
| `--brand-ink` (small text/link) | `#0B5F3A` | `#46D69B` |
| `--accent-2` (vivid, dark-ink only) | `#16A34A` | `#1FA96B` |
| `--glow` (radial, low alpha) | `rgba(15,122,79,.14)` | `rgba(31,169,107,.16)` |
| `color-scheme` | `light` | `dark` |

Hero accent gradient (single controlled instance, applied to selected words only):
light `#0B5F3A → #16A34A`; dark `#6FE3AF → #23B673`. Gradient text always has a solid fallback colour and decorative-only status (the plain headline remains the accessible text).

### 2.3 Typography

- **Body/UI:** Geist Sans (existing). **Labels/eyebrows/numerals/status:** Geist Mono — gives the engineered, editorial feel without a new font.
- Scale (fluid, `clamp`): display `clamp(2.5rem, 6.5vw, 5rem)` / `leading-[.95]` / `tracking-[-.03em]`; h2 `clamp(1.75rem, 3.4vw, 2.75rem)` / `-.025em`; h3 `1.125–1.375rem`; lede `clamp(1.0625rem, 1.4vw, 1.25rem)` / `1.6`; body `1rem` / `1.7`; label `0.75rem` / `.14em` tracking.
- Measure: body `max-w-[68ch]`, lede `max-w-[54ch]`.
- Optional (not required): a local display face via `next/font/local` from `assets/logo/fonts/PlusJakartaSansSemiBold.ttf` to match the wordmark. Deferred — only if the Geist display weight reads weak in polish.

### 2.4 Surfaces, layout, texture

- Radii: `8 / 12 / 16 / 20px` — **no pill buttons** (PRD §4). Cards `16px`, buttons `12px`, badges `8px`.
- Containers: `max-w-[1200px]`, gutters `20px` mobile → `32px` tablet → `48px` desktop.
- Section rhythm: `py-[clamp(4.5rem,9vw,9rem)]`; hairline `border-top` separators between major bands instead of card piles.
- Texture: `GridBackdrop` — layered CSS gradients (1px grid, radial green glow) masked with `radial-gradient(...transparent)` and `aria-hidden`. No image, no webgl, no third-party embed.
- Shadows: `0 1px 2px rgba(0,0,0,.04)` resting, `0 12px 32px -16px var(--glow)` on hover only.

---

## 3. Hero centrepiece — "The Lattice"

Brand-derived, not generic AI art: the geometry echoes the Woven Frame mark (rounded-square frame + two woven threads) and the Settled Ripple concept (rings + slit), so the hero is literally the logo's system, scaled up.

- Single inline SVG, `viewBox="0 0 640 640"`, `aria-hidden="true"`, ~6 KB of markup.
- Elements: rounded-square frame hairline; two concentric ring arcs with aligned gaps; two woven threads (one solid, one 45% opacity) in `--brand`/`--brand-ink`; 6 nodes on intersections, 2 highlighted with soft radial glow; faint lattice of 1px lines.
- Motion: two `stroke-dashoffset` pulses (10s / 14s linear) + node glow pulse (6s). All animations disabled under `prefers-reduced-motion: reduce`; the static frame is the complete composition (no layout shift, no clipping).
- Sized `w-full max-w-[560px]`, `aspect-square`; on `<lg` it stacks below the copy. Scales without clipping at 320px.

---

## 4. Content model (content ≠ presentation)

```
src/content/
  site.ts            // name, tagline, description, url(env|null), contact{email,label,subject},
                     // socials[] (empty by default → footer renders nothing), nav[], cta labels,
                     // statusLabels, legalNote
  products.ts        // 6 focus areas: { id, title, blurb, detail, icon }
  innovation.ts      // 3 lab items: { id, category, title, description, status: "Concept",
                     //   visual: "app" | "automation" | "infra", note }
  approach.ts        // 4 principles: { step, title, description, detail }
  differentiators.ts // 5 themes: { title, description } + editorial statement
  resources.ts       // 4 categories: { title, description, icon, href: null } + honest empty-state copy
  nav.ts             // single source for header, footer, sitemap
```

Rules encoded here, per PRD §2/§5:

- No customers, partners, funding, awards, testimonials, user counts or performance stats anywhere.
- `innovation.ts` items are labelled `Concept` with a standing disclaimer: *"Directions from our lab. Illustrative of our work, not shipped products."*
- `resources.ts` ships an explicit honest state: nothing is published yet, and links are `null` → rendered as descriptive text, never as dead buttons.
- `socials: []` by default (no invented URLs). Footer renders only configured entries.
- `contact.email === ""` → `getContactHref()` returns `/#contact`; a real address flips every CTA to `mailto:` (single switch).

---

## 5. File plan

### 5.1 New

| Path | Kind | Purpose |
|---|---|---|
| `src/components/layout/site-header.tsx` | client | Sticky header: wordmark, nav, CTA, mobile disclosure menu, scroll-state hairline, `aria-current` on routes. |
| `src/components/layout/site-footer.tsx` | server | Brand block, nav columns, contact, dynamic year, closing line. |
| `src/components/brand/logo.tsx` | server | Inline symbol + wordmark, `currentColor`, accessible name. |
| `src/components/brand/mark.tsx` | server | Symbol only (footer, 404, small surfaces). |
| `src/components/ui/container.tsx` | server | Width/gutter primitive. |
| `src/components/ui/section.tsx` | server | `<section id>` + eyebrow + heading + lede + `scroll-mt`, heading-level prop. |
| `src/components/ui/button-link.tsx` | server | `primary` / `secondary` / `ghost` variants; internal vs external vs `mailto:` handling; focus ring. |
| `src/components/ui/card.tsx` | server | Border/hover/glow surface used by capability + lab + resource grids. |
| `src/components/ui/status-badge.tsx` | server | Colour + glyph + text (never colour alone). |
| `src/components/ui/eyebrow.tsx` | server | Mono uppercase label with dot marker. |
| `src/components/ui/reveal.tsx` | client | IntersectionObserver reveal; `data-reveal` set only after mount (no-JS ⇒ visible); reduced-motion ⇒ no-op. |
| `src/components/ui/grid-backdrop.tsx` | server | Decorative grid/glow layer. |
| `src/components/ui/icons.tsx` | server | 6 custom 24px line icons + arrow/check/plus glyphs, one coherent stroke system derived from the frame motif. |
| `src/components/visuals/hero-lattice.tsx` | server | The hero SVG. |
| `src/components/visuals/mini-system.tsx` | server | Three miniature system illustrations for the lab cards (app shell / flow graph / stack+terminal), CSS-animated on hover only. |
| `src/components/sections/{hero,brand-intro,capabilities,innovation-lab,approach,differentiators,resources,final-cta}.tsx` | server | One component per PRD section A–I. |
| `src/app/products/page.tsx`, `src/app/solutions/page.tsx`, `src/app/resources/page.tsx`, `src/app/about/page.tsx` | server | Stub routes with real content (see §7). |
| `src/app/not-found.tsx` | server | Branded 404 using the shared shell. |
| `src/app/sitemap.ts`, `src/app/robots.ts` | server | Route-derived; no invented domain (uses `NEXT_PUBLIC_SITE_URL` when set). |
| `src/content/*.ts` | data | §4. |
| `public/og.png` | asset | Copy of `assets/logo/renders/card-a-green.png` (1200×630, real brand asset). |
| `public/brand/wordmark-*.svg` (optional) | asset | Only if a non-recordable logo instance is needed (e.g. email/OG contexts). |

### 5.2 Edited

| Path | Change |
|---|---|
| `src/app/globals.css` | Extend `@theme` with brand tokens; dual-theme `:root` + media query + `[data-theme]` hooks; base typography; `scroll-behavior` gated on motion preference; `scroll-margin-top` for `[id]`; `overflow-x: clip` guard; focus-visible ring; `.reveal` + keyframes; `@source not "../../.opencode"` retained. |
| `src/app/layout.tsx` | Full `Metadata` (title template, description, OG, Twitter, robots, canonical only if `NEXT_PUBLIC_SITE_URL`), `viewport.themeColor` per scheme, skip link, header/main/footer shell, keep Geist wiring + `LayoutProps<"/">`. |
| `src/app/page.tsx` | Compose the eight sections in PRD order (replaces the create-next-app default). |
| `src/app/icon.svg` / favicon / apple-icon / `public/site.webmanifest` | **Untouched** unless additive (e.g. `short_name`, `description`). |
| `README.md` | Add short "Project structure / configuration / scripts" section. |
| `next.config.ts` | Unchanged unless a real need appears (no new deps planned). |

### 5.3 Not doing

No new npm dependencies. No animation library. No CSS-in-JS. No image APIs or remote images. No backend, no contact backend, no analytics. No `"use client"` on section components.

---

## 6. Section-by-section spec

Anchors: `#about`, `#products`, `#innovation`, `#solutions` (wrapper) → `#approach`, `#why`, `#resources`, `#contact`.

**A. Header** — sticky, translucent surface after scroll (IntersectionObserver sentinel at page top, no scroll listener). Symbol + "Alwebiee" wordmark (`currentColor`). Nav: Products → `/#products`, Solutions → `/#solutions`, Resources → `/#resources`, About → `/#about`. CTA "Let's Build Together" → `getContactHref()`. Mobile: disclosure button (`aria-expanded`, `aria-controls`), Escape/outside-click closes, focus moves to first item, `html.nav-open { overflow: hidden }`, closes on route change. Visible 2px focus ring on every control.

**B. Hero** — eyebrow `BUILDING THE NEXT LAYER OF AI` (mono, dot marker); H1 "Engineering What's Next." (gradient on "What's Next." only); lede: "We build AI tools, intelligent automations, and the infrastructure that turns ambitious ideas into real-world possibilities."; CTAs "Explore What We Build" (→ `#products`) and "Let's Work Together" (→ contact); domain strip: AI Products · Intelligent Automation · AI Infrastructure · Agents (text only — no invented metrics or logos); `HeroLattice` right column. Entrance: single staggered fade/translate via CSS keyframes, disabled under reduced motion.

**C. Brand Introduction** (`#about`) — editorial two-column: h2 "AI is more than a tool. It's a new foundation." + 2 short paragraphs (practical/accessible/powerful framing; no hype). Asymmetric rhythm: heading col 5, copy col 6 with offset, hairline above.

**D. What We Build** (`#products`) — h2 + intro; 6 focus areas from `products.ts`. Deliberate non-uniform grid: 2 feature cards (span 2 cols) + 4 standard, hover = hairline brighten + icon shift + faint glow, whole card is one link to `/products`. Each card: custom icon, title, blurb, "Focus area" micro-label. Explicit section footnote: these are areas of work, not launched products.

**E. Innovation Lab** (`#innovation`) — h2 "From ambitious ideas to intelligent systems."; intro stating this is an illustrative lab; 3 rows (alternating text/visual), not a card row: category label, title, description, `StatusBadge` "Concept", mini system illustration. Data-driven from `innovation.ts` so real projects drop in later. `/products` also renders this list.

**F. How We Work** (`#approach`, inside `#solutions`) — h2 "Built with intent. Engineered for impact."; 4 principles as a numbered connected sequence: a vertical/horizontal rail with a 1px connector line through the step numerals (01–04), each with title + description. Connector turns green progressively on hover/focus-within (CSS only).

**G. Why Alwebiee AI** (`#why`, inside `#solutions`) — visually distinct: no cards. Oversized editorial statement in the left 7 columns ("We optimise for systems that keep working after the demo.") and 5 supporting principles as a hairline-separated list in the right 5 columns, mono numerals. All claims are process claims, not performance claims.

**H. Resources & Community** (`#resources`) — h2 "Resources for the builders."; 4 categories (Developer guides, AI experiments, Engineering insights, Tools & utilities) as hairline list rows with icons; honest empty state: "Nothing published yet — this is where it will live." Rows are non-interactive text until a real `href` is configured; no fake downloads.

**I. Final CTA** (`#contact`) — h2 "Have an idea worth building?"; copy "Let's explore how AI, automation, and intelligent systems can bring it to life."; primary "Start a Conversation" → mailto when configured, else a labelled contact block that states an address is not yet configured (visible only pre-configuration) — never a fake success state. One hairline panel, generous whitespace, no form (no backend exists).

**J. Footer** — brand mark + wordmark, one-line description, nav columns (Company / Products / Resources), contact destination, socials (only if configured), `© {currentYear} Alwebiee AI` (server-rendered year), closing "Building what's next."

---

## 7. Stub routes (real content, no filler)

Shared shell from `layout.tsx`; each page gets its own metadata (title/description/canonical) and a breadcrumb-style eyebrow + H1, then substantive composition reusing primitives:

| Route | Content | Reuses |
|---|---|---|
| `/products` | Six focus areas expanded (title, blurb + `detail`, icon) laid out as editorial rows; the Innovation Lab list; honest "areas of work" note. | `products.ts`, `innovation.ts`, `Card`, `Section` |
| `/solutions` | The four engineering principles expanded + the five differentiators + how an engagement typically starts (honest, process-only) + CTA. | `approach.ts`, `differentiators.ts` |
| `/resources` | The four categories with per-category description and the explicit "nothing published yet, here's what's planned" state. | `resources.ts` |
| `/about` | Mission, positioning, audience, and the operating principles; the Brand Introduction copy expanded. | `site.ts`, `differentiators.ts` |

All current PRD sections stay on `/`. Every stub page includes the final CTA band so no route is a dead end. No "coming soon" strings; `not-found.tsx` covers the rest.

---

## 8. Motion, accessibility, SEO, performance

**Motion** — CSS transitions/keyframes only: link/button colour+border, card hover (transform ≤2px + glow + hairline), 01–04 rail progression, `Reveal` stagger (12px / 420ms `cubic-bezier(.22,.61,.36,1)`), hero lattice pulses, header hairline on scroll. Global `@media (prefers-reduced-motion: reduce)` kills all animation/transition and forces revealed state. No scroll hijacking, no cursor tracking, no parallax. Every interactive element does something real; nothing looks clickable without a destination.

**Accessibility (WCAG 2.2 AA targets)** — skip link; one `h1` per route; logical `h2/h3`; `<header>/<nav aria-label>/<main>/<footer>`; `aria-current`; `aria-expanded`/`aria-controls` on the menu; Escape/outside-click/focus return; visible focus ring ≥3:1; all decorative SVG `aria-hidden` with `focusable="false"`; contrast verified per theme with `contrast_checker.py`; 44px min touch targets; no colour-only meaning; `id="main"` target is focusable (`tabIndex={-1}`); text zoom to 200% without loss.

**SEO** — `metadataBase` from `NEXT_PUBLIC_SITE_URL` (canonical emitted only when set); `title.template`; OG (`og.png`, real brand asset) + `twitter.summary_large_image`; `robots.ts` + `sitemap.ts` from `nav.ts`; `viewport.themeColor` (`#FBFCFB` / `#060D0A`); Organization JSON-LD limited to name/description/logo/url-if-configured (no invented data); existing icon files reused.

**Performance budget** — static routes; only 2 client components (`site-header`, `reveal`) ≈ <10 KB gzip JS total; no images above the fold other than the inline SVG; `next/image` reserved for `/og.png` usage only (no raster hero); no layout shift (fixed `aspect-*` on the lattice and mini illustrations); no polling/timers beyond CSS; zero third-party embeds; all `public/` references resolve (dead template SVGs removed).

---

## 9. Responsive matrix

| Breakpoint | Behaviour |
|---|---|
| 320–375 | Single column; H1 `clamp` floor 2.5rem; hero visual below copy at `max-w-[320px]`, no clipping; header collapses to menu; 1-col cards; `Resource` rows stack. |
| 390–430 | Same, larger gutters; capability cards 1-col; CTA buttons full-width. |
| 640–1023 | Nav collapses <760px; capability grid 2-col with 2 feature cards spanning full width; lab rows go 1-col with visual above text. |
| 1024–1439 | Full nav; hero 7/5 split; capability 3-col (features span 2+1); lab rows alternate side; approach rail horizontal. |
| 1440+ | Content capped at 1200px, extra whitespace; hero visual max 560px; no font-size runaway (clamps capped). |

Guards: `overflow-x: clip` on `body`; `min-w-0` on flex/grid children; `break-words` on headings' containers; test at 320/375/430/768/1024/1280/1536.

---

## 10. Phases & tasks

**Phase 0 — Ground truth.** Read `node_modules/next/dist/docs/`: `01-app/01-getting-started/{12-images,13-fonts,14-metadata-and-og-images,05-server-and-client-components,11-css}.md`, `01-app/02-guides/ai-agents.md`; note deprecations. Confirm no `[id]`/scroll-behavior conflicts.

**Phase 1 — Foundation.** `globals.css` tokens (light+dark) + base type + focus ring + reveal keyframes + motion guards; verify no Tailwind utility regressions from the `.opencode` source exclusion. Extend `layout.tsx` to the shell (skip link, header, main, footer placeholder, metadata skeleton).

**Phase 2 — Primitives.** container, section, button-link, card, badge, eyebrow, reveal, backdrop, icons, logo/mark. Acceptance: each works in both themes, keyboard focusable where interactive, no console warnings.

**Phase 3 — Content.** `site.ts`, `nav.ts`, `products.ts`, `innovation.ts`, `approach.ts`, `differentiators.ts`, `resources.ts` with final copy; `getContactHref()` helper.

**Phase 4 — Header & footer.** Scroll hairline, mobile menu a11y (Escape/outside/focus/scroll-lock/route-close), `aria-current`, footer with dynamic year.

**Phase 5 — Home sections.** Hero + lattice first, then about → products → innovation → approach → differentiators → resources → contact, wiring `Reveal` per section and keeping section components server-only.

**Phase 6 — Stub routes + 404.** Content per §7, per-route metadata, shared shell, no dead ends.

**Phase 7 — SEO & assets.** `og.png`, metadata, JSON-LD, robots, sitemap, optional manifest add-ons; remove 5 unused template SVGs.

**Phase 8 — Verify (evidence-based).**
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build` — expect all routes static, zero warnings introduced
4. `npm run dev` + `curl` on `/`, `/products`, `/solutions`, `/resources`, `/about`, `/does-not-exist` — assert section ids, headings, `lang`, skip link, no `next.svg`/`vercel.svg` references, no 404 asset requests, expected 200/404 codes
5. Contrast/aria checks with `a11y-audit` scripts (`contrast_checker.py` on the token pairs; `a11y_scanner.py` on rendered HTML if applicable), fix all findings
6. Grep for banned words (`placeholder`, `lorem`, `coming soon`, `TODO`) and for invented credentials (stats, `%`, "customers", "trusted by")

**Phase 9 — Polish.** Rhythm/spacing pass, hero composition at 320/768/1440, hover/focus consistency, dark+light parity, README config docs, then re-run Phase 8 in full.

---

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| `next/font/google` needs network at build | Geist is already wired/cached; if a build fails offline, fall back to `next/font/local` using `assets/logo/fonts/PlusJakartaSansSemiBold.ttf` (+ Geist files if present) and document it. |
| PRD colour note (violet/blue) vs brand green + logo brief ban list | Green-led, documented deviation; single switch to revisit. |
| Dual theme doubles QA surface | All colour via tokens only (no hardcoded hex in components); each phase-8 run checks both schemes; token pairs contrast-verified once. |
| Stub routes degrade into filler | Each page carries expanded PRD-derived content with a real purpose; banned-word grep in Phase 8. |
| Inlined SVG path weight (wordmark ≈3.8 KB) | Inline once via `logo.tsx`; reused by header/footer/pages; no duplication in bundle. |
| Hydration/FOUC from reveal + header | No `Date`/random on the client, year is server-rendered; reveal is opt-in post-mount; nav state via classes, not inline styles; `suppressHydrationWarning` not needed. |
| `cacheComponents`/`partialPrefetching` interactions | No dynamic APIs anywhere; all data is static imports; confirm "static" in build output. |
| Tailwind v4 emits CSS from doc files | Keep `@source not "../../.opencode"` and add excludes only if a new markdown source appears. |
| No browser tool for visual review | State honestly; rely on build + HTML assertions + numeric contrast checks. |

---

## 12. Definition of done (mapped to PRD §13)

- [ ] All 10 sections (A–J) implemented and reachable on `/`, plus 4 stub routes + 404.
- [ ] Dual art-directed themes, green-led identity, one controlled gradient, zero purple/blue clichés.
- [ ] Responsive 320 → 1536 verified for overflow, wrapping, touch targets, hero scaling.
- [ ] Nav, mobile menu, anchors, route links and all CTAs resolve to real, working destinations; `mailto` activates only when configured.
- [ ] No invented customers, partners, funding, awards, testimonials, metrics, or social URLs; lab items labelled `Concept`; resources page honest about having nothing published.
- [ ] No placeholder/lorem/TODO copy anywhere; no decorative control without behaviour.
- [ ] Metadata, OG image, robots, sitemap, JSON-LD, theme colour, existing favicons intact.
- [ ] A11y checklist from §8 satisfied incl. contrast, focus, reduced motion, landmarks, heading order.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass (or pre-existing blockers documented).
- [ ] Only 2 client components; no new dependencies; `next.config.ts` unchanged; user's existing brand/icon work preserved.
- [ ] README + final response document configurable items and decisions.

---

## 13. Configurable items (hand-off surface)

| Item | Location | Default |
|---|---|---|
| Contact email (flips all CTAs to `mailto`) | `src/content/site.ts` → `contact.email` | `""` → CTAs go to `#contact` |
| Mail subject line | `site.ts` → `contact.subject` | `"Alwebiee AI — project enquiry"` |
| Canonical domain | `NEXT_PUBLIC_SITE_URL` env | unset → no canonical/sitemap host |
| Social links | `site.ts` → `socials` | `[]` (nothing rendered) |
| Nav labels/targets | `site.ts` → `nav` | PRD labels → real anchors |
| 6 focus areas / 3 lab items / 4 principles / 5 differentiators / 4 resource categories | `src/content/*.ts` | PRD copy, no invented claims |
| Resource row links | `resources.ts` → `href` | `null` → rendered as text with honest empty state |
| OG image | `public/og.png` | brand `card-a-green.png` |
| Theme toggle (deferred) | `globals.css` `[data-theme]` hooks | inactive (media-query driven) |

---

## 14. Build status

Status: **built and verified**. Every route in §5.1 and §7 exists and serves real content.

### What shipped

| Area | Artefact |
|---|---|
| Routes | `/`, `/products`, `/solutions`, `/resources`, `/about`, `/_not-found` |
| Metadata routes | `robots.txt`, `sitemap.xml`, `opengraph-image.png`, `twitter-image.png`, `icon.svg`, `apple-icon.png` |
| Home sections | hero, brand intro, capabilities, innovation lab, approach, differentiators, resources, final CTA |
| Primitives | `Container`, `Section`, `PageHeader`, `SiteHeader`, `SiteFooter`, `CurrentYear`, `Eyebrow`, `ButtonLink`, `Icon`, `StatusBadge`, `Reveal` |
| Brand | `AlwebieeLockup`, `WovenFrame` (generated from the logo geometry, `currentColor`) |
| Visuals | `HeroLattice` ("The Lattice"), `SystemDiagram` (`app` / `automation` / `infrastructure`) |
| Content | `src/content/{site,nav,products,innovation,approach,differentiators,resources,about,solutions}.ts` |

### Verification performed

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run build` | 14/14 static routes generated |
| Route status codes | `/`, `/products`, `/solutions`, `/resources`, `/about`, `/sitemap.xml`, `/robots.txt` → 200; `/does-not-exist` → 404 |
| Content assertions (custom script) | **132 pass / 0 fail** — section anchors, one `h1` per page, deep-link targets resolve, banned-string sweep, no invented credentials, exactly-one `main`, skip link first |
| Contrast sweep (both palettes, role-correct thresholds) | **all pairs pass** |
| `a11y_scanner.py` | no real findings (see false positives below) |

### Contrast thresholds used (not blanket 4.5:1)

Normal text needs 4.5:1; large text and non-text control boundaries need 3:1 (WCAG 1.4.11).
Key measured values — light: `fg` 18.5:1, `muted` 7.5:1, `subtle` 5.2:1, `brand-ink` 7.5:1,
white-on-brand 5.36:1, white-on-brand-hover 6.92:1, `control-line` 3.35:1 (worst surface).
Dark: `fg` 17.1:1, `muted` 9.1:1, `subtle` 5.9:1, `control-line` 3.89:1 (worst surface).

### Defects found and fixed during verification

1. **Hero did not match the plan.** §6B specifies H1 "Engineering What's Next." with the accent gradient on "What's Next." only, a specific lede, CTAs "Explore What We Build" then "Let's Work Together", and a four-item discipline strip. The first implementation used different copy and no gradient. **Corrected.** `Explore` is the filled primary on purpose — it always works, even before a contact channel exists.
2. **`--p-control-line` (light) failed WCAG 1.4.11.** The original `#8a968f` measures **2.99:1** against `--inset` — a near-miss. It draws the secondary-button and mobile-menu-toggle borders, so the 3:1 rule genuinely applies. Replaced with `#7c8883` → 3.35:1 on `--inset`, 3.58:1 on `--bg`, 3.68:1 on `--surface`. The dark value (`#6e7a75`, 3.89:1 worst case) was already compliant.
3. **`public/site.webmanifest` was incomplete** — no `start_url` or `short_name`, and `background_color` was brand green, which would flash green on PWA launch. Added both fields and set `background_color` to `#FBFCFB` (matches the app background); kept `theme_color` brand green.
4. **Honesty-gate noise.** `resources.ts` empty state read "no placeholder articles", which tripped the banned-string sweep on every run. Reworded to "no filler articles" — same meaning, and the gate stays meaningful.
5. **Scanner false positive in `page-header.tsx`.** A JSDoc comment containing a literal `<h1>` was counted as a second heading. Reworded the comment; the file has always had exactly one.

### Scanner false positives (verified, not defects)

- `landmark-no-main`, `landmark-no-skip-link`, `landmark-no-nav`, `heading-missing-h1` — the scanner evaluates each source file in isolation, so `layout.tsx`'s `main`/skip-link and `site-header.tsx`'s `nav` are not visible to a component file. Rendered HTML confirms: exactly one `main`, one `h1`, one `header`, one `footer`; skip link is the first focusable element and targets `#main`; all six navs carry distinct `aria-label`s.
- `color-text-over-image` — flagged `.grid-backdrop`, which is a decorative `linear-gradient` hairline pattern (`aria-hidden`, `pointer-events: none`, radially masked), not an image under text.

### Known constraints

- **The accent gradient is large-display-text only.** Its lighter stop measures 3.20:1 on `--bg`, which satisfies AA for large text but would fail the 4.5:1 body-text rule. Recorded in a comment above `.text-accent-gradient`; do not reuse it on small text or move it to an `--inset` band without re-measuring.
- **OG image uses the file convention**, not `public/og.png` as §13 predicted. `src/app/opengraph-image.png` + `twitter-image.png` (both from `assets/logo/renders/card-a-green.png`, exactly 1200×630) auto-wire metadata with content-hashed URLs and carry `.alt.txt` sidecars. This supersedes the `public/og.png` row in §13.
- **No visual verification was possible.** This environment has no browser or screenshot tooling. All checks are lint, typecheck, build, contrast arithmetic, and `curl` assertions against served HTML. Layout, spacing and motion remain unverified by eye.

### Outstanding before launch

| Priority | Item | Where |
|---|---|---|
| **Blocker** | Contact email unset → every CTA resolves to `#contact` and the final CTA shows its "Not live yet" panel instead of a `mailto:`. Set `site.contact.email` to go live. | `src/content/site.ts` |
| High | Set `NEXT_PUBLIC_SITE_URL` → activates the canonical tag, sitemap URLs and the `robots.txt` sitemap reference. Until then `sitemap.xml` is intentionally empty and Next warns `metadataBase` is unset. | env |
| Low | Five unused create-next-app SVGs remain in `public/` (`file`, `globe`, `next`, `vercel`, `window`). Confirmed unreferenced; awaiting a decision before deletion. | `public/` |
| Low | `socials` is empty, so the footer renders no social links. Add entries and they appear automatically. | `src/content/site.ts` |

## 15. Art-direction pass — composition and page graphics

Status: **applied and re-verified**. Presentation only: no file under `src/content/` was touched, no dependency was added, and the client-JS surface is unchanged (`SiteHeader` + `Reveal`).

### 15.1 Composition

- **The stitch rail is now the one structural device.** `src/components/layout/section-rail.tsx` carries the vertical thread at `lg` and the horizontal stitch below it, so every section hangs off the same thread. **`eyebrow.tsx` was deleted** and its signposts moved into the rail — this supersedes the `Eyebrow` row in §14's primitives table.
- `Section` gained `backdrop`: a full-bleed decorative layer painted as the first child of `<section>`, before `Container`, so it can reach the band edges. `overflow-hidden` is added only when a backdrop is present (without it a rotated watermark would create horizontal scroll).
- `PageHeader` gained `visual`: at `lg` the header splits into two columns (`1.15fr / 0.85fr`) and the graphic sits beside the copy instead of under it.
- `differentiators` and `approach` were restated as asymmetric editorial columns — `lg:grid-cols-12` with the list in columns 7–12, one item per row, hairline rules between. PRD §4 forbids repetitive layouts, and these two had been the same two-column grid with different words.
- `innovation-lab` plates became three offset plates (`lg:translate-y-0 / 10 / 20`) with each diagram in its own `bg-inset` band.

### 15.2 Page graphics

- `src/components/visuals/page-weave.tsx` holds four page visuals: `ProductWeave` (products), `SolutionWeave` (solutions), `ResourceWeave` (resources), `FrameOrbit` (about). Shared conventions: `viewBox="0 0 400 400"`, `aria-hidden`, `fill="none"`, `strokeWidth` 1.5, round caps/joins; paint is theme-aware via inline `style` because a `var()` in an SVG presentation attribute is unreliable; `currentColor` for structure, `var(--gradient-to)` for the accent. They deliberately **do not** reuse the hero lattice's geometry — four distinct drawings rather than one graphic pasted four times.
- `src/components/visuals/thread-field.tsx` is the inner pages' band texture, in place of repeating the home page's `grid-backdrop`: nine stitched threads at opacity 0.05–0.1, two of which carry the accent and travel. `.thread-field` supplies the placement (absolute, `inset-inline: 0`, `top: 0`, `26rem`, `pointer-events: none`) and the mask that fades it out towards the bottom.
- Wired as `backdrop` on the first content band of each inner page: products `#capabilities`, solutions `#patterns`, resources `#library`, about `#practice`.
- FinalCta carries a watermark — the mark at `opacity-[0.05]`, `26rem`, `lg`-only, inside an `aria-hidden` wrapper with a `radial-glow` in the band's lower right.
- About's mark panel keeps the semantic `WovenFrame` and adds a centred `radial-glow`; `FrameOrbit` takes the header's visual column.
- The home page's hero lattice was **trimmed rather than extended**: the orbit is now a static hairline pair.

### 15.3 Retired

| Removed | Why |
|---|---|
| `eyebrow.tsx` | signposts now live in the rail |
| `.card`, `.card::after`, `.card:hover` / `:focus-within` rules | `innovation-lab` was the last consumer |
| `--shadow-rest`, `--shadow-lift`, `--p-shadow-*`, `--radius-card` | no consumers left once `.card` went; removed from all three palettes and from `@theme inline` |
| `@keyframes lattice-drift`, `.lattice-drift` | the hero orbit is static now |
| hero primary CTA's `arrowRight` icon | the four discipline links already own that gesture — it was five arrows on one screen |

`--glow` was **kept**: both `.radial-glow` and `HeroLattice` use it.

### 15.4 Verification re-run against this revision

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run build` | 14/14 static routes |
| `verify.mjs`, rewritten for this revision | **208 pass / 0 fail** |
| Contrast sweep, both palettes, role-correct thresholds | **every pair passes** (exit 0) |
| `a11y_scanner.py` | no new findings — delta explained in §15.5 |

The assertion script grew from 132 to 208 checks. It changed because the `Eyebrow` and `.card` assertions no longer apply, and because this pass added structure worth pinning: exactly seven rails and seven rail nodes on the home page; the horizontal stitch in `approach` and nowhere else; one `400×400` page visual and one `thread-field` per inner page, each `aria-hidden` and non-focusable; the FinalCta watermark on all five pages; `.card` and `lattice-drift` absent everywhere; and the hero's arrow count (four icons, one per discipline link, none on the primary CTA).

Three things about that script are easy to get wrong later:

1. Next inlines the RSC flight payload in the same document, which roughly doubles plain substring counts. Every structural assertion slices the payload off at `self.__next_f` first.
2. The hero contains the lattice `svg` *and* four arrow icons, so "four arrows" is asserted as `viewBox="0 0 24 24"` occurrences rather than `<svg` occurrences.
3. `ThreadField` puts `aria-hidden` on the `svg` itself, not on a wrapper div, so the guard is asserted against the `svg`.

### 15.5 Accessibility scanner delta — explained, not waved away

Findings went 102 → 108. The whole difference is three rules × two files, and all of it is the scanner's documented per-file false positive:

- **+3 files scanned** — `section-rail.tsx`, `page-weave.tsx`, `thread-field.tsx` each attract `landmark-no-main`, `landmark-no-nav` and `landmark-no-skip-link`, because the scanner evaluates every file as if it were a complete page.
- **−1 file** — `eyebrow.tsx` was deleted, taking its three findings with it.
- Net: +2 files × 3 rules = +6 findings.

No new rule category appeared. The `heading-missing-h1` findings and the single `color-text-over-image` (the `.grid-backdrop` band, already recorded as a false positive in §14) are the same findings as before, on shifted line numbers.

### 15.6 Motion budget

| Page | rail | `stitch-h` | watermark | `radial-glow` | `lattice-node` | `mini-system-flow` | `400×400` visual | `thread-field` | `.card` | `lattice-drift` |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 7 | 1 | 1 | 2 | 4 | 5 | 0 | 0 | 0 | 0 |
| `/products` | 3 | 0 | 1 | 2 | 0 | 2 | 1 | 1 | 0 | 0 |
| `/solutions` | 3 | 0 | 1 | 2 | 1 | 2 | 1 | 1 | 0 | 0 |
| `/resources` | 3 | 0 | 1 | 2 | 1 | 2 | 1 | 1 | 0 | 0 |
| `/about` | 5 | 0 | 1 | 3 | 2 | 1 | 1 | 1 | 0 | 0 |

Every new visual animates through the two classes that already existed (`.mini-system-flow`, `.lattice-node`); no new keyframe and no new animated class was added, and no inner page is busier than the home page. All five `@keyframes` in `globals.css` sit inside the single `@media (prefers-reduced-motion: no-preference)` block (globals.css:471–547), so under `reduce` the drawings are static and still legible. The one `transition` outside that block is `.reveal[data-reveal="shown"]`; `Reveal` never sets that attribute under `reduce`, so the rule cannot fire — that guard is behavioural, not in CSS.

### 15.7 Residuals carried forward

1. **`.flow-dash` (globals.css:540–542) is now dead code.** Nothing in `src/` references the class; only `@keyframes flow-dash` is still needed, by `.mini-system-flow`. Left in place pending a decision, in the same bucket as the unused `public/` SVGs.
2. **Nothing here has been seen.** There is no browser or screenshot tooling in this environment. The graphics are verified to be present, hidden from assistive tech, non-focusable, and inside the motion budget — but whether the composition *reads* well is unverified. The reference files if something looks wrong are `src/components/visuals/system-diagram.tsx` (the paint convention the new visuals follow) and `assets/logo/brand-guidelines.md` (the mark's true geometry).
3. §14's outstanding-before-launch table is unchanged, and the contact email is still the launch blocker.

## 16. Scroll parallax and per-band reveals

Status: **applied and re-verified**. Presentation only: no file under `src/content/` was touched, no dependency was added, and the client-JS surface is still exactly `site-header.tsx` + `reveal.tsx` — this pass ships **zero new JavaScript**.

### 16.1 What moves, and what deliberately does not

| Layer | Class | Timeline | Why it is safe to move |
|---|---|---|---|
| Hero halo (`.radial-glow`) | `depth-lag` | `scroll()`, `0 → 80vh`, +2.25rem | Paints itself out to transparent at every edge |
| Hero mark (lattice wrapper) | `depth-lead` | `scroll()`, `0 → 80vh`, −2.25rem, `lg` only | The `svg` is clipped inside its own box |
| Closing band backdrop | `depth-band` | `view()`, `cover 0% → cover 55%`, +3rem | Transparent wrapper over a glow and a 5%-opacity watermark |
| Hero grid texture (`.grid-backdrop`) | *none* | — | **The reference plane.** It is the only layer with an opaque mask edge at its top, so drifting it could expose a hard seam. It stays fixed on purpose. |

Two planes at different rates (the halo settling behind, the mark leading beside it) is the mark's own idea — two threads at different depths — reused rather than a second ornament drawn.

### 16.2 The three rules that keep it honest

1. **`from` is the resting state.** Every keyframe starts at `transform: translateY(0)`, so at scroll 0 the page is bit-for-bit the composition it has without this block. Nothing about the layout depends on the animation running. This matters here specifically because the result cannot be seen in this environment (§16.5).
2. **Only layers with transparent or clipped edges move.** Anything with a painted edge stays put. That is the whole reason the grid texture is excluded and the halo is not.
3. **It is CSS-only.** A scroll timeline needs no listener, no `scroll` handler and no main-thread work; the browser interpolates on the compositor.

`transform` is used rather than the standalone `translate` property **on purpose**, and this is the trap in this codebase: Tailwind v4 compiles `-translate-x-1/2` (which the hero glow carries) to the standalone `translate` property, not to `transform`. A keyframe animating `translate` would clobber that centring; animating `transform` composes with it, so the halo stays exactly where it was placed while still drifting vertically. Verified in the compiled CSS: `.depth-lag` animates `transform` while `--tw-translate-x` remains `-50%`.

### 16.2.1 The entrance animations

The four home bands that previously entered with no motion now each wrap their content in one `Reveal`: `capabilities` (one gesture around both lists), `innovation-lab`, `approach` (the steps and the stitch they hang from move as one object — they are one idea), and `resources` (the matrix and its note, one thought). That is **one gesture per band, not one per cell**: a dozen independently firing cards reads as a screensaver, and the resources cells are separated by a 1px gap the container shows through, which per-cell animating would make flicker.

`Reveal` was reused rather than a second CSS mechanism because it already degrades correctly: the server renders the visible state, so with JavaScript off or before hydration the content is simply there.

### 16.3 The guards, and the failure mode when they do not apply

Every rule lives inside **two** nested gates:

```
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) { … }
}
```

- **Reduced motion** — with `reduce` set, none of these declarations exist. Verified mechanically against the compiled stylesheet: every `depth-lag` / `depth-lead` / `depth-band` occurrence sits inside the reduced-motion block, and none outside it.
- **`@supports`** — if the browser has no scroll-driven animations (Safari 17, Firefox ≤ 138 today), the declaration is dropped and the page is exactly what it was before this pass: fully composed and completely static. **Nothing is hidden, nothing is stuck, nothing depends on the animation.** That is the intended failure mode, and it is why the timeline was used at all rather than a JS scroll listener that would have to be feature-detected, budgeted, and disabled for reduced motion by hand.

Related, and shipped in the same edit: `.reveal[data-reveal="pending"]:focus-within { opacity: 1; transform: none; }`. A block still marked `pending` is invisible until the observer fires; a keyboard user tabbing into its first link must not land on invisible content (WCAG 2.4.7). Focus reveals it immediately, with no transition delay.

### 16.4 PRD tension — flagged, not buried

`PRD.md:342` asks for **"subtle reveal animations for _selected_ sections"**, and `PRD.md:117` lists "constant animations, distracting backgrounds" under Avoid. This pass now gives an entrance to every home band, and the parallax is present on all five pages (the closing band is a shared component, so `depth-band` applies wherever `FinalCta` renders). Two honest readings:

- **Defensible:** these are *entrances*, not constant motion — each plays once and settles; the accepted count of always-on animations is unchanged (`lattice-node` and `mini-system-flow` only), and the parallax is disabled under reduced motion and absent where unsupported.
- **Contra:** "every band" is the opposite of "selected sections".

**If the second reading is the intended one, the revert is two edits:** delete the four `<Reveal>` wrappers named in §16.2.1, and delete the parallax block. Neither the layout nor the content depends on either.

### 16.5 Verification re-run against this revision

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run build` | 14/14 static routes |
| `verify.mjs`, unchanged | **208 pass / 0 fail** |
| Contrast sweep, both palettes, role-correct thresholds | **every pair passes** (exit 0) — no colour was touched |
| `a11y_scanner.py` | **108 findings — identical to §15.5**, same per-rule profile |
| Compiled CSS | `depth-lag` / `depth-lead` / `depth-band` present, all inside both gates |
| Served DOM | hero halo carries `depth-lag`; hero mark wrapper carries `depth-lead`; closing backdrop carries `depth-band`; `.grid-backdrop` carries no depth class; 8 `.reveal` wrappers on `/`, each parented by a `div` (none inside a `ul`/`ol`) |

The a11y count did not move because this pass added no files — the three landmark rules that skew the scanner are charged per file, which is the same false positive §14 and §15.5 already document.

### 16.6 What is still unverified

**Nothing here has been seen.** There is still no browser or screenshot tooling in this environment, so what is verified is that the animation rules exist, are correctly gated, and start from the resting composition — *not* that the depth reads well or that the drift distance is tasteful. The first thing to check in a real browser is scroll 0 (must be pixel-identical to the pre-pass composition) and the `lg` boundary (the mark must stop moving below 1024px, where it sits directly under the copy). If the effect is too strong, `--depth` is a single custom property: `2.25rem` for the hero, `3rem` for the closing band.

The follow-ups from §15.4 are unchanged: `.flow-dash`'s dead selector and the five unused `public/` SVGs are still awaiting a decision, `socials` is still empty (the footer renders nothing without it), and `site.contact.email` is still the launch blocker.

