export type LabVisual = "app" | "automation" | "infrastructure";

export type LabItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  /** Only ever set to a status we can honestly claim. */
  status: "Concept" | "In Development" | "Available";
  visual: LabVisual;
};

/**
 * Directions from our lab. These are illustrative of how we think about the
 * work — they are not shipped products, and the UI says so.
 */
export const labItems: LabItem[] = [
  {
    id: "context-assistants",
    category: "AI Applications",
    title: "Assistants that know your operating context",
    description:
      "Interfaces that reason over your own systems — documents, tickets, product data — instead of starting from a blank chat window.",
    status: "Concept",
    visual: "app",
  },
  {
    id: "workflow-agents",
    category: "Agent Automation",
    title: "Workflow agents with visible reasoning",
    description:
      "Multi-step automation that shows its work: which tool it called, what it read, and where it paused for a human.",
    status: "Concept",
    visual: "automation",
  },
  {
    id: "evaluation-layer",
    category: "Infrastructure & Tooling",
    title: "An evaluation layer for AI features",
    description:
      "Tooling that tests prompts, retrieval and agent behaviour the way we test code — before any of it reaches customers.",
    status: "Concept",
    visual: "infrastructure",
  },
];

export const labNote =
  "These are directions from our lab. They illustrate how we approach the work — they are not shipped products.";
