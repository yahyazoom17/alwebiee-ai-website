import type { MetadataRoute } from "next";

import { primaryNav } from "@/content/nav";
import { hasSiteUrl, site } from "@/content/site";

/**
 * Emitted only once a real origin is configured. A sitemap requires absolute
 * URLs, so while `site.url` is empty we serve an empty set rather than invent a
 * domain or point search engines at somewhere we do not control.
 *
 * `lastModified` is intentionally omitted: `new Date()` in a metadata route is
 * evaluated during prerendering, and a build timestamp is not a useful signal to
 * a crawler anyway.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!hasSiteUrl()) return [];

  const base = site.url.replace(/\/+$/, "");

  return primaryNav.map((item) => ({
    url: item.href === "/" ? base : `${base}${item.href}`,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
