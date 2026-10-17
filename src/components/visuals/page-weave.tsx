import type { ReactNode } from "react";

/**
 * Page-scale versions of the mark's thread logic, one per route.
 *
 * The home page opens on `HeroLattice`: the woven frame scaled up with orbit
 * rings and travelling seams. Every other route opened on text alone. These are
 * the same idea at a calmer amplitude — the mark's grammar (threads, overshoots,
 * cut seams, travelled dashes) turned into one drawing per page that says what
 * that page is about:
 *
 * - `ProductWeave`  six cells strung on one thread   → "one connected system"
 * - `SolutionWeave` two situations braiding into one → "start with the situation"
 * - `ResourceWeave` leaves bound by a single spine   → "the library"
 * - `FrameOrbit`    a plan drawing of the mark       → "the mark story"
 *
 * Conventions match `system-diagram.tsx`: theme-aware paint via inline `style`
 * (`var()` inside an SVG presentation attribute is not reliably supported),
 * `currentColor` for structure, `var(--gradient-to)` for the accent, no
 * gradients that need `id`s, and no depiction of an interface that does not
 * exist. All motion is CSS, defined only under `prefers-reduced-motion:
 * no-preference`, so these render complete and still when motion is reduced.
 *
 * `ProductWeave` and `ResourceWeave` paint their cells with `var(--bg)` so the
 * threads appear to pass under them. They expect a section on the base tone —
 * the page headers are the only place they are used.
 */

const CELL = 84;

/** The six focus areas, row by row, in canvas coordinates. */
const productCells = [
  [40, 98],
  [158, 98],
  [276, 98],
  [40, 216],
  [158, 216],
  [276, 216],
] as const;

/** Top edge of each leaf in the resource stack. */
const resourceLeaves = [96, 154, 212, 270] as const;

/** The mark's geometry, in its own 256-unit source space. */
const framePaths = [
  "M 35 80 H 142 A 34 34 0 0 1 176 114 V 157",
  "M 176 195 V 221",
  "M 221 176 H 114 A 34 34 0 0 1 80 142 V 99",
  "M 80 61 V 35",
] as const;

function Weave({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/**
 * Six cells on a woven thread grid. The two row threads carry a travelling dash
 * so the set reads as connected rather than merely aligned, and one cell carries
 * the accent: the areas are plural, the system is one.
 */
export function ProductWeave({ className }: { className?: string }) {
  return (
    <Weave className={className}>
      {/* Structure: two row threads and three column threads. */}
      <g stroke="currentColor" strokeOpacity="0.18">
        <path d="M 22 140 H 378" />
        <path d="M 22 258 H 378" />
        <path d="M 82 80 V 318" />
        <path d="M 200 80 V 318" />
        <path d="M 318 80 V 318" />
      </g>

      {/* Connectivity, travelling. */}
      <g
        className="mini-system-flow"
        strokeDasharray="4 4"
        strokeOpacity="0.7"
        style={{ stroke: "var(--gradient-to)" }}
      >
        <path d="M 22 140 H 378" />
        <path d="M 22 258 H 378" />
      </g>

      {/* Cells, painted in the page colour so the threads pass under them. */}
      <g stroke="currentColor" strokeOpacity="0.16">
        {productCells.slice(1).map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={CELL}
            height={CELL}
            rx="14"
            style={{ fill: "var(--bg)" }}
          />
        ))}
      </g>
      <rect
        x={productCells[0][0]}
        y={productCells[0][1]}
        width={CELL}
        height={CELL}
        rx="14"
        strokeOpacity="0.85"
        style={{ fill: "var(--bg)", stroke: "var(--gradient-to)" }}
      />

      {/* The thread ends overshoot the outermost cells, the way the mark's
          threads overshoot its joins. */}
      <g stroke="none" style={{ fill: "var(--gradient-to)" }}>
        <rect x="17.5" y="135.5" width="9" height="9" rx="2.5" />
        <rect x="373.5" y="253.5" width="9" height="9" rx="2.5" />
      </g>
      <g fill="currentColor" fillOpacity="0.32" stroke="none">
        <rect x="17.5" y="253.5" width="9" height="9" rx="2.5" />
        <rect x="373.5" y="135.5" width="9" height="9" rx="2.5" />
      </g>
    </Weave>
  );
}

/**
 * Two situations arrive, braid, and leave as one line that forks into the
 * capability areas. The shape of the conversation rather than an outcome chart —
 * nothing here claims a result.
 */
