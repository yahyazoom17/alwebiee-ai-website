import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { FinalCta } from "@/components/sections/final-cta";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icons";
import { ResourceWeave } from "@/components/visuals/page-weave";
import { ThreadField } from "@/components/visuals/thread-field";
import {
  resourceCategories,
  resourcesEmptyState,
} from "@/content/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Developer guides, AI experiments, engineering insights and utilities from Alwebiee AI — published when they are finished, not when the outline is written.",
};

/**
 * The long form of the home-page summary, set as a numbered index.
 *
 * Each category carries its own anchor id so the footer deep links
 * (`/resources#developer-guides`) land on the right heading. The numbering is
 * doing real work here: it says this is a list of places to go, in order, which
 * is what a library index is for.
 */
export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Resources for builders."
        lede="Guides, experiments and utilities from the work. Everything here is written after the thing it describes has actually been built."
        visual={
          <ResourceWeave className="text-fg h-auto w-full max-w-[24rem] lg:max-w-none" />
        }
      >
        <ButtonLink href="/products" variant="secondary" icon="arrowRight">
          Browse capabilities
        </ButtonLink>
      </PageHeader>

      <Section
        id="library"
        tone="inset"
        title="The library"
        backdrop={<ThreadField className="text-fg thread-field" />}
      >
        <ol className="border-line border-t">
          {resourceCategories.map((category, index) => (
            <li key={category.id} className="border-line border-b">
              <article
                id={category.id}
                className="grid gap-3 py-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-12 lg:py-10"
              >
                <div className="flex items-start gap-4">
                  <span className="border-line text-brand-ink bg-surface inline-flex size-10 shrink-0 items-center justify-center rounded-control border">
                    <Icon name={category.icon} />
                  </span>
                  <div>
                    <p className="label">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="display-3 mt-1.5">{category.title}</h3>
                  </div>
                </div>
                <p className="text-muted max-w-3xl text-sm leading-relaxed lg:pt-6">
                  {category.description}
                </p>
              </article>
            </li>
          ))}
        </ol>

        <div className="border-line mt-10 flex flex-col gap-2 border-t pt-8 sm:flex-row sm:items-baseline sm:gap-6">
          <p className="label shrink-0">{resourcesEmptyState.title}</p>
          <p className="text-muted max-w-3xl text-sm leading-relaxed">
            {resourcesEmptyState.body}
          </p>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
