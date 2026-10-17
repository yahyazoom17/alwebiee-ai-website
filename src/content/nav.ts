export type NavItem = {
  label: string;
  href: string;
};

/**
 * Primary navigation points at real routes. Each route carries the expanded
 * version of the matching home-page section, so no link is a dead end.
 */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
];

/**
 * Secondary, in-page anchors. Used in the footer and by in-page CTAs so
 * smooth scrolling still exists alongside the routed pages.
 */
export const sectionNav: NavItem[] = [
  { label: "What we build", href: "/#products" },
  { label: "Innovation lab", href: "/#innovation" },
  { label: "How we work", href: "/#approach" },
  { label: "Why Alwebiee", href: "/#why" },
  { label: "Resources", href: "/#resources" },
  { label: "Contact", href: "/#contact" },
];

export type FooterColumn = {
  title: string;
  items: NavItem[];
};

export const footerNav: FooterColumn[] = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Solutions", href: "/solutions" },
      { label: "Innovation lab", href: "/#innovation" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "AI Products", href: "/products#ai-products" },
      {
        label: "Intelligent Automation",
        href: "/products#intelligent-automation",
      },
      { label: "AI Infrastructure", href: "/products#ai-infrastructure" },
      { label: "AI Agents", href: "/products#ai-agents" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Developer guides", href: "/resources#developer-guides" },
      { label: "AI experiments", href: "/resources#ai-experiments" },
      {
        label: "Engineering insights",
        href: "/resources#engineering-insights",
      },
      { label: "Tools & utilities", href: "/resources#tools-utilities" },
    ],
  },
];
