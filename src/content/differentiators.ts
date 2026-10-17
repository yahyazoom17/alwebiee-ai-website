export type Differentiator = {
  title: string;
  description: string;
};

/**
 * A position, stated as practice. Every line describes how we work rather than
 * how well we perform — no numbers, no comparisons we cannot evidence.
 */
export const positionStatement =
  "We optimise for the systems that keep working after the demo.";

export const positionSupport =
  "AI is easy to prototype and hard to operate. Everything we build is aimed at the second problem: useful, supervised, and affordable once it is running in front of real people.";

export const differentiators: Differentiator[] = [
  {
    title: "Engineering first",
    description:
      "Model choice is a technical decision, not an identity. We take the simplest approach that meets the requirement.",
  },
  {
    title: "Practical over hyped",
    description:
      "No capability claims we can't demonstrate on your inputs, in your environment, with your constraints.",
  },
  {
    title: "Systems that fit together",
    description:
      "Tools, data, automations and interfaces designed as one system, rather than a pile of disconnected pilots.",
  },
  {
    title: "Experimentation as a habit",
    description:
      "Small prototypes, honest results, and a bias toward finding out early instead of arguing late.",
  },
  {
    title: "Built to stay useful",
    description:
      "Evaluation, observability and cost control are part of the build, not a phase added after launch.",
  },
];
