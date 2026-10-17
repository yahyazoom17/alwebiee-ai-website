import { cacheLife } from "next/cache";

/**
 * The current year, computed rather than hard-coded.
 *
 * With `cacheComponents` enabled, reading a synchronous clock value during a
 * prerender is a build error — Next.js cannot know whether the value belongs to
 * the static shell or to each request. `use cache` answers that question: the
 * year is captured once into the static shell and refreshed daily.
 *
 * This also avoids the alternative (a Suspense hole in the footer), which would
 * stream the year in late and shift the layout.
 */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");

  return <>{new Date().getFullYear()}</>;
}
