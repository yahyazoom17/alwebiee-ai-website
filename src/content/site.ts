/**
 * Single source of truth for brand-level configuration.
 *
 * Everything an owner needs to change before launch lives here. Fields that are
 * intentionally empty are empty on purpose — see the note on each one.
 */

export type SocialLink = {
  /** Visible label, e.g. "GitHub". */
  label: string;
  href: string;
};

export const site = {
  name: "Alwebiee",
  shortName: "Alwebiee",
  tagline: "Engineering What's Next.",
  description:
    "Alwebiee AI builds intelligent tools, AI automations, infrastructure, and resources to help businesses and developers build what's next.",

  /**
   * Production origin, e.g. "https://alwebiee.ai".
   * Left empty until a real domain exists: canonical URLs, sitemap and robots
   * stay unset rather than pointing at a domain we do not own.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",

  contact: {
    /**
     * Set a real address to activate mailto: links across the site.
     * While empty, every CTA points to the on-page contact section instead —
     * we never show a form that cannot send.
     */
    email: "",
    subject: "Alwebiee AI — project enquiry",
    /** Label for the closing call to action. */
    ctaLabel: "Book a call now",
  },

  /**
   * No social accounts are listed because none were supplied.
   * Add entries here and they appear in the footer automatically.
   */
  socials: [] as SocialLink[],
} as const;

export function isContactConfigured(): boolean {
  return site.contact.email.trim().length > 0;
}

/** The only place CTA destinations are decided. */
export function getContactHref(): string {
  if (!isContactConfigured()) return "/#contact";
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(
    site.contact.subject,
  )}`;
}

export function hasSiteUrl(): boolean {
  return site.url.trim().length > 0;
}
