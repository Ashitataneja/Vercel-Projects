import type { Metadata } from "next";
import TVRoom from "@/components/tv/TVRoom";

export const metadata: Metadata = { title: "TV" };

export default function TV() {
  return <TVRoom />;
}