export function SolutionWeave({ className }: { className?: string }) {
  return (
    <Weave className={className}>
      <g stroke="currentColor" strokeOpacity="0.22">
        <path d="M 32 128 C 108 128, 146 200, 216 200" />
        <path d="M 32 272 C 108 272, 146 200, 216 200" />
      </g>

      <g
        className="mini-system-flow"
        strokeDasharray="4 4"
        strokeOpacity="0.7"
        style={{ stroke: "var(--gradient-to)" }}
      >
        <path d="M 32 128 C 108 128, 146 200, 216 200" />
        <path d="M 32 272 C 108 272, 146 200, 216 200" />
      </g>

      {/* The merged thread. */}
      <path
        d="M 214 200 H 306"
        strokeWidth="2"
        strokeOpacity="0.9"
        style={{ stroke: "var(--gradient-to)" }}
      />

      {/* Forks to the areas the pattern draws on. */}
      <g stroke="currentColor" strokeOpacity="0.3">
        <path d="M 304 200 C 334 200, 334 152, 360 152" />
        <path d="M 304 200 H 360" />
        <path d="M 304 200 C 334 200, 334 248, 360 248" />
      </g>

      {/* Situation markers. */}
      <g fill="currentColor" fillOpacity="0.32" stroke="none">
        <rect x="24" y="119" width="9" height="9" rx="2.5" />
        <rect x="24" y="263" width="9" height="9" rx="2.5" />
      </g>

      {/* The marks naming the areas: one lit, the rest quiet. */}
      <rect
        className="lattice-node"
        x="358"
        y="147"
        width="9"
        height="9"
        rx="2.5"
        stroke="none"
        style={{ fill: "var(--gradient-to)" }}
      />
      <g fill="currentColor" fillOpacity="0.3" stroke="none">
        <rect x="358" y="195" width="9" height="9" rx="2.5" />
        <rect x="358" y="243" width="9" height="9" rx="2.5" />
      </g>
    </Weave>
  );
}

/**
 * Four leaves bound by one thread down the spine. The thread overshoots the
 * stack at both ends, and each leaf is stitched where it meets the thread — a
 * bound library rather than a pile of cards.
 */
export function ResourceWeave({ className }: { className?: string }) {
  return (
    <Weave className={className}>
      <g stroke="currentColor" strokeOpacity="0.15">
        {resourceLeaves.map((y) => (
          <rect
            key={y}
            x="100"
            y={y}
            width="232"
            height="52"
            rx="10"
            style={{ fill: "var(--bg)" }}
          />
        ))}
      </g>
      <rect
        x="100"
        y={resourceLeaves[0]}
        width="232"
        height="52"
        rx="10"
        strokeOpacity="0.55"
        style={{ fill: "var(--bg)", stroke: "var(--gradient-to)" }}
      />

      {/* The spine, and its travelled overlay. */}
      <path d="M 84 74 V 344" stroke="currentColor" strokeOpacity="0.25" />
      <path
        className="mini-system-flow"
        d="M 84 74 V 344"
        strokeDasharray="4 4"
        strokeOpacity="0.65"
        style={{ stroke: "var(--gradient-to)" }}
      />

      {/* The stitch where the spine meets each leaf. */}
      <g fill="currentColor" fillOpacity="0.3" stroke="none">
        {resourceLeaves.slice(1).map((y) => (
          <rect key={y} x="80" y={y + 22} width="8" height="8" rx="2.5" />
        ))}
      </g>
      <rect
        className="lattice-node"
        x="80"
        y={resourceLeaves[0] + 22}
        width="8"
        height="8"
        rx="2.5"
        stroke="none"
        style={{ fill: "var(--gradient-to)" }}
      />

      {/* Ruled lines: what is on the page, not what it says. */}
      <g fill="currentColor" fillOpacity="0.15" stroke="none">
        {resourceLeaves.map((y) => (
          <g key={y}>
            <rect x="126" y={y + 16} width="132" height="6" rx="3" />
            <rect x={y % 2 === 0 ? 126 : 150} y={y + 30} width="94" height="6" rx="3" />
          </g>
        ))}
      </g>
      <rect
        x="126"
        y={resourceLeaves[0] + 16}
        width="132"
        height="6"
        rx="3"
        stroke="none"
        style={{ fill: "var(--gradient-to)" }}
      />
    </Weave>
  );
}

/**
 * A plan drawing of the mark: orbit rings, registration ticks, the frame drawn
 * from its source geometry, and the four thread ends that overshoot lit up. This
 * is the drawing the mark section below it then explains, so the two are
 * deliberately the same object at two different levels of abstraction.
 */
export function FrameOrbit({ className }: { className?: string }) {
  return (
    <Weave className={className}>
      <g stroke="currentColor" strokeOpacity="0.1">
        <circle cx="200" cy="200" r="152" />
      </g>
      <circle
        cx="200"
        cy="200"
        r="130"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeDasharray="2 10"
      />

      {/* Registration ticks. */}
      <g stroke="currentColor" strokeOpacity="0.28">
        <path d="M 44 66 V 44 H 66" />
        <path d="M 356 66 V 44 H 334" />
        <path d="M 44 334 V 356 H 66" />
        <path d="M 356 334 V 356 H 334" />
      </g>

      <g transform="translate(200 200) scale(1) translate(-128 -128)">
        {/* The frame itself, ghosted. */}
        <g
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="22"
          strokeLinecap="butt"
        >
          {framePaths.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        {/* The overshooting ends — the one part of the construction the mark
            story is actually about. */}
        <g
          strokeWidth="22"
          strokeLinecap="butt"
          style={{ stroke: "var(--gradient-to)" }}
        >
          <path d="M 35 80 H 52" />
          <path d="M 176 204 V 221" />
          <path d="M 221 176 H 204" />
          <path d="M 80 52 V 35" />
        </g>

        {/* Nodes on the thread centre lines. */}
        <g stroke="none" style={{ fill: "var(--gradient-to)" }}>
          <rect
            className="lattice-node"
            x="122"
            y="74"
            width="12"
            height="12"
            rx="3"
          />
          <rect
            className="lattice-node"
            x="122"
            y="170"
            width="12"
            height="12"
            rx="3"
            style={{ animationDelay: "2.4s", fill: "var(--gradient-to)" }}
          />
        </g>
      </g>
    </Weave>
  );
}
