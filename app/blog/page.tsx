import type { Metadata } from "next";
import BlogScene from "@/components/blog/BlogScene";

export const metadata: Metadata = { title: "Blog" };

export default function Blog() {
  return <BlogScene />;
}
