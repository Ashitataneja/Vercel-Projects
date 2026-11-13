import type { Metadata } from "next";
import ModeStrip from "@/components/ModeStrip";
import TicketBoard from "@/components/work/TicketBoard";

export const metadata: Metadata = { title: "Work" };

export default function Work() {
  return (
    <>
      <main className="relative min-h-dvh overflow-hidden bg-paper px-5 pb-36 pt-10 sm:px-10 sm:pt-14">
        <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl">
          {/* box-office sign */}
          <header className="mb-12 sm:mb-16">
            <p className="inline-flex items-center gap-2 rounded-md border-[3px] border-ink bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-butter">
              <span aria-hidden="true" className="rec-blink h-2 w-2 rounded-full bg-red" />
              Box office · now showing
            </p>
            <h1 className="mt-4 font-display text-[clamp(3rem,12vw,6.5rem)] uppercase leading-[0.9] text-ink">
              Pick a ticket.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Every project is a ticket. Pull the stub to tear it open, or just click it.
            </p>
          </header>
          <TicketBoard />
        </div>
      </main>
      <ModeStrip current="/work" />
    </>
  );
}
