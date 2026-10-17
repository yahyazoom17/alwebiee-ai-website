/**
 * The hero centrepiece.
 *
 * Built from the production mark geometry in `assets/logo/a-woven-frame-v3.svg`:
 * the same two threads and four overshoots, scaled up and re-centred, with
 * instrumentation added around them — a fixed pair of rings, four nodes on the
 * thread centre lines, and three gaps travelling along the weave.
 *
 * Purely decorative, so it is hidden from assistive technology; the heading
 * beside it carries the meaning. All motion lives in CSS inside a
 * `prefers-reduced-motion: no-preference` query, which means the composition is
 * complete and still for anyone who asks for less motion.
 *
 * Theme-aware paints use inline `style` rather than presentation attributes,
 * because `var()` inside an SVG presentation attribute is not reliably supported.
 */
export function HeroLattice({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 640"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id="alw-thread" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--gradient-from)" }} />
          <stop offset="100%" style={{ stopColor: "var(--gradient-to)" }} />
        </linearGradient>
        <radialGradient id="alw-halo">
          <stop offset="0%" style={{ stopColor: "var(--glow)" }} />
          <stop
            offset="100%"
            style={{ stopColor: "var(--glow)", stopOpacity: 0 }}
          />
        </radialGradient>
      </defs>

      {/* Soft halo so the mark sits in its own light rather than floating. */}
      <circle cx="320" cy="320" r="300" fill="url(#alw-halo)" />

      {/* Orbit: a hairline ring and a dotted ring, held still. These used to
          drift on a 24s cycle; a frame that slowly rotates around a stationary
          mark reads as a loading state rather than as composure, so the loops
          are spent on the weave instead — the travelling seams and the nodes. */}
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="320" cy="320" r="286" opacity="0.11" />
        <circle
          cx="320"
          cy="320"
          r="248"
          opacity="0.16"
          strokeDasharray="2 10"
        />
      </g>

      {/* The mark: centre 128,128 in source space mapped to the canvas centre. */}
      <g transform="translate(320 320) scale(2.15) translate(-128 -128)">
        <g
          fill="none"
          stroke="url(#alw-thread)"
          strokeWidth="28"
          strokeLinecap="butt"
          strokeLinejoin="round"
        >
          <path d="M 35 80 H 142 A 34 34 0 0 1 176 114 V 157" />
          <path d="M 176 195 V 221" />
          <path d="M 221 176 H 114 A 34 34 0 0 1 80 142 V 99" />
          <path d="M 80 61 V 35" />
        </g>

        {/* The page colour travelling along the threads reads as the gaps in the
            weave moving — the same seam idea the mark is built from. */}
        <g
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ stroke: "var(--bg)" }}
        >
          <path
            className="lattice-trace"
            d="M 35 80 H 142"
            strokeDasharray="6 26"
          />
          <path
            className="lattice-trace-slow"
            d="M 80 99 V 142"
            strokeDasharray="6 26"
          />
          <path
            className="lattice-trace-slow"
            d="M 176 114 V 157"
            strokeDasharray="6 26"
          />
        </g>

        {/* Nodes sit on the thread centre lines, halfway along each side. */}
        <g style={{ fill: "var(--bg)" }}>
          <rect
            className="lattice-node"
            x="123"
            y="75"
            width="10"
            height="10"
            rx="3"
          />
          <rect
            className="lattice-node"
            x="171"
            y="123"
            width="10"
            height="10"
            rx="3"
            style={{ animationDelay: "1.6s" }}
          />
          <rect
            className="lattice-node"
            x="123"
            y="171"
            width="10"
            height="10"
            rx="3"
            style={{ animationDelay: "3.2s" }}
          />
          <rect
            className="lattice-node"
            x="75"
            y="123"
            width="10"
            height="10"
            rx="3"
            style={{ animationDelay: "4.8s" }}
          />
        </g>
      </g>
    </svg>
  );
}
