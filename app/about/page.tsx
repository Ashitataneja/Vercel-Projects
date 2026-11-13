import type { Metadata } from "next";
import ModeStrip from "@/components/ModeStrip";
import JourneyMap from "@/components/about/JourneyMap";

export const metadata: Metadata = { title: "About me" };

export default function About() {
  return (
    <>
      <main className="relative min-h-dvh bg-paper px-4 pb-72 pt-10 sm:px-8 sm:pt-14 lg:pb-36">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-wood-dark">About me · a map</p>
            <h1 className="mt-2 font-display text-[clamp(3rem,11vw,6rem)] uppercase leading-[0.9]">How I got here.</h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-soft">
              I&apos;m Ashita. I studied commerce and psychology, worked in audit, marketing and product, and now design. Walk the
              route one stop at a time.
            </p>
          </header>
          <JourneyMap />
        </div>
      </main>
      <ModeStrip current="/about" />
    </>
  );
}
