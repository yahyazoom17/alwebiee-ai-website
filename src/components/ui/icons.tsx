import type { ReactNode } from "react";

import type { CapabilityIcon } from "@/content/products";
import type { ResourceIcon } from "@/content/resources";
import { cn } from "@/lib/cn";

export type IconName =
  | CapabilityIcon
  | ResourceIcon
  | "arrowRight"
  | "arrowUpRight"
  | "mail"
  | "menu"
  | "close";

/**
 * Geometry deliberately avoids the category clichés the brand brief bans
 * (neural nodes, circuit traces, sparkles). Every glyph is drawn on the same
 * 24-unit grid, 1.5 stroke, so the set reads as one family.
 */
const glyphs: Record<IconName, ReactNode> = {
  // Application window: a built surface with a fixed rail.
  products: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <path d="M9 3.5v17" />
      <path d="M6.25 6.75h.01" />
    </>
  ),
  // Two stages joined by a directed hand-off.
  automation: (
    <>
      <rect x="3" y="8.5" width="5.5" height="7" rx="2" />
      <rect x="15.5" y="8.5" width="5.5" height="7" rx="2" />
      <path d="M8.5 12h4" />
      <path d="M11 10l2 2-2 2" />
    </>
  ),
  // Stacked layers: foundations beneath a surface.
  infrastructure: (
    <>
      <path d="M12 3.5 20.5 8 12 12.5 3.5 8z" />
      <path d="m4.75 12 7.25 4 7.25-4" />
      <path d="m4.75 16 7.25 4 7.25-4" />
    </>
  ),
  // One coordinator, two workers.
  agents: (
    <>
      <circle cx="7" cy="12" r="3.25" />
      <circle cx="17.25" cy="7" r="2.25" />
      <circle cx="17.25" cy="17" r="2.25" />
      <path d="m9.85 10.4 5.2-2.4" />
      <path d="m9.85 13.6 5.2 2.4" />
    </>
  ),
  // A page with a spine and two lines of body.
  resources: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M9.25 4v16" />
      <path d="M12.5 9.5h4" />
      <path d="M12.5 13h4" />
    </>
  ),
  // An open boundary: the edge of what is known.
  experimental: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" strokeDasharray="4 3" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
  // A/B: two trials side by side, one still open.
  guides: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M8.5 4v16" />
      <path d="M11.75 9h4.75" />
      <path d="M11.75 13h3" />
    </>
  ),
  experiments: (
    <>
      <rect x="3.5" y="6" width="7" height="12" rx="2.5" />
      <rect x="13.5" y="6" width="7" height="12" rx="2.5" strokeDasharray="3.5 3" />
    </>
  ),
  // Measured values on a baseline.
  insights: (
    <>
      <path d="M4 20h16" />
      <path d="M7.75 20v-5.5" />
      <path d="M12 20V8.5" />
      <path d="M16.25 20v-9" />
    </>
  ),
  // Registration brackets around a centre: an instrument.
  tools: (
    <>
      <path d="M9.25 4.5H6.5A2 2 0 0 0 4.5 6.5v2.75" />
      <path d="M14.75 4.5h2.75a2 2 0 0 1 2 2v2.75" />
      <path d="M19.5 14.75v2.75a2 2 0 0 1-2 2h-2.75" />
      <path d="M9.25 19.5H6.5a2 2 0 0 1-2-2v-2.75" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h14.5" />
      <path d="m13.5 6.5 5.5 5.5-5.5 5.5" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M6.5 17.5 17.5 6.5" />
      <path d="M9.5 6.5h8v8" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="3.5" />
      <path d="m4.75 8.75 5.9 4.3a2.25 2.25 0 0 0 2.7 0l5.9-4.3" />
    </>
  ),
  menu: (
    <>
      <path d="M3.5 7.5h17" />
      <path d="M3.5 12h17" />
      <path d="M3.5 16.5h17" />
    </>
  ),
  close: (
    <>
      <path d="m6.5 6.5 11 11" />
      <path d="m17.5 6.5-11 11" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5", className)}
    >
      {glyphs[name]}
    </svg>
  );
}
