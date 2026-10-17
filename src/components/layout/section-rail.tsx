import { cn } from "@/lib/cn";

type SectionRailProps = {
  /**
   * The signpost for the section. Omit it where the section's own heading
   * already says what the section is — a label that repeats the heading beneath
   * it is noise, not hierarchy. The thread still runs either way, so the content
   * keeps hanging off the same spine.
   */
  label?: string;
  className?: string;
};

/**
 * The left-hand rail that sections hang from.
 *
 * On wide viewports it draws a stitched thread down the full height of its
 * column with a node at the signpost; below `lg` the thread shortens to a stitch
 * set in front of the label instead.
 *
 * The thread is a pseudo-element on this element, so the rail has to stretch to
 * the height of the section it belongs to. It is only ever used as a grid child
 * — never as a shrink-wrapped box, which would collapse the thread to nothing.
 */
export function SectionRail({ label, className }: SectionRailProps) {
  if (!label) {
    return (
      <div aria-hidden="true" className={cn("rail rail-bare", className)} />
    );
  }

  return (
    <div className={cn("rail", className)}>
      <span aria-hidden="true" className="rail-node" />
      <p className="label text-brand-ink">{label}</p>
    </div>
  );
}
