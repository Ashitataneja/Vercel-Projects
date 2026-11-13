import type { Metadata } from "next";
import Link from "next/link";
import ModeStrip from "@/components/ModeStrip";
import TicketBoard from "@/components/work/TicketBoard";
import Avatar from "@/components/world/Avatar";
import HandNote from "@/components/world/HandNote";
import Receipt from "@/components/world/Receipt";

export const metadata: Metadata = { title: "Work" };

export default function Work() {
  return (
    <>
      <main className="relative min-h-dvh overflow-hidden bg-cream px-5 pb-36 pt-6 sm:px-10 sm:pt-8">
        {/* scrapbook page: dotted paper with a margin */}
        <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-6 hidden w-[3px] bg-red/40 sm:block lg:left-12" />

        {/* little things collected around the page */}
        <Receipt title="Chai stall" lines={["2 cutting chai|30", "bun maska|25", "total|55"]} tilt={6} className="absolute -right-8 top-28 hidden xl:block" />
        <Receipt title="Photo lab" lines={["36 prints|420", "1 film roll|380"]} tilt={-5} className="absolute -left-6 bottom-40 hidden xl:block" />

        <div className="relative mx-auto max-w-5xl">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]">
            ← Street
          </Link>
          <header className="mb-12 mt-6 flex items-end justify-between gap-6 sm:mb-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md border-[3px] border-ink bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-butter">
                <span aria-hidden="true" className="rec-blink h-2 w-2 rounded-full bg-red" />
                My ticket collection
              </p>
              <h1 className="mt-4 font-display text-[clamp(3rem,12vw,6.5rem)] uppercase leading-[0.9] text-ink">Pick a ticket.</h1>
              <p className="mt-4 max-w-xl text-lg text-ink-soft">
                I keep every ticket, bill and little scrap from places I&apos;ve been. These are my projects. Pull a stub to tear one
                open, or just click it.
              </p>
            </div>
            <div aria-hidden="true" className="relative hidden h-56 shrink-0 md:block">
              <Avatar pose="wave" facing="left" className="h-full w-auto" />
              <span className="absolute -left-36 top-2 w-max rotate-[-5deg]">
                <HandNote arrow="right">tear one!</HandNote>
              </span>
            </div>
          </header>
          <TicketBoard />
        </div>
      </main>
      <ModeStrip current="/work" />
    </>
  );
}
