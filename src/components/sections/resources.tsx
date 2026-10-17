import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import {
  resourceCategories,
  resourcesEmptyState,
  type ResourceCategory,
} from "@/content/resources";

/**
 * A category with no published item renders as plain text: no link, no button,
 * nothing to click that would lead nowhere. Each cell anchors to its id so
 * footer deep links land on the right heading.
 *
 * The set is laid out as a hairline matrix rather than four boxes. The 1px gaps
 * between cells are the container showing through, which gives a text table —
 * adjacent, comparable, no card chrome — and keeps this section from being the
 * third card grid on the page.
 */
function ResourceCell({ category }: { category: ResourceCategory }) {
  const body = (
    <>
      <h3 className="display-3 flex items-center gap-2">
        {category.title}
        {category.href ? (
          <Icon
            name="arrowUpRight"
            className="text-subtle size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        ) : null}
      </h3>
      <p className="text-muted mt-2.5 text-sm leading-relaxed">
        {category.description}
      </p>
    </>
  );

  if (!category.href) {
    return <article id={category.id}>{body}</article>;
  }

  return (
    <Link
      id={category.id}
      href={category.href}
      className="group hover:text-brand-ink block transition-colors duration-200"
    >
      {body}
    </Link>
  );
}

export function Resources() {
  return (
    <Section
      id="resources"
      tone="inset"
      eyebrow="Resources"
      title="Resources for builders."
      lede="Guides, experiments, and utilities from the work — published when they are finished, not when the outline is written."
    >
      {/* The matrix and the note about it are one thought, so they enter
          together. The cells are separated by a 1px gap that the container shows
          through; animating them one by one would make that hairline flicker. */}
      <Reveal>
        <ul className="border-line bg-line grid gap-px border-y sm:grid-cols-2">
          {resourceCategories.map((category) => (
            <li key={category.id} className="bg-inset p-6 sm:p-7">
              <ResourceCell category={category} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
          <p className="label shrink-0">{resourcesEmptyState.title}</p>
          <p className="text-muted max-w-3xl text-sm leading-relaxed">
            {resourcesEmptyState.body}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
