export type Solution = {
  /** Anchor id, so a solution can be linked directly. */
  id: string;
  /** The situation, described plainly. */
  problem: string;
  /** How we would approach it. Process, not a promised outcome. */
  approach: string;
  /** Related capability areas, as deep links into the products page. */
  relates: Array<{ label: string; href: string }>;
};

/**
 * Solution patterns, framed by problem rather than by technology. Nothing here
 * claims a deployment, a customer or a result — each entry describes a situation
 * we recognise and the approach we would take to it.
 */
export const solutions: Solution[] = [
  {
    id: "grounded-assistants",
    problem:
      "Answers live in documents, tickets and product data, so every answer costs someone time to assemble by hand.",
    approach:
      "Retrieval over the sources you already trust, with citations shown and a path back to the original record. Where there is no grounded answer, it says so instead of guessing.",
    relates: [
      { label: "AI Products", href: "/products#ai-products" },
      { label: "AI Infrastructure", href: "/products#ai-infrastructure" },
    ],
  },
  {
    id: "workflow-automation",
    problem:
      "A process runs on copy-and-paste between systems: extract, re-key, chase, reconcile, follow up.",
    approach:
      "We map how the work actually moves, automate the deterministic steps, and use a model only where judgement is genuinely required — with a human checkpoint wherever being wrong is expensive.",
    relates: [
      {
        label: "Intelligent Automation",
        href: "/products#intelligent-automation",
      },
      { label: "AI Agents", href: "/products#ai-agents" },
    ],
  },
  {
    id: "production-ai-features",
    problem:
      "A prototype impressed in a demo and now has to serve real users, real edge cases and a real budget.",
    approach:
      "Retrieval, orchestration, evaluation, observability and cost control wrapped around the feature you already have, so quality and spend stay visible week to week instead of degrading quietly.",
    relates: [
      { label: "AI Infrastructure", href: "/products#ai-infrastructure" },
      { label: "AI Agents", href: "/products#ai-agents" },
    ],
  },
  {
    id: "evaluation-and-cost",
    problem:
      "Nobody can say whether the AI feature is improving or drifting, or what a single task costs to run.",
    approach:
      "An evaluation set built from your own inputs, run on every change, alongside per-task cost and latency reporting — so decisions rest on measurements rather than impressions.",
    relates: [
      { label: "AI Infrastructure", href: "/products#ai-infrastructure" },
      {
        label: "Developer Resources",
        href: "/products#developer-resources",
      },
    ],
  },
];

/** The single constant across every engagement, stated once. */
export const solutionsNote =
  "Every engagement starts the same way: we look at the workflow before we look at a model.";
