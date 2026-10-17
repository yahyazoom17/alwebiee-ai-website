import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { SystemDiagram } from "@/components/visuals/system-diagram";
import { labItems, labNote } from "@/content/innovation";
import { cn } from "@/lib/cn";

/**
 * Descending step, applied per plate. Kept as literal class strings so the
 * Tailwind compiler can see them.
 */
const offsets = [
  "lg:translate-y-0",
  "lg:translate-y-10",
  "lg:translate-y-20",
] as const;

/**
 * The lab. Every item is a direction we are exploring, and the badge says so —
 * the note in the lede and the status on each plate are the same claim twice, on
 * purpose, because "concept" is the easiest thing for a marketing page to blur.
 *
 * Each drawing runs flush to its plate's top corners instead of sitting framed
 * inside it, and the three plates step downwards, so the set reads as a sequence
 * of explorations rather than a row of equal product cards. The list reserves the
 * height its offset occupies, which keeps the section's rail thread running past
 * the last plate instead of stopping above it.
 */
export function InnovationLab() {
  return (
    <Section
      id="innovation"
      eyebrow="Innovation lab"
      title="Directions we are exploring."
      lede={labNote}
    >
      <Reveal>
        <ul className="grid gap-5 lg:grid-cols-3 lg:pb-20">
          {labItems.map((item, index) => (
            <li
              key={item.id}
              className={cn("h-full", offsets[index % offsets.length])}
            >
              <article className="panel flex h-full flex-col overflow-hidden">
                <div className="border-line text-fg bg-inset border-b px-4 pt-6 pb-5">
                  <SystemDiagram variant={item.visual} className="h-28 w-full" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="label">{item.category}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <h3 className="display-3">{item.title}</h3>
                  <p className="text-muted mt-2.5 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
