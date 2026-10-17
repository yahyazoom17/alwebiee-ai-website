import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { FinalCta } from "@/components/sections/final-cta";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icons";
import { SolutionWeave } from "@/components/visuals/page-weave";
import { ThreadField } from "@/components/visuals/thread-field";
import { solutions, solutionsNote } from "@/content/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "How Alwebiee AI approaches grounded assistants, workflow automation, AI features in production, and the evaluation and cost control that keeps them honest.",
};

/**
 * Each entry is a two-column editorial row — the situation on the left, what we
 * would do about it on the right — rather than a card. The pairing is the whole
 * point of the section, and two columns side by side make the pairing legible in
 * a way two stacked paragraphs inside a box do not.
 */
export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="We start with the situation, not the model."
        lede={solutionsNote}
        visual={
          <SolutionWeave className="text-fg h-auto w-full max-w-[24rem] lg:max-w-none" />
        }
      >
        <ButtonLink href="/products" variant="secondary" icon="arrowRight">
          Browse capabilities
        </ButtonLink>
      </PageHeader>

      <Section
        id="patterns"
        tone="inset"
        title="Situations we recognise"
        backdrop={<ThreadField className="text-fg thread-field" />}
      >
        <ul className="border-line border-t">
          {solutions.map((solution) => (
            <li key={solution.id} className="border-line border-b">
              <article
                id={solution.id}
                className="grid gap-6 py-9 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:py-11"
              >
                <div>
                  <p className="label">The situation</p>
                  <p className="mt-3 leading-relaxed">{solution.problem}</p>
                </div>

                <div>
                  <p className="label">How we would approach it</p>
                  <p className="text-muted mt-3 text-sm leading-relaxed">
                    {solution.approach}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {solution.relates.map((relates) => (
                      <Link
                        key={relates.href}
                        href={relates.href}
                        className="border-line text-muted hover:border-brand hover:text-brand-ink rounded-chip inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors duration-200"
                      >
                        {relates.label}
                        <Icon name="arrowUpRight" className="size-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
