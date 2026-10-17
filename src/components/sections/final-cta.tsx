import { WovenFrame } from "@/components/brand/woven-frame";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { getContactHref, isContactConfigured, site } from "@/content/site";

/** What a useful first message contains — guidance, not a promise about replies. */
const usefulContext = [
  "The workflow you want to improve, and what makes it expensive today",
  "The constraints you cannot move — systems, data, compliance, budget",
  "What “done” looks like for you, and who has to agree it is done",
];

export function FinalCta() {
  const configured = isContactConfigured();

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build what's next."
      lede="Tell us what you are trying to make work. We will tell you honestly whether AI is the right answer, and what it would take if it is."
      backdrop={
        <div
          aria-hidden="true"
          className="depth-band pointer-events-none absolute inset-0"
        >
          <div className="radial-glow right-[-10%] bottom-[-30%] h-[32rem] w-[32rem] opacity-50" />
          <div className="absolute -right-16 -bottom-24 hidden opacity-[0.05] lg:block">
            <WovenFrame title="Alwebiee" className="text-fg size-[26rem]" />
          </div>
        </div>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal>
          <ul className="flex flex-col gap-4">
            {usefulContext.map((item) => (
              <li key={item} className="border-line flex gap-3 border-t pt-4">
                <span
                  aria-hidden="true"
                  className="bg-brand mt-2 size-1.5 shrink-0 rounded-full"
                />
                <span className="text-muted text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className="panel p-6 sm:p-8">
            {configured ? (
              <>
                <p className="label">Email</p>
                <p className="mt-3 text-lg font-medium tracking-tight break-all">
                  {site.contact.email}
                </p>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  One address, read by the people who do the work. No forms,
                  no routing, no auto-responder.
                </p>
                <ButtonLink
                  href={getContactHref()}
                  icon="mail"
                  className="mt-6 w-full sm:w-auto"
                >
                  {site.contact.ctaLabel}
                </ButtonLink>
              </>
            ) : (
              <>
                <p className="label">Contact channel</p>
                <h3 className="display-3 mt-3">Not live yet</h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  This site has no public contact channel configured yet. We
                  would rather say so plainly than offer a button that leads
                  nowhere — when an address goes live, it appears right here.
                </p>
                <ButtonLink
                  href="/#products"
                  variant="secondary"
                  icon="arrowRight"
                  className="mt-6 w-full sm:w-auto"
                >
                  See what we build
                </ButtonLink>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
