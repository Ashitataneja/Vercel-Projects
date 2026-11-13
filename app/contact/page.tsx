import type { Metadata } from "next";
import ContactScene from "@/components/contact/ContactScene";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return <ContactScene />;
}
