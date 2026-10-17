export type Principle = {
  step: string;
  title: string;
  description: string;
  detail: string;
};

/** How we work: process claims only, no outcome claims. */
export const principles: Principle[] = [
  {
    step: "01",
    title: "Understand the problem",
    description:
      "We start with the workflow, the constraints and the definition of done — before choosing a model or a framework.",
    detail:
      "Interviews, existing systems, edge cases, and the people who will actually live with the result. Ambiguity resolved on paper is the cheapest engineering there is.",
  },
  {
    step: "02",
    title: "Design the right system",
    description:
      "Model choice, data flow, failure modes and where humans stay in the loop. Architecture first, cleverness second.",
    detail:
      "We decide what must be deterministic, what can be probabilistic, and what a sensible fallback looks like when the model is wrong.",
  },
  {
    step: "03",
    title: "Build and integrate intelligently",
    description:
      "Production code, exercised against real inputs, wired into the tools your team already uses.",
    detail:
      "Integration matters as much as inference. If the result doesn't live where work happens, it doesn't get used.",
  },
  {
    step: "04",
    title: "Iterate, measure, improve",
    description:
      "Instrumented from day one so quality, latency and cost stay visible — and improvable.",
    detail:
      "Evaluation sets instead of vibes, real usage instead of assumptions, and a short loop between what we learn and what we ship next.",
  },
];
