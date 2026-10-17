export type ResourceIcon = "guides" | "experiments" | "insights" | "tools";

export type ResourceCategory = {
  /** Anchor id, also used by footer deep links. */
  id: string;
  title: string;
  description: string;
  icon: ResourceIcon;
  /**
   * Left null until something real is published. Null renders as plain text —
   * never as a button that leads nowhere.
   */
  href: string | null;
};

export const resourceCategories: ResourceCategory[] = [
  {
    id: "developer-guides",
    title: "Developer guides",
    description:
      "Walkthroughs for the parts of AI engineering that documentation tends to skip: retrieval that holds up, evaluation that means something, costs that stay predictable.",
    icon: "guides",
    href: null,
  },
  {
    id: "ai-experiments",
    title: "AI experiments",
    description:
      "Small, self-contained experiments published with their results — including the ones that did not work out as expected.",
    icon: "experiments",
    href: null,
  },
  {
    id: "engineering-insights",
    title: "Engineering insights",
    description:
      "Notes from building and operating AI systems: architecture decisions, trade-offs, and what we would do differently next time.",
    icon: "insights",
    href: null,
  },
  {
    id: "tools-utilities",
    title: "Tools & utilities",
    description:
      "Utilities we build for our own work and release once they are genuinely useful to someone else.",
    icon: "tools",
    href: null,
  },
];

/**
 * Honest empty state. We would rather say nothing is published yet than
 * decorate the page with articles that do not exist.
 */
export const resourcesEmptyState = {
  title: "Nothing published yet",
  body: "The library opens as we build. Guides, experiment write-ups and utilities will appear here as they are finished and reviewed — no filler articles, no waitlist games.",
};
