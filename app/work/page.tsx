import type { Metadata } from "next";
import WorkScene from "@/components/work/WorkScene";

export const metadata: Metadata = { title: "Work" };

export default function Work() {
  return <WorkScene />;
}
