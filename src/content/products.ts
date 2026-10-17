export type CapabilityIcon =
  | "products"
  | "automation"
  | "infrastructure"
  | "agents"
  | "resources"
  | "experimental";

export type Capability = {
  /** Doubles as the anchor id used by deep links from the footer. */
  id: string;
  title: string;
  blurb: string;
  detail: string;
  icon: CapabilityIcon;
  /** Feature cards get more visual weight in the home-page grid. */
  feature?: boolean;
};

/**
 * Company focus areas — not a product catalogue. Nothing here is presented as
 * launched, priced or available, because it is not.
 */
export const capabilities: Capability[] = [
  {
    id: "ai-products",
    title: "AI Products",
    blurb:
      "Purpose-built AI tools designed to solve meaningful problems and unlock new workflows.",
    detail:
      "Focused applications built around a single job: a small interface, intelligence doing real work underneath, and an outcome you can judge in the first few minutes.",
    icon: "products",
    feature: true,
  },
  {
    id: "intelligent-automation",
    title: "Intelligent Automation",
    blurb:
      "Connect processes, applications, and intelligent agents to eliminate repetitive work.",
    detail:
      "We map how work actually moves through a business, then automate the parts that don't need a person — routing, extraction, drafting, reconciliation, follow-up.",
    icon: "automation",
    feature: true,
  },
  {
    id: "ai-infrastructure",
    title: "AI Infrastructure",
    blurb:
      "Build the foundations, integrations, and systems that make AI applications practical and scalable.",
    detail:
      "Retrieval, orchestration, evaluation, observability and cost control — the layer that decides whether an AI feature survives real traffic.",
    icon: "infrastructure",
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    blurb:
      "Explore autonomous workflows that reason, use tools, and coordinate complex tasks.",
    detail:
      "Bounded agents with explicit tools, clear success conditions and human checkpoints. Automation you can supervise rather than hope for.",
    icon: "agents",
  },
  {
    id: "developer-resources",
    title: "Developer Resources",
    blurb:
      "Utilities, frameworks, and resources that help builders move from ideas to implementation.",
    detail:
      "Patterns, references and small sharp tools we reach for in our own builds, published as we use them.",
    icon: "resources",
  },
  {
    id: "experimental-technologies",
    title: "Experimental Technologies",
    blurb:
      "Explore new ideas, prototypes, and emerging possibilities at the frontier of AI.",
    detail:
      "Not everything is worth a business case on day one. Some of it exists to find out what the next decade of software feels like.",
    icon: "experimental",
  },
];
