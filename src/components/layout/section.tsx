import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { SectionRail } from "@/components/layout/section-rail";
import { cn } from "@/lib/cn";

type SectionProps = {
  /** Anchor target. Also names the section for assistive tech. */
  id: string;
  /**
   * Short signpost, set in the rail rather than above the heading. Where the
   * heading already names the section, leave this off: the rail keeps the thread
   * without adding a label that just says the heading again.
   */
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  /** Rendered opposite the heading on wide viewports. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** `inset` tints the band so adjacent sections read as distinct. */
  tone?: "base" | "inset";
  /**
   * Full-bleed decorative layer painted behind the band, outside the container
   * so it can reach the section edges. Purely presentational: pass
   * `aria-hidden` nodes and position them absolutely. The band clips it.
   */
  backdrop?: ReactNode;
};

/**
 * The band every home-page section sits in.
 *
 * Content is indented into a second column so it hangs off the rail described in
 * `section-rail.tsx`. The rail column stretches to the height of the section, so
 * the stitched thread runs the whole way down beside the content rather than
 * stopping under the label.
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  action,
  children,
  className,
  tone = "base",
  backdrop,
}: SectionProps) {
  const hasHeader = Boolean(title ?? lede ?? action);

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn(
        "relative py-16 sm:py-20 lg:py-28",
        tone === "inset" && "bg-inset",
        backdrop ? "overflow-hidden" : null,
        className,
      )}
    >
      {backdrop}
      <Container>
        <div className="lg:grid lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <SectionRail label={eyebrow} className="mb-6 lg:mb-0" />

          <div>
            {hasHeader ? (
              <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  {title ? (
                    <h2 id={`${id}-heading`} className="display-2">
                      {title}
                    </h2>
                  ) : null}
                  {lede ? <p className="lede mt-4">{lede}</p> : null}
                </div>
                {action ? <div className="shrink-0">{action}</div> : null}
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
