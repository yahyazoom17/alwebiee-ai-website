import type { Metadata, Viewport } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { hasSiteUrl, site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Headings and labels are set in the wordmark's own typeface, so the biggest type
 * on the page reads as continuous with the logo rather than as a coincidence.
 * Body copy stays in Geist. Geist Mono was retired with the all-caps mono labels:
 * once labels are set in the display face, nothing on the site needs a monospaced
 * family, so one less font is downloaded.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name}`;

export const metadata: Metadata = {
  /* Canonical URLs and Open Graph images are only resolvable once a real domain
     is configured. Until then they are omitted rather than pointed at a domain
     we do not own. */
  metadataBase: hasSiteUrl() ? new URL(site.url) : undefined,
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  manifest: "/site.webmanifest",
  ...(hasSiteUrl() ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  /* Matches the page background of each theme, so mobile browser chrome does not
     flash a colour the design never uses. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFCFB" },
    { media: "(prefers-color-scheme: dark)", color: "#060D0A" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* Next 16 only restores smooth in-page scrolling during navigation when
         this attribute is present and the CSS honours reduced motion. */
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
