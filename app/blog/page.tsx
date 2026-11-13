import type { Metadata } from "next";
import ModeStrip from "@/components/ModeStrip";
import Journal from "@/components/blog/Journal";

export const metadata: Metadata = { title: "Blog" };

export default function Blog() {
  return (
    <>
      <main className="relative min-h-dvh overflow-hidden bg-paper pb-36">
        <div className="relative px-5 pt-10 sm:px-10 sm:pt-14">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-wood-dark">Blog · the journal</p>
            <h1 className="mt-2 font-display text-[clamp(3rem,12vw,6.5rem)] uppercase leading-[0.9]">Notes from the walk.</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">Photographs and thoughts, kept the old way. Open the journal to read.</p>
          </div>
        </div>
        {/* the desk */}
        <div className="floorboards relative mt-10 border-t-[5px] border-ink px-5 py-12 sm:py-16">
          <Journal />
        </div>
      </main>
      <ModeStrip current="/blog" />
    </>
  );
}
