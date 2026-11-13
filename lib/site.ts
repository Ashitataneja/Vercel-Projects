export type Mode = {
  href: string;
  label: string;
  /** Longer name for screen readers and page titles */
  name: string;
};

/** Camera-style modes. Order matches the strip, left to right. */
export const modes: Mode[] = [
  { href: "/", label: "TV", name: "Home" },
  { href: "/work", label: "Work", name: "Work" },
  { href: "/about", label: "About me", name: "About me" },
  { href: "/contact", label: "Contact", name: "Contact" },
  { href: "/blog", label: "Blog", name: "Blog" },
];

/**
 * Life stops for the About city walk.
 * [CONFIRM] names, spelling and order with Ashita before launch.
 */
export const cityStops = [
  { id: "kam", name: "[CONFIRM: Kam…]", note: "[PLACEHOLDER: what this place meant]" },
  { id: "sbsc", name: "Shaheed Bhagat Singh College", note: "[PLACEHOLDER: commerce chapter]" },
  { id: "kpmg", name: "KPMG India", note: "[PLACEHOLDER: role and what she learned]" },
  { id: "sociowash", name: "Sociowash", note: "[PLACEHOLDER: role and what she learned]" },
  { id: "sugar-factory", name: "[CONFIRM: Sugar Factory]", note: "[PLACEHOLDER]" },
  { id: "iitj", name: "IIT Jodhpur", note: "[PLACEHOLDER: M.Des, Smart Product Design, 2024–2026]" },
];

/** Work as TV channels. [PLACEHOLDER] until case studies are written. */
export const channels = [
  { number: "02", slug: "project-one", title: "[PLACEHOLDER: Project one]", genre: "[PLACEHOLDER: research]" },
  { number: "03", slug: "project-two", title: "[PLACEHOLDER: Project two]", genre: "[PLACEHOLDER: product]" },
  { number: "04", slug: "project-three", title: "[PLACEHOLDER: Project three]", genre: "[PLACEHOLDER: interaction]" },
];
