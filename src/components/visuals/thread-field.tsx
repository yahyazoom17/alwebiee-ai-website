/**
 * A woven field of threads, used as band texture behind content.
 *
 * The home page textures its bands with `grid-backdrop`. That reads as a
 * technical grid, which suits a hero but not the body of an inner page. This is
 * the same job done in the brand's own vocabulary: rows of stitched threads,
 * two of which carry the accent and travel. Placed under low opacity and masked
 * out towards the bottom, it gives a band depth without competing with the copy.
 *
 * Decorative, so it is hidden from assistive technology and expects its parent
 * to carry `.thread-field` (which supplies the placement, the sizing and the
 * mask) or to position it some other way.
 */
const threads = [
  { y: 30, opacity: 0.07, dash: "6 10" },
  { y: 76, opacity: 0.05, dash: "3 14" },
  { y: 122, opacity: 0.1, dash: "10 8" },
  { y: 168, opacity: 0.05, dash: "4 12" },
  { y: 214, opacity: 0.07, dash: "8 10" },
  { y: 260, opacity: 0.05, dash: "3 14" },
  { y: 306, opacity: 0.1, dash: "10 8" },
  { y: 352, opacity: 0.05, dash: "4 12" },
  { y: 398, opacity: 0.07, dash: "6 10" },
] as const;

/** The two rows that carry the accent and travel. */
const accentRows = [122, 306] as const;

export function ThreadField({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 420"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      strokeWidth="1"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor">
        {threads.map((thread) => (
          <path
            key={thread.y}
            d={`M -24 ${thread.y} H 1224`}
            strokeOpacity={thread.opacity}
            strokeDasharray={thread.dash}
          />
        ))}
      </g>

      <g
        className="mini-system-flow"
        strokeDasharray="4 6"
        strokeOpacity="0.16"
        style={{ stroke: "var(--gradient-to)" }}
      >
        {accentRows.map((y) => (
          <path key={y} d={`M -24 ${y} H 1224`} />
        ))}
      </g>
    </svg>
  );
}
