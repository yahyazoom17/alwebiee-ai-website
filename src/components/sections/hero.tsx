import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icons";
import { HeroLattice } from "@/components/visuals/hero-lattice";
import { getContactHref } from "@/content/site";

/**
 * The four discipline areas, text only. Each points at the capability that
 * expands it, so the strip is navigable rather than decorative — and it carries
 * no logos or figures, because we have none to claim.
 */
const disciplines: Array<{ label: string; href: string }> = [
  { label: "AI Products", href: "/products#ai-products" },
  { label: "Intelligent Automation", href: "/products#intelligent-automation" },
  { label: "AI Infrastructure", href: "/products#ai-infrastructure" },
  { label: "Agents", href: "/products#ai-agents" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* The grid is the hero's reference plane and holds still: it is the one
          layer whose pattern runs to an opaque edge, so it is the one layer that
          must not drift. The two layers that do carry a `depth-*` class paint
          themselves out to transparent, so they can move without exposing a seam.
          Both start at their resting position and only move as the page scrolls;
          neither is offset at scroll 0. */}
      <div className="grid-backdrop" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="radial-glow depth-lag top-[-18%] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 opacity-70"
      />

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:py-28">
        <div className="max-w-2xl">
          {/* Plain label, no ornament: the hero's own composition and the lattice
              beside it carry the page. Ornament before every label is exactly the
              repetition this pass exists to remove. */}
          <p className="label text-brand-ink hero-in">
            Building the next layer of AI
          </p>

          <h1
            className="display-1 hero-in mt-6"
            style={{ animationDelay: "80ms" }}
          >
            Engineering{" "}
            {/* Decorative only: the words carry a solid brand fallback colour,
                so they stay readable wherever background-clip is unsupported. */}
            <span className="text-accent-gradient">{"What's Next."}</span>
          </h1>

          <p className="lede hero-in mt-6" style={{ animationDelay: "160ms" }}>
            We build AI tools, intelligent automations, and the infrastructure
            that turns ambitious ideas into real-world possibilities.
          </p>

          <div
            className="hero-in mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            {/* Explore is the primary action on purpose: it always works, even
                before a contact channel is configured. It carries no arrow: the
                four links below already own that gesture, and repeating it here
                would put five arrows on one screen. */}
            <ButtonLink href="/#products">Explore What We Build</ButtonLink>
            <ButtonLink href={getContactHref()} variant="secondary">
              Let&apos;s Work Together
            </ButtonLink>
          </div>
        </div>

        {/* Nearest plane: the mark leads the content as the hero leaves, which is
            what gives the two planes their depth. `lg` only, so it never closes
            the gap to the copy on the single-column layout. */}
        <div className="depth-lead relative">
          <HeroLattice className="text-fg mx-auto aspect-square w-full max-w-[30rem] lg:max-w-none" />
        </div>

        <ul
          className="hero-in grid gap-x-6 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4"
          style={{ animationDelay: "320ms" }}
        >
          {disciplines.map((discipline) => (
            <li key={discipline.href} className="border-line border-t">
              <Link
                href={discipline.href}
                className="group hover:text-brand-ink flex min-h-16 items-center gap-2 py-4 text-sm font-medium tracking-tight transition-colors duration-200"
              >
                {discipline.label}
                <Icon
                  name="arrowRight"
                  className="text-subtle size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
