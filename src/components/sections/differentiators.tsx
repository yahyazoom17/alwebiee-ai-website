import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";
import {
  differentiators,
  positionStatement,
  positionSupport,
} from "@/content/differentiators";

/**
 * The position, then the practice behind it.
 *
 * Set as one statement with the list pushed into the right-hand columns, rather
 * than as a balanced grid of equal cards. The statement is the claim and the
 * five items are the evidence for it, so they are deliberately not given the
 * same weight — and the space left under the statement is doing work, not
 * waiting for a sixth card. One `Reveal` covers the whole list: a single gesture
 * rather than five staggered ones.
 */
export function Differentiators() {
  return (
    <Section
      id="why"
      eyebrow="Why Alwebiee"
      title={positionStatement}
      lede={positionSupport}
    >
      <div className="lg:grid lg:grid-cols-12">
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <ul className="grid gap-y-8 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-1">
            {differentiators.map((item) => (
              <li key={item.title} className="border-line border-t pt-5">
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
      </div>
    </Section>
  );
}
