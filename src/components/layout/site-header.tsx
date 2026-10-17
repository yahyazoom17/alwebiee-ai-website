"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AlwebieeLockup } from "@/components/brand/alwebiee-lockup";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icons";
import { primaryNav, sectionNav } from "@/content/nav";
import { getContactHref, site } from "@/content/site";
import { cn } from "@/lib/cn";

/** The one client component that ships real behaviour: navigation. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const contactHref = getContactHref();

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // A route change closes the panel. This includes back/forward, which no click
  // handler on a link would catch. Adjusting state during render is the
  // documented pattern for resetting state when a prop changes, and avoids the
  // cascading render that setState-in-an-effect would cause.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Escape closes and hands focus back to the control that opened the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.classList.add("nav-open");

    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("nav-open");
    };
  }, [open]);

  // Rotating to desktop hides the panel; without this the scroll lock would stick.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };

    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="border-line bg-base/85 sticky top-0 z-50 h-[var(--header-h)] border-b backdrop-blur-md">
      <Container className="flex h-full items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="rounded-chip shrink-0"
        >
          <AlwebieeLockup
            title=""
            className="text-fg aspect-[788/256] h-7 w-auto sm:h-8"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(
                "rounded-chip px-3 py-2 text-sm transition-colors duration-200",
                isCurrent(item.href)
                  ? "bg-brand-soft text-fg"
                  : "text-muted hover:text-fg hover:bg-brand-soft",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={contactHref}
            icon="arrowRight"
            className="hidden min-h-10 px-5 sm:inline-flex"
          >
            {site.contact.ctaLabel}
          </ButtonLink>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="border-control-line text-fg hover:border-brand hover:text-brand-ink rounded-control inline-flex size-11 items-center justify-center border transition-colors duration-200 md:hidden"
          >
            <Icon name={open ? "close" : "menu"} />
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </Container>

      {open ? (
        <div
          ref={panelRef}
          id="mobile-nav"
          className="border-line bg-base menu-panel fixed inset-x-0 top-[var(--header-h)] max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b md:hidden"
        >
          <Container className="flex flex-col gap-8 py-6">
            <nav aria-label="Primary, mobile">
              <ul className="flex flex-col">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={cn(
                        "rounded-chip flex min-h-12 items-center px-3 text-base transition-colors duration-200",
                        isCurrent(item.href)
                          ? "bg-brand-soft text-fg"
                          : "text-muted hover:text-fg hover:bg-brand-soft",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Home page sections">
              <p className="label mb-2 px-3">Home page sections</p>
              <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                {sectionNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-chip text-muted hover:text-fg hover:bg-brand-soft flex min-h-11 items-center px-3 text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ButtonLink
              href={contactHref}
              icon="arrowRight"
              className="w-full"
            >
              {site.contact.ctaLabel}
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
