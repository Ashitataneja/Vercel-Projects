import type { Metadata } from "next";
import ModeStrip from "@/components/ModeStrip";
import RotaryPhone from "@/components/contact/RotaryPhone";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <main className="relative min-h-dvh overflow-hidden bg-paper px-5 pb-36 pt-10 sm:px-10 sm:pt-14">
        <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_55%,transparent_40%,black_100%)]" />
        <div className="relative mx-auto max-w-6xl">
          <header className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-wood-dark">Pick up the phone</p>
            <h1 className="mt-2 font-display text-[clamp(3rem,12vw,6.5rem)] uppercase leading-[0.9]">Give me a ring.</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Dial <strong className="text-ink">1</strong> for LinkedIn, <strong className="text-ink">2</strong> for email. Drag a hole round to the
              yellow stop and let go, or press the number on your keyboard.
            </p>
          </header>
          <RotaryPhone />
        </div>
      </main>
      <ModeStrip current="/contact" />
    </>
  );
}
