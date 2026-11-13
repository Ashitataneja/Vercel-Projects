import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <PageShell
      current="/contact"
      eyebrow="Pick up the phone"
      title="Contact"
      intro="[PLACEHOLDER] The rotary phone comes back here, with email, LinkedIn and resume."
    />
  );
}
