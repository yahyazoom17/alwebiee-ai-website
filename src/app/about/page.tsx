import type { Metadata } from "next";

import { WovenFrame } from "@/components/brand/woven-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { FinalCta } from "@/components/sections/final-cta";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { FrameOrbit } from "@/components/visuals/page-weave";
import { ThreadField } from "@/components/visuals/thread-field";
import { markStory, positions } from "@/content/about";
import { differentiators } from "@/content/differentiators";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `Who ${site.name} is, how we work, and what we mean by engineering what's next.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`About ${site.shortName}`}
        title={`${site.name} builds intelligent software for people who have to run it.`}
        lede={site.description}
        visual={
          <FrameOrbit className="text-fg h-auto w-full max-w-[24rem] lg:max-w-none" />
        }
      >
        <ButtonLink href="/#products" variant="secondary" icon="arrowRight">
          See what we build
        </ButtonLink>
      </PageHeader>

      <Section
        id="practice"
        tone="inset"
        title="How we work"
        backdrop={<ThreadField className="text-fg thread-field" />}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="max-w-xl space-y-5">
            <p className="text-muted leading-relaxed">
              Most AI work stops at the prototype — convincing in a room, fragile
              in production. We take the other route: understand how the work
              actually happens, design the smallest system that improves it, then
              build the parts that make it dependable.
            </p>
            <p className="text-muted leading-relaxed">
              In practice that means model choice is a technical decision rather
              than an identity, and every feature ships with the evaluation,
              observability and cost controls needed to keep it honest once real
              people depend on it.
            </p>
          </div>

          <Reveal>
            <ul className="panel divide-line divide-y overflow-hidden">
              {positions.map((position) => (
                <li key={position.title} className="p-6">
                  <h3 className="display-3">{position.title}</h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {position.body}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section id="principles" title="What we hold to">
        {/* The same five items the home page closes on, given the same hairline
            and stitch — but a column grid rather than the home page's editorial
            split, so the repetition reads as a restatement rather than as the
            same layout shipped twice. One `Reveal` for the whole set. */}
        <Reveal>
          <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((item) => (
              <li
                key={item.title}
                className="border-line relative border-t pt-5"
              >
                <span
                  aria-hidden="true"
                  className="bg-brand absolute -top-1 left-0 size-2 rounded-full"
                />
                <h3 className="text-base font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section id="mark" tone="inset" title={markStory.title}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-16">
          <Reveal>
            <div className="border-line bg-surface relative flex items-center justify-center overflow-hidden rounded-panel border p-10 sm:p-14">
              <div
                aria-hidden="true"
                className="radial-glow inset-0 m-auto h-64 w-64 opacity-80"
              />
              <WovenFrame
                title="The Alwebiee mark"
                className="text-fg relative size-32 sm:size-40"
              />
            </div>
          </Reveal>

          <div className="max-w-2xl space-y-5">
            {markStory.body.map((paragraph) => (
              <p key={paragraph} className="text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
