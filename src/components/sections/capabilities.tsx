import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { capabilities, type Capability } from "@/content/products";

/**
 * The two areas we build around get the room to say why. Each carries its
 * capability id as an anchor, so the deep links the footer uses
 * (`/products#ai-agents`) resolve on the page that expands them.
 */
function CapabilityPanel({ capability }: { capability: Capability }) {
  return (
    <article id={capability.id} className="panel flex h-full flex-col p-7 sm:p-9">
      <span className="border-line text-brand-ink bg-inset mb-6 inline-flex size-11 items-center justify-center rounded-control border">
        <Icon name={capability.icon} />
      </span>
      <h3 className="display-3">{capability.title}</h3>
      <p className="text-muted mt-3 text-sm leading-relaxed">
        {capability.blurb}
      </p>
      <p className="border-line text-muted mt-6 border-t pt-6 text-sm leading-relaxed">
        {capability.detail}
      </p>
    </article>
  );
}

/**
 * The other four are peers. A row separated by hairlines says "these are the
 * same kind of thing" in a way four more boxes never do — and it keeps the
 * home page from being five card grids stacked on top of each other.
 */
function CapabilityRow({ capability }: { capability: Capability }) {
  return (
    <li className="border-line border-b">
      <article
        id={capability.id}
        className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-7"
      >
        <h3 className="display-3 sm:w-52 sm:shrink-0 lg:w-56">
          {capability.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {capability.blurb}
        </p>
      </article>
    </li>
  );
}

export function Capabilities() {
  const featured = capabilities.filter((capability) => capability.feature);
  const rest = capabilities.filter((capability) => !capability.feature);

  return (
    <Section
      id="products"
      tone="inset"
      eyebrow="What we build"
      title="Six areas, one connected system."
      lede="These are focus areas rather than a catalogue. Each one exists because the others need it — a product is only as good as the automation around it and the infrastructure beneath it."
      action={
        <ButtonLink href="/products" variant="secondary" icon="arrowRight">
          All capabilities
        </ButtonLink>
      }
    >
      {/* One gesture for the whole band rather than one per cell: the featured
          pair and the rows behind them arrive together, so this reads as a
          section entering rather than several separate animations firing. */}
      <Reveal>
        <ul className="grid gap-5 lg:grid-cols-2">
          {featured.map((capability) => (
            <li key={capability.id} className="h-full">
              <CapabilityPanel capability={capability} />
            </li>
          ))}
        </ul>

        <ul className="border-line mt-10 border-t sm:mt-12">
          {rest.map((capability) => (
            <CapabilityRow key={capability.id} capability={capability} />
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
