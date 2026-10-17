import Link from "next/link";

import { AlwebieeLockup } from "@/components/brand/alwebiee-lockup";
import { Container } from "@/components/layout/container";
import { CurrentYear } from "@/components/layout/current-year";
import { footerNav } from "@/content/nav";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-line bg-inset border-t">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <AlwebieeLockup className="text-fg aspect-[788/256] h-7 w-auto" />
            <p className="text-muted mt-5 text-sm leading-relaxed">
              {site.description}
            </p>
            <p className="label mt-5">{site.tagline}</p>
          </div>

          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="label mb-4">{column.title}</h2>
              <ul className="flex flex-col gap-1">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted hover:text-fg rounded-chip -mx-2 inline-flex min-h-9 items-center px-2 text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-line mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-subtle text-xs">
            © <CurrentYear /> {site.name}. All rights reserved.
          </p>

          {site.socials.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {site.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    className="text-muted hover:text-fg text-xs transition-colors duration-200"
                    rel="noreferrer me"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
