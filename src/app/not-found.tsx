import Link from "next/link";

import { Container } from "@/components/layout/container";
import { primaryNav } from "@/content/nav";

export default function NotFound() {
  return (
    <Container className="relative py-24 sm:py-32">
      <div className="max-w-2xl">
        <p className="label text-brand-ink">Error 404</p>
        <h1 className="display-2 mt-5">This page does not exist.</h1>
        <p className="lede mt-5">
          The address you followed is not one of ours. Nothing was broken and
          nothing was lost — the link simply does not point anywhere on this
          site.
        </p>

        <ul className="mt-10 grid gap-px border-y border-line sm:grid-cols-2">
          {primaryNav.map((item) => (
            <li
              key={item.href}
              className="border-line sm:odd:border-r sm:even:pl-6"
            >
              <Link
                href={item.href}
                className="hover:text-brand-ink flex min-h-14 items-center py-3 text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
