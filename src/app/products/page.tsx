import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { FinalCta } from "@/components/sections/final-cta";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icons";
import { ProductWeave } from "@/components/visuals/page-weave";
import { ThreadField } from "@/components/visuals/thread-field";
import { capabilities } from "@/content/products";

export const metadata: Metadata = {
  title: "Products & Capabilities",
  description:
    "The six areas Alwebiee AI works across: AI products, intelligent automation, AI infrastructure, AI agents, developer resources and experimental technologies.",
};

/**
 * The deep version of the home-page summary. Each area is a spec-sheet row —
 * name and mark on the left, the reasoning on the right — so the page reads as
 * a reference rather than as the same card grid the home page just showed.
 */
export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products & capabilities"
        title="Six areas, one connected system."
        lede="These are focus areas rather than a catalogue. Each one exists because the others need it: a product is only as good as the automation around it and the infrastructure beneath it."
        visual={
          <ProductWeave className="text-fg h-auto w-full max-w-[24rem] lg:max-w-none" />
        }
      >
        <ButtonLink href="/solutions" variant="secondary" icon="arrowRight">
          See how they apply
        </ButtonLink>
      </PageHeader>

      <Section
        id="capabilities"
        tone="inset"
        title="What we build"
        backdrop={<ThreadField className="text-fg thread-field" />}
      >
        <ul className="border-line border-t">
          {capabilities.map((capability) => (
            <li key={capability.id} className="border-line border-b">
              <article
                id={capability.id}
                className="grid gap-4 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:py-10"
              >
                <div className="flex items-start gap-4">
                  <span className="border-line text-brand-ink bg-surface inline-flex size-10 shrink-0 items-center justify-center rounded-control border">
                    <Icon name={capability.icon} />
                  </span>
                  <h3 className="display-3 pt-1.5">{capability.title}</h3>
                </div>
                <div>
                  <p className="text-muted text-sm leading-relaxed">
                    {capability.blurb}
                  </p>
                  <p className="text-muted mt-4 text-sm leading-relaxed">
                    {capability.detail}
                  </p>
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
