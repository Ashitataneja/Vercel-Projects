import type { Metadata } from "next";
import JourneyRoad from "@/components/about/JourneyRoad";

export const metadata: Metadata = { title: "About me" };

export default function About() {
  return <JourneyRoad />;
}
