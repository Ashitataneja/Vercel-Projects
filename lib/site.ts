export type Mode = {
  href: string;
  label: string;
  /** Longer name for screen readers and page titles */
  name: string;
};

/** Camera-style modes. Order matches the strip, left to right. */
export const modes: Mode[] = [
  { href: "/", label: "Home", name: "Home" },
  { href: "/work", label: "Work", name: "Work" },
  { href: "/about", label: "About", name: "About me" },
  { href: "/tv", label: "TV", name: "TV" },
  { href: "/blog", label: "Blog", name: "Blog" },
  { href: "/contact", label: "Contact", name: "Contact" },
];

/* ------------------------------------------------------------------ */
/* Work: one ticket per project. Titles and clients are from the CV;   */
/* everything else stays [PLACEHOLDER] until the case studies arrive.  */
/* ------------------------------------------------------------------ */
export type Project = {
  slug: string;
  number: string;
  title: string;
  client: string;
  kind: string;
  /** ticket colour */
  tone: "cream" | "butter" | "sky" | "paper";
};

export const projects: Project[] = [
  { slug: "karnival-dashboard", number: "01", title: "Dashboard Analytics", client: "Karnival · B2B", kind: "Product design", tone: "butter" },
  { slug: "fnp-point-of-sale", number: "02", title: "Point-of-Sale", client: "Ferns N Petals", kind: "Product design", tone: "cream" },
  { slug: "woovly-creator-landing", number: "03", title: "Creator Landing Page", client: "Woovly", kind: "UX design", tone: "sky" },
  { slug: "woovly-revamp", number: "04", title: "Woovly Revamp", client: "Woovly · desktop & mobile", kind: "UX design", tone: "paper" },
  { slug: "org-psychology-research", number: "05", title: "UX Research", client: "Organisational-psychology backed", kind: "Research", tone: "cream" },
];

export const caseStops = [
  { id: "problem", title: "The problem" },
  { id: "field-notes", title: "Field notes" },
  { id: "turning-points", title: "Turning points" },
  { id: "landed", title: "Where it landed" },
] as const;

/* ------------------------------------------------------------------ */
/* About: the journey map. Facts are from Ashita's CV only.            */
/* ------------------------------------------------------------------ */
export type JourneyStop = {
  id: string;
  place: string;
  when: string;
  role: string;
  points: string[];
  /** small drawn landmark on the map */
  icon: "college" | "office" | "book" | "megaphone" | "pencil" | "rocket" | "flag";
};

export const journey: JourneyStop[] = [
  {
    id: "sbsc",
    place: "Shaheed Bhagat Singh College, University of Delhi",
    when: "2018 – 2021",
    role: "Bachelor of Commerce (B.Com)",
    points: [
      "President of the Commerce Association: led a student body of over 1,200 across six departments.",
      "Joint Secretary of the Placement Cell: secured participation from 30+ companies.",
      "Graphic design internship at Bloody Donut (2021).",
    ],
    icon: "college",
  },
  {
    id: "kpmg",
    place: "KPMG India",
    when: "Jun – Nov 2021",
    role: "Audit Analyst",
    points: [
      "Assessed internal control procedures at Pine Labs for regulatory compliance.",
      "Analysed financial data, procedures and reports to find risks and keep documentation accurate.",
    ],
    icon: "office",
  },
  {
    id: "psychology",
    place: "Indira Gandhi National Open University",
    when: "2021 – 2023",
    role: "MA in Psychology",
    points: ["Behavioural psychology, survey design and insight synthesis became part of how I design."],
    icon: "book",
  },
  {
    id: "sociowash",
    place: "Sociowash",
    when: "Jul 2022 – Jun 2023",
    role: "Senior Account Executive",
    points: [
      "Led integrated marketing campaigns for TinderU, Hero Cycles, Primebook and more.",
      "Built a go-to-market (GTM) strategy that led to a 15% increase in discovery.",
      "Won the social media mandate for Anytime Fitness.",
    ],
    icon: "megaphone",
  },
  {
    id: "woovly-freelance",
    place: "Woovly, then freelance",
    when: "2023 – Jun 2024",
    role: "Product Designer intern → Freelance Product Designer & Illustrator",
    points: [
      "Product design internship at Woovly (2023).",
      "Designed and prototyped UIs for a Y Combinator-pitched fintech product.",
      "Built a design system for Ember; researched and rewrote UX copy to reduce bounce rate.",
    ],
    icon: "pencil",
  },
  {
    id: "karnival",
    place: "Karnival",
    when: "Jul 2024 – Jul 2025",
    role: "Product Manager",
    points: [
      "Revamped the dashboard analytics product for B2B clients.",
      "Led a point-of-sale (POS) system for Ferns and Petals.",
      "Ran end-to-end research for a loyalty programme.",
    ],
    icon: "rocket",
  },
  {
    id: "iitj",
    place: "Indian Institute of Technology (IIT) Jodhpur",
    when: "Now",
    role: "Master of Design (M.Des)",
    points: [
      "UX design internship at Delhi Technological University (2025).",
      "Product design internship at HDFC Bank (current).",
    ],
    icon: "flag",
  },
];

/* ------------------------------------------------------------------ */
/* Contact: what each number on the rotary dial connects to.           */
/* ------------------------------------------------------------------ */
export const directory = [
  {
    digit: 1,
    label: "LinkedIn",
    // [PLACEHOLDER] replace with Ashita's LinkedIn profile URL
    href: "https://www.linkedin.com/",
    note: "[PLACEHOLDER: LinkedIn URL]",
  },
  {
    digit: 2,
    label: "Email",
    href: "mailto:taneja.ashita@gmail.com",
    note: "taneja.ashita@gmail.com",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Blog: journal entries. [PLACEHOLDER] until real posts exist.        */
/* ------------------------------------------------------------------ */
export const journalEntries = [
  { id: "e1", date: "[DATE]", title: "[PLACEHOLDER: first entry title]", body: "[PLACEHOLDER: a short entry, written like a diary page.]", photo: "[PLACEHOLDER: photo caption]" },
  { id: "e2", date: "[DATE]", title: "[PLACEHOLDER: second entry title]", body: "[PLACEHOLDER: what you noticed on a photowalk.]", photo: "[PLACEHOLDER: photo caption]" },
  { id: "e3", date: "[DATE]", title: "[PLACEHOLDER: third entry title]", body: "[PLACEHOLDER: a design thought worth keeping.]", photo: "[PLACEHOLDER: photo caption]" },
  { id: "e4", date: "[DATE]", title: "[PLACEHOLDER: fourth entry title]", body: "[PLACEHOLDER: one more page.]", photo: "[PLACEHOLDER: photo caption]" },
];
