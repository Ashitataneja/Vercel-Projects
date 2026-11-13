import type { Metadata } from "next";
import Link from "next/link";
import ModeStrip from "@/components/ModeStrip";
import Journal from "@/components/blog/Journal";

export const metadata: Metadata = { title: "Blog" };

export default function Blog() {
  return (
    <>
      <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,var(--color-cream),var(--color-paper)_70%)] px-5 pb-36 pt-5 sm:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]">
            ← Street
          </Link>
          <h1 className="font-display text-2xl uppercase tracking-wide">Blog</h1>
        </div>
        <div className="mx-auto mt-[12dvh] flex justify-center">
          <Journal />
        </div>
      </main>
      <ModeStrip current="/blog" />
    </>
  );
}
