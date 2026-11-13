import type { Metadata } from "next";
import Link from "next/link";
import ModeStrip from "@/components/ModeStrip";
import RotaryPhone from "@/components/contact/RotaryPhone";
import Avatar from "@/components/world/Avatar";
import HandNote from "@/components/world/HandNote";
import PaintedBackdrop from "@/components/world/PaintedBackdrop";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      {/* inside the red telephone booth */}
      <main className="relative min-h-dvh overflow-hidden px-3 pb-36 pt-6 sm:px-6 sm:pt-8">
        <PaintedBackdrop src="/world/indiagate.webp" position="50% 40%" wash="none" />
        {/* the booth: red frame, paper inside */}
        <div className="sticker relative mx-auto max-w-6xl rounded-t-[48px] rounded-b-[14px] border-[5px] border-ink bg-red p-3 sm:p-4">
        <div className="relative rounded-t-[36px] rounded-b-[8px] border-[4px] border-ink bg-paper px-5 pb-12 pt-6 sm:px-10">
          <div className="flex items-start justify-between gap-4">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]">
              ← Street
            </Link>
            <p aria-hidden="true" className="rounded-md border-[3px] border-ink bg-ink px-3 py-1 text-xs font-black uppercase tracking-[0.3em] text-paper">Telephone</p>
          </div>
          <header className="mb-10 mt-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-wood-dark">Pick up the phone</p>
              <h1 className="mt-2 font-display text-[clamp(3rem,12vw,6.5rem)] uppercase leading-[0.9]">Give me a ring.</h1>
              <p className="mt-4 max-w-xl text-lg text-ink-soft">
                Dial <strong className="text-ink">1</strong> for LinkedIn, <strong className="text-ink">2</strong> for email. Drag a hole round to the
                yellow stop and let go, or press the number on your keyboard.
              </p>
            </div>
            <div aria-hidden="true" className="relative hidden h-52 shrink-0 md:block">
              <Avatar pose="phone" facing="left" className="h-full w-auto" />
              <span className="absolute -left-28 top-0 w-max rotate-[-5deg]">
                <HandNote arrow="right">hello?</HandNote>
              </span>
            </div>
          </header>
          <RotaryPhone />
        </div>
        </div>
      </main>
      <ModeStrip current="/contact" />
    </>
  );
}
