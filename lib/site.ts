export type Mode = {
  href: string;
  label: string;
  /** Longer name for screen readers and page titles */
  name: string;
};

/** Camera-style modes. Order matches the strip, left to right. */
const modeList: Mode[] = [
  { href: "/", label: "Home", name: "Home" },
  { href: "/work", label: "Work", name: "Work" },
  { href: "/about", label: "About", name: "About me" },
  { href: "/blog", label: "Blog", name: "Blog" },
  { href: "/contact", label: "Contact", name: "Contact" },
];
/** The menu. Gallery appears once there are photographs to show (see galleryPhotos below). */
export function menu(): Mode[] {
  return galleryPhotos.length ? [...modeList.slice(0, 4), { href: "/gallery", label: "Gallery", name: "Gallery" }, ...modeList.slice(4)] : modeList;
}


/* ------------------------------------------------------------------ */
/* Work: one ticket per project. Titles and clients are from the CV;   */
/* the case-study write-ups come later.                                */
/* ------------------------------------------------------------------ */
export type CaseSection = { title: string; body: string };
export type Project = {
  slug: string;
  number: string;
  title: string;
  client: string;
  kind: string;
  /** the ink the painted ticket is tinted with */
  tint: string;
  /** what's printed in the ticket's corner */
  printed: string;
  /** what plays on the TV, section by section. Facts from the CV only; the full write-ups come later. */
  sections: CaseSection[];
};

const FULL_STORY: CaseSection = {
  title: "The full story",
  body: "I'm writing this one up. Until then, I'd love to walk you through it myself.",
};

export const projects: Project[] = [
  {
    slug: "karnival-dashboard",
    number: "01",
    title: "Dashboard Analytics",
    client: "Karnival · B2B",
    kind: "Product",
    tint: "#f2b51d",
    printed: "Admit one",
    sections: [
      { title: "The brief", body: "Revamp Karnival's dashboard analytics product for its B2B clients." },
      { title: "My role", body: "Product Manager at Karnival, July 2024 to July 2025." },
      { title: "Where it landed", body: "ROI went up significantly, and clients understood their data better." },
      FULL_STORY,
    ],
  },
  {
    slug: "fnp-point-of-sale",
    number: "02",
    title: "Point-of-Sale",
    client: "Ferns N Petals",
    kind: "Product",
    tint: "#d9482b",
    printed: "Boarding pass",
    sections: [
      { title: "The brief", body: "Build a point-of-sale (POS) system for Ferns N Petals stores." },
      { title: "My role", body: "Led its development as Product Manager at Karnival." },
      { title: "Where it landed", body: "Smoother store operations and a better experience for the people using it." },
      FULL_STORY,
    ],
  },
  {
    slug: "woovly-creator-landing",
    number: "03",
    title: "Creator Landing Page",
    client: "Woovly",
    kind: "UX design",
    tint: "#30a0e0",
    printed: "Live · gate 4",
    sections: [
      { title: "The brief", body: "A landing page for creators on Woovly." },
      { title: "My role", body: "Product Designer, Woovly, 2023." },
      FULL_STORY,
    ],
  },
  {
    slug: "woovly-revamp",
    number: "04",
    title: "Woovly Revamp",
    client: "Woovly",
    kind: "UX design",
    tint: "#e8588a",
    printed: "Bus ticket",
    sections: [
      { title: "The brief", body: "Revamp Woovly across desktop and mobile." },
      { title: "My role", body: "Product Designer, Woovly, 2023." },
      FULL_STORY,
    ],
  },
  {
    slug: "org-psychology-research",
    number: "05",
    title: "UX Research",
    client: "Organisational psychology",
    kind: "Research",
    tint: "#4e9a4b",
    printed: "Museum entry",
    sections: [
      { title: "The brief", body: "A UX research project grounded in organisational psychology." },
      FULL_STORY,
    ],
  },
];

/* ------------------------------------------------------------------ */
/* About: the journey map. Facts are from Ashita's CV only.            */
/* ------------------------------------------------------------------ */
export type JourneyStop = {
  id: string;
  place: string;
  when: string;
  role: string;
  points: string[];
  /** what this chapter added to how I work (from the CV) */
  skills: string[];
  /** Ashita's own photo or illustration for this stop, once she provides it */
  image?: { src: string; alt: string };
  /** Ashita's painted scene for this stop (public/world/journey) */
  scene: string;
  /** what the signboard on the road says */
  sign: string;
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
    skills: ["Leadership", "Event planning", "Stakeholder outreach"],
    scene: "/world/journey/sbsc.webp",
    sign: "Commerce · SBSC",
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
    skills: ["Audit", "Internal controls", "Risk analysis", "Documentation"],
    scene: "/world/journey/kpmg.webp",
    sign: "Audit · KPMG",
  },
  {
    id: "psychology",
    place: "Indira Gandhi National Open University",
    when: "2021 – 2023",
    role: "MA in Psychology",
    points: ["Behavioural psychology, survey design and insight synthesis became part of how I design."],
    skills: ["Behavioural psychology", "Survey design", "Insight synthesis"],
    scene: "/world/journey/psychology.webp",
    sign: "Psychology · IGNOU",
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
    skills: ["Integrated campaigns", "Go-to-market strategy", "Client pitching"],
    scene: "/world/journey/sociowash.webp",
    sign: "Marketing · Sociowash",
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
    skills: ["Product management", "Dashboard analytics", "Point-of-sale", "User research"],
    scene: "/world/journey/karnival.webp",
    sign: "Product · Karnival",
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
    skills: ["Interaction design", "Product design", "User research"],
    scene: "/world/journey/iitj.webp",
    sign: "Design · IIT Jodhpur",
  },
];

/* ------------------------------------------------------------------ */
/* Contact: what each number on the rotary dial connects to.           */
/* ------------------------------------------------------------------ */
export const directory = [
  {
    digit: 1,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ashita-taneja-2000/",
    note: "linkedin.com/in/ashita-taneja-2000",
  },
  {
    digit: 2,
    label: "Email",
    href: "mailto:taneja.ashita@gmail.com",
    note: "taneja.ashita@gmail.com",
  },
  {
    digit: 3,
    label: "Website",
    href: "https://atworks.com",
    note: "atworks.com",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Blog: journal entries. Empty until Ashita's posts are copied in;    */
/* the journal shows its own pages until then.                         */
/* ------------------------------------------------------------------ */
export type JournalEntry = { id: string; date: string; title: string; body: string };
export const journalEntries: JournalEntry[] = [];

/* ------------------------------------------------------------------ */
/* Gallery: Ashita's photographs. Add files to public/gallery and list  */
/* them here; the Gallery joins the menu once this list has photos.     */
/* ------------------------------------------------------------------ */
export type Photo = { src: string; width: number; height: number; caption: string; place?: string; date?: string };
export const galleryPhotos: Photo[] = [];
