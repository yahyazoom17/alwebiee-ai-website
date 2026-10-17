import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";
import { positions } from "@/content/about";
import { site } from "@/content/site";

export function BrandIntro() {
  return (
    <Section
      id="about"
      eyebrow="Brand introduction"
      title={`${site.name} builds intelligent software for people who have to run it.`}
      lede={site.description}
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
  );
}
