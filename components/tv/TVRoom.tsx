"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import ModeStrip from "../ModeStrip";
import Avatar from "../world/Avatar";
import HandNote from "../world/HandNote";
import { CHANNELS, ChannelScreen } from "./Channels";
import {
  Armchair,
  Bookshelf,
  Cabinet,
  Clock,
  FlowerPoster,
  Rug,
  SideTable,
  SmallFrame,
  Window,
} from "../home/Room";

export default function TVRoom() {
  const reduce = useReducedMotion();
  const [ch, setCh] = useState(0);
  const [switching, setSwitching] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const tune = useCallback(
    (next: number) => {
      const n = (next + CHANNELS.length) % CHANNELS.length;
      if (reduce) {
        setCh(n);
        return;
      }
      setSwitching(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        setCh(n);
        setSwitching(false);
      }, 260);
    },
    [reduce],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") tune(ch + 1);
      else if (e.key === "ArrowDown" || e.key === "ArrowLeft") tune(ch - 1);
      else if (/^[1-5]$/.test(e.key)) tune(Number(e.key) - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ch, tune]);

  const c = CHANNELS[ch];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-paper">
      <h1 className="sr-only">Ashita&apos;s TV: turn the knob to change channels</h1>

      <Link
        href="/"
        className="absolute left-3 top-3 z-30 flex min-h-11 items-center rounded-full border-[3px] border-ink bg-butter px-4 text-sm font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-px sm:left-6 sm:top-5"
      >
        ← Back to the street
      </Link>

      <div className="relative flex min-h-dvh flex-col pb-20">
        {/* ---------- Room (decorative) ---------- */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* wall shading */}
          <div className="halftone absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_35%,transparent_45%,black_100%)]" />
          {/* floor */}
          <div className="floorboards absolute inset-x-0 bottom-0 h-[24%] border-t-[5px] border-ink" />
          <div className="absolute inset-x-0 bottom-[24%] h-3 border-t-[5px] border-ink bg-wood-dark" />

          <div className="absolute -left-24 top-0 h-[70%] sm:-left-10 lg:left-0">
            <Window />
          </div>
          <div className="absolute left-[30%] top-[8%] h-16 w-16 sm:left-[22%] sm:top-[10%] sm:h-24 sm:w-24 lg:left-[20%] lg:h-28 lg:w-28">
            <Clock />
          </div>
          <div className="absolute right-[6%] top-[11%] h-28 w-24 sm:right-auto sm:left-[62%] sm:top-[6%] sm:h-40 sm:w-36 md:left-[68%] lg:left-[64%] lg:h-48 lg:w-44">
            <FlowerPoster />
          </div>
          <div className="absolute left-[34%] top-[5%] hidden h-32 w-24 lg:block">
            <SmallFrame />
          </div>
          <div className="absolute -right-6 bottom-[22%] hidden h-[74%] md:block lg:right-0">
            <Bookshelf />
          </div>
          <div className="absolute bottom-[20%] left-[2%] hidden h-[34%] lg:block">
            <SideTable />
          </div>
          <div className="absolute bottom-[3%] left-1/2 h-[10%] w-[92vw] max-w-[760px] -translate-x-[58%]">
            <Rug />
          </div>
        </div>

        {/* ---------- TV on its cabinet ---------- */}
        <div
          className="relative z-10 flex flex-1 flex-col items-center justify-end px-3 pt-24 pb-[13dvh] [--tv:min(92vw,640px,64dvh)] sm:pt-28"
        >
          <div className="w-[var(--tv)]">
            {/* antenna */}
            <svg viewBox="0 0 240 90" className="mx-auto -mb-2 block w-[46%]" aria-hidden="true">
              <line x1="120" y1="80" x2="34" y2="8" stroke="#13233A" strokeWidth="7" strokeLinecap="round" />
              <line x1="120" y1="80" x2="206" y2="8" stroke="#13233A" strokeWidth="7" strokeLinecap="round" />
              <circle cx="34" cy="8" r="7" fill="#13233A" />
              <circle cx="206" cy="8" r="7" fill="#13233A" />
              <path d="M80 92 A40 30 0 0 1 160 92Z" fill="#13233A" />
            </svg>

            {/* casing */}
            <div className="rounded-[28px] border-[5px] border-ink bg-wood p-[3%] shadow-[8px_8px_0_rgb(19_35_58/0.35)] sm:rounded-[36px]">
              <div className="flex gap-[3%]">
                {/* screen bezel */}
                <div className="flex-1 rounded-[22px] border-[4px] border-ink bg-ink p-[3%] sm:rounded-[28px]">
                  <div
                    role="region"
                    aria-roledescription="television"
                    aria-label={`Channel ${c.n}: ${c.name}`}
                    className="relative block aspect-[4/3] overflow-hidden rounded-[18px] bg-ink sm:rounded-[26px]"
                  >
                    <ChannelScreen index={ch} />
                    {switching && <span aria-hidden="true" className="tv-static absolute inset-0 z-20" />}
                    <span aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 z-20" />
                    <span aria-hidden="true" className="pointer-events-none absolute -left-[10%] -top-[30%] z-20 h-[70%] w-[60%] rotate-[-18deg] rounded-full bg-white/15" />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] shadow-[inset_0_0_40px_rgb(0_0_0/0.35)]" />
                    <span aria-hidden="true" className="absolute left-[4%] top-[5%] z-30 flex overflow-hidden rounded-md border-2 border-ink text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs">
                      <span className="bg-butter px-1.5 py-0.5 text-ink sm:px-2 sm:py-1">CH {c.n}</span>
                      <span className="bg-ink px-1.5 py-0.5 text-paper sm:px-2 sm:py-1">{c.name}</span>
                    </span>
                    <span aria-hidden="true" className="absolute right-[4%] top-[5%] z-30 flex items-center gap-1.5 rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-paper sm:px-2 sm:py-1 sm:text-xs">
                      <span className="rec-blink h-2 w-2 rounded-full bg-red" />
                      Live
                    </span>
                  </div>
                </div>

                {/* side panel: knobs + speaker */}
                <div className="flex w-[16%] flex-col items-center justify-between rounded-[14px] border-[4px] border-ink bg-wood-dark py-[4%]">
                  <button
                    type="button"
                    onClick={() => tune(ch + 1)}
                    aria-label={`Turn the channel knob. Now on channel ${c.n}, ${c.name}.`}
                    className="flex flex-col items-center gap-1 rounded-full p-1"
                  >
                    <span
                      className="relative grid aspect-square w-[min(56px,9vw)] place-items-center rounded-full border-[3px] border-ink bg-butter transition-transform duration-300"
                      style={{ rotate: `${ch * 72}deg` }}
                    >
                      <span className="absolute top-[8%] h-[34%] w-[10%] rounded-full bg-ink" />
                    </span>
                    <span className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-paper sm:block">CH</span>
                  </button>
                  <span aria-hidden="true" className="grid aspect-square w-[min(40px,6.5vw)] place-items-center rounded-full border-[3px] border-ink bg-cream" />
                  <span aria-hidden="true" className="grid aspect-square w-[min(40px,6.5vw)] place-items-center rounded-full border-[3px] border-ink bg-cream" />
                  <svg viewBox="0 0 40 60" className="w-[58%]" aria-hidden="true">
                    {[6, 18, 30, 42, 54].map((y) => (
                      <line key={y} x1="2" y1={y} x2="38" y2={y} stroke="#13233A" strokeWidth="5" strokeLinecap="round" />
                    ))}
                  </svg>
                </div>
              </div>

              {/* bottom bezel: channel preset buttons */}
              <div className="mt-[3%] flex justify-center">
                <ul className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-ink p-1 [scrollbar-width:none] sm:gap-1" aria-label="Channels">
                  {CHANNELS.map((x, i) => (
                    <li key={x.n} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => tune(i)}
                        aria-pressed={i === ch}
                        className={`flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors min-[400px]:text-[12px] sm:px-4 sm:text-[13px] sm:tracking-[0.14em] ${
                          i === ch ? "bg-butter text-ink" : "text-cream hover:bg-white/10 hover:text-paper"
                        }`}
                      >
                        {x.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ashita, remote in hand */}
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[8dvh] left-[2%] z-20 hidden h-[40dvh] lg:block xl:left-[8%]">
            <Avatar pose="stand" facing="right" className="h-full w-auto" />
            <span className="absolute -top-6 left-[60%] w-max rotate-[-4deg]">
              <HandNote arrow="right">{c.tag}</HandNote>
            </span>
          </div>

          {/* cabinet */}
          <div className="-mt-1 w-[min(98vw,calc(var(--tv)*1.12))]">
            <Cabinet />
          </div>
        </div>

        {/* armchair in the foreground: you're the one watching */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-[22%] bottom-0 z-20 h-[24dvh] sm:-right-[8%] sm:h-[30dvh] lg:right-0 lg:h-[36dvh]">
          <Armchair />
        </div>
      </div>
      <ModeStrip current="/tv" />
    </main>
  );
}
