import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Blog" };

export default function Blog() {
  return (
    <PageShell
      current="/blog"
      eyebrow="Off air"
      title="Blog"
      intro="[PLACEHOLDER] Launches with 3–4 real posts."
    />
  );
}
