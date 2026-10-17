/**
 * Shared About material. Kept here rather than inline in a component so the
 * home-page introduction and the About page cannot drift apart over time.
 */

export type Position = {
  title: string;
  body: string;
};

/** How we work, stated as practice rather than as a performance claim. */
export const positions: Position[] = [
  {
    title: "Utility first",
    body: "If it does not remove real work or unlock something genuinely new, it is not worth building — however interesting the model is.",
  },
  {
    title: "Supervised autonomy",
    body: "Automation with explicit tools, clear success conditions, and a human positioned to intervene rather than hope.",
  },
  {
    title: "Built to be operated",
    body: "Evaluation, observability and cost control are part of the design, not a project that starts after launch.",
  },
];

/**
 * The identity, described as what it is: geometry taken from the production
 * master file. No invented heritage, no claims about what it "stands for".
 */
export const markStory = {
  title: "The mark",
  body: [
    "Two threads woven into a single rounded frame. Each passes over the other once — the top thread over on one corner, the under thread over on the opposite corner — so the frame only holds together because both are present.",
    "It is drawn as filled outlines rather than strokes, which is why it stays crisp everywhere from a favicon to a print sheet, and why it needs no gradient, glow or effect to read.",
  ],
};
