import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { SectionRail } from "@/components/layout/section-rail";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede: string;
  /**
   * Decorative composition for the right-hand column on wide viewports — the
   * route's equivalent of the hero lattice. Pass an `aria-hidden` SVG sized with
   * `h-auto w-full max-w-[…] lg:max-w-none`. Without one the copy keeps the full
   * width, so routes that need no drawing are not left with a blank column.
   */
  visual?: ReactNode;
  /** Optional actions or supporting content below the lede. */
  children?: ReactNode;
};

/**
 * The opening band for every route other than the home page. Uses `display-2`
 * rather than the hero's `display-1` so inner pages read as a step down from the
 * home page while still being the page's single top-level heading.
 *
 * The heading sits in the same rail column as every section beneath it, so the
 * page reads as one thread running down it rather than as a header followed by
 * a set of unrelated bands. Where a `visual` is supplied the copy column splits
 * in two, mirroring the home hero, so every route opens on a drawing rather than
 * on text alone.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  visual,
  children,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-backdrop" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="radial-glow top-[-30%] right-[-10%] h-[30rem] w-[30rem] opacity-60"
      />

      <Container className="relative py-14 sm:py-18 lg:py-22">
        <div className="lg:grid lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <SectionRail label={eyebrow} className="mb-5 lg:mb-0" />
          <div
            className={cn(
              "lg:grid lg:items-center lg:gap-12 xl:gap-16",
              visual
                ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
                : null,
            )}
          >
            <div className={visual ? "max-w-2xl" : "max-w-3xl"}>
              <h1 className="display-2">{title}</h1>
              <p className="lede mt-5">{lede}</p>
              {children ? <div className="mt-8">{children}</div> : null}
            </div>
            {visual ? <div className="mt-12 lg:mt-0">{visual}</div> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
