import type { Metadata } from "next";
import GalleryScene from "@/components/gallery/GalleryScene";

export const metadata: Metadata = { title: "Gallery", robots: { index: false } };

export default function Gallery() {
  return <GalleryScene />;
}
