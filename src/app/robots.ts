import type { MetadataRoute } from "next";

import { hasSiteUrl, site } from "@/content/site";

/**
 * Crawling is allowed. The sitemap reference is added only when a real origin
 * exists, so we never advertise a domain we do not own.
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/+$/, "");

  return {
    rules: { userAgent: "*", allow: "/" },
    ...(hasSiteUrl() ? { sitemap: `${base}/sitemap.xml`, host: base } : {}),
  };
}
