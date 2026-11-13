import type { Metadata } from "next";
import Link from "next/link";
import ModeStrip from "@/components/ModeStrip";
import Journal from "@/components/blog/Journal";
import Fragment from "@/components/blog/Fragment";
import Avatar from "@/components/world/Avatar";
import HandNote from "@/components/world/HandNote";
import Receipt from "@/components/world/Receipt";

export const metadata: Metadata = { title: "Blog" };

const fragments = [
  { caption: "[a street I loved]", story: "[PLACEHOLDER: the story behind this photo]", tilt: -6 },
  { caption: "[golden hour]", story: "[PLACEHOLDER: what I noticed that day]", tilt: 5 },
  { caption: "[chai break]", story: "[PLACEHOLDER: a small everyday moment]", tilt: -3 },
  { caption: "[found on a walk]", story: "[PLACEHOLDER: why I kept this]", tilt: 7 },
];

export default function Blog() {
  return (
    <>
      <main className="relative min-h-dvh overflow-hidden bg-paper pb-36">
        <div className="relative px-5 pt-6 sm:px-10 sm:pt-8">
          <div className="mx-auto max-w-6xl">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]">
              ← Street
            </Link>
            <div className="mt-6 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-wood-dark">Blog · journal and fragments</p>
                <h1 className="mt-2 font-display text-[clamp(3rem,12vw,6.5rem)] uppercase leading-[0.9]">Notes from the walk.</h1>
                <p className="mt-4 max-w-xl text-lg text-ink-soft">
                  Pieces of everyday life, kept the old way. Open the journal to read, or flip a photo to see what&apos;s written on the back.
                </p>
              </div>
              <div aria-hidden="true" className="relative hidden h-52 shrink-0 md:block">
                <Avatar pose="read" className="h-full w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* the desk, with the journal and things lying around it */}
        <div className="floorboards relative mt-8 border-t-[5px] border-ink px-5 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
            <div className="flex flex-wrap justify-center gap-8 lg:flex-col lg:items-end">
              <Fragment {...fragments[0]} />
              <Receipt title="Bookshop" lines={["1 notebook|120", "2 pens|40"]} tilt={-4} className="hidden lg:block" />
              <Fragment {...fragments[1]} className="hidden sm:block" />
            </div>
            <div className="relative">
              <Journal />
              <span aria-hidden="true" className="absolute -top-2 right-0 hidden rotate-[6deg] sm:block">
                <HandNote arrow="down">open me</HandNote>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 lg:flex-col lg:items-start">
              <Fragment {...fragments[2]} />
              <Fragment {...fragments[3]} className="hidden sm:block" />
            </div>
          </div>
        </div>
      </main>
      <ModeStrip current="/blog" />
    </>
  );
}
