import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";
import { principles } from "@/content/approach";

/**
 * Rendered as an ordered list because the sequence is the content — the steps
 * are a process, not a set of interchangeable features.
 *
 * On wide viewports the four steps hang off one horizontal stitch with a node at
 * each step, so the thread between them is drawn rather than merely implied by
 * the ordering. Below `lg` each step keeps its own short rule and node, because
 * two columns cannot share one line honestly.
 */
export function Approach() {
  return (
    <Section
      id="approach"
      tone="inset"
      eyebrow="How we work"
      title="A process built around the problem, not the technology."
      lede="Four steps, in order. The boring discipline of the first two is what makes the last two cheap."
    >
      {/* The steps and the stitch they hang from arrive as one object: the thread
          only means anything with its nodes on it, so animating them apart would
          split the one idea this section is built on. */}
      <Reveal>
        <div className="relative">
          <span
            aria-hidden="true"
            className="stitch-h absolute top-0 left-0 hidden h-px w-full lg:block"
          />
          <ol className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {principles.map((principle) => (
              <li
                key={principle.step}
                className="border-line relative border-t pt-6 lg:border-t-0 lg:pt-8"
              >
                <span
                  aria-hidden="true"
                  className="bg-brand absolute -top-[5px] left-0 size-2.5 rounded-full"
                />
                <span className="label">Step {principle.step}</span>
                <h3 className="display-3 mt-4">{principle.title}</h3>
                <p className="text-muted mt-2.5 text-sm leading-relaxed">
                  {principle.description}
                </p>
                <p className="text-subtle mt-4 text-sm leading-relaxed">
                  {principle.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
