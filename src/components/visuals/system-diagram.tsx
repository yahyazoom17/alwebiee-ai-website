/**
 * Small abstract diagrams for the three lab items — one per stage of the stack.
 *
 * Deliberately not screenshots or product UI: nothing here depicts an interface
 * that does not exist. They are decorative line drawings on a shared 240×140
 * grid, sharing the thread/web logic of the mark rather than the usual
 * nodes-and-lines diagram cliché.
 *
 * No gradients or `id`s, so the three instances can coexist without collisions.
 */
const diagrams = {
  app: (
    <>
      <rect
        x="20"
        y="22"
        width="200"
        height="96"
        rx="10"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      <path
        d="M54 22 V118"
        stroke="currentColor"
        strokeOpacity="0.12"
      />
      <rect
        x="68"
        y="42"
        width="70"
        height="7"
        rx="3.5"
        style={{ fill: "var(--gradient-to)" }}
      />
      <rect
        x="68"
        y="61"
        width="112"
        height="7"
        rx="3.5"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <rect
        x="68"
        y="80"
        width="88"
        height="7"
        rx="3.5"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <rect
        x="68"
        y="99"
        width="52"
        height="7"
        rx="3.5"
        fill="currentColor"
        fillOpacity="0.09"
      />
      <path
        className="mini-system-flow"
        d="M54 45.5 H66"
        strokeDasharray="3 5"
        style={{ stroke: "var(--gradient-to)" }}
        strokeOpacity="0.8"
      />
    </>
  ),
  automation: (
    <>
      <rect
        x="24"
        y="52"
        width="44"
        height="36"
        rx="9"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <rect
        x="98"
        y="52"
        width="44"
        height="36"
        rx="9"
        fill="none"
        style={{ stroke: "var(--gradient-to)" }}
      />
      <rect
        x="172"
        y="52"
        width="44"
        height="36"
        rx="9"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <path
        d="M39 64 H53"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
      <path
        d="M39 76 H47"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
      <path
        d="M113 64 H127"
        style={{ stroke: "var(--gradient-to)" }}
        strokeOpacity="0.55"
      />
      <path
        d="M113 76 H121"
        style={{ stroke: "var(--gradient-to)" }}
        strokeOpacity="0.55"
      />
      <path
        d="M187 64 H201"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
      <path
        d="M187 76 H195"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
      <path
        className="mini-system-flow"
        d="M68 70 H98"
        strokeDasharray="4 4"
        style={{ stroke: "var(--gradient-to)" }}
        strokeOpacity="0.9"
      />
      <path
        className="mini-system-flow"
        d="M142 70 H172"
        strokeDasharray="4 4"
        style={{ stroke: "var(--gradient-to)" }}
        strokeOpacity="0.9"
      />
    </>
  ),
  infrastructure: (
    <>
      <rect
        x="42"
        y="24"
        width="156"
        height="15"
        rx="7.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <rect
        x="42"
        y="63"
        width="156"
        height="15"
        rx="7.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.14"
      />
      <rect
        x="42"
        y="102"
        width="156"
        height="15"
        rx="7.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.14"
      />
      <rect
        x="30"
        y="28"
        width="7"
        height="7"
        rx="2.5"
        style={{ fill: "var(--gradient-to)" }}
      />
      <rect
        x="30"
        y="67"
        width="7"
        height="7"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <rect
        x="30"
        y="106"
        width="7"
        height="7"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path
        className="mini-system-flow"
        d="M120 39 V63"
        strokeDasharray="4 4"
        style={{ stroke: "var(--gradient-to)" }}
        strokeOpacity="0.85"
      />
      <path
        className="mini-system-flow"
        d="M120 78 V102"
        strokeDasharray="4 4"
        style={{ stroke: "var(--gradient-to)" }}
        strokeOpacity="0.85"
      />
    </>
  ),
} as const;

export type DiagramVariant = keyof typeof diagrams;

export function SystemDiagram({
  variant,
  className,
}: {
  variant: DiagramVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 140"
      aria-hidden="true"
      focusable="false"
      className={className}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    >
      {diagrams[variant]}
    </svg>
  );
}
