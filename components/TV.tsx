"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CitySkyline from "./CitySkyline";
import ModeStrip from "./ModeStrip";
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
} from "./home/Room";

const CITY_HREF = "/about";

export default function TV() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLAnchorElement>(null);
  const [origin, setOrigin] = useState("50% 40%");
  const [entering, setEntering] = useState(false);

  function stepInside(e: React.MouseEvent<HTMLAnchorElement>) {
    // New-tab and modified clicks behave like a normal link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (reduce) return; // plain navigation, no zoom
    e.preventDefault();
    const scene = sceneRef.current?.getBoundingClientRect();
    const screen = screenRef.current?.getBoundingClientRect();
    if (scene && screen) {
      setOrigin(`${screen.left + screen.width / 2 - scene.left}px ${screen.top + screen.height / 2 - scene.top}px`);
    }
    setEntering(true);
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-paper">
      <h1 className="sr-only">Ashita, interaction and product designer</h1>

      <Link
        href="/work"
        className="absolute right-3 top-3 z-30 flex min-h-11 items-center rounded-full border-[3px] border-ink bg-butter px-4 text-sm font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-px sm:right-6 sm:top-5"
      >
        Skip to my work →
      </Link>

      <motion.div
        ref={sceneRef}
        className="relative flex min-h-dvh flex-col"
        style={{ transformOrigin: origin }}
        animate={entering ? { scale: 8 } : { scale: 1 }}
        transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
        onAnimationComplete={() => entering && router.push(CITY_HREF)}
      >
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
          className="relative z-10 flex flex-1 flex-col items-center justify-end px-3 pt-24 pb-[11dvh] [--tv:min(92vw,640px,64dvh)] sm:pt-28"
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
                  <Link
                    ref={screenRef}
                    href={CITY_HREF}
                    onClick={stepInside}
                    aria-label="Step inside the TV and walk through Ashita's city (About me)"
                    className="group relative block aspect-[4/3] overflow-hidden rounded-[18px] bg-sky sm:rounded-[26px]"
                  >
                    <span aria-hidden="true" className="absolute right-[22%] top-[17%] h-[18%] aspect-square rounded-full border-[3px] border-ink bg-butter" />
                    <CitySkyline />
                    <span aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />
                    {/* glass glare */}
                    <span aria-hidden="true" className="pointer-events-none absolute -left-[10%] -top-[30%] h-[70%] w-[60%] rotate-[-18deg] rounded-full bg-white/25" />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_40px_rgb(0_0_0/0.35)]" />

                    {/* channel logo */}
                    <span aria-hidden="true" className="absolute left-[4%] top-[5%] flex overflow-hidden rounded-md border-2 border-ink text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs">
                      <span className="bg-butter px-1.5 py-0.5 text-ink sm:px-2 sm:py-1">CH 01</span>
                      <span className="bg-ink px-1.5 py-0.5 text-paper sm:px-2 sm:py-1">Ashita</span>
                    </span>
                    <span aria-hidden="true" className="absolute right-[4%] top-[5%] flex items-center gap-1.5 rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-paper sm:px-2 sm:py-1 sm:text-xs">
                      <span className="rec-blink h-2 w-2 rounded-full bg-red" />
                      Live
                    </span>

                    {/* call to step in */}
                    <span aria-hidden="true" className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${entering ? "opacity-0" : ""}`}>
                      <span className="flex items-center gap-2 rounded-full border-[3px] border-ink bg-paper px-4 py-2 font-display text-base uppercase tracking-wide text-ink shadow-[4px_4px_0_var(--color-ink)] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5 sm:px-5 sm:py-3 sm:text-2xl">
                        Step inside
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 sm:h-5 sm:w-5" aria-hidden="true">
                          <path d="M4 2 L13 8 L4 14Z" fill="currentColor" />
                        </svg>
                      </span>
                    </span>

                    {/* lower third */}
                    <span aria-hidden="true" className={`absolute inset-x-[4%] bottom-[5%] transition-opacity duration-300 ${entering ? "opacity-0" : ""}`}>
                      <span className="inline-block max-w-full rounded-md bg-ink/90 px-2 py-1 text-[11px] leading-snug text-paper sm:px-3 sm:py-2 sm:text-sm">
                        <span className="font-bold text-butter">Now playing · </span>
                        the places that shaped how I design
                      </span>
                    </span>
                  </Link>
                </div>

                {/* side panel: knobs + speaker */}
                <div className="flex w-[16%] flex-col items-center justify-between rounded-[14px] border-[4px] border-ink bg-wood-dark py-[4%]">
                  <Link
                    href="/work"
                    aria-label="Turn the channel knob: see my work"
                    className="group/knob flex flex-col items-center gap-1 rounded-full p-1"
                  >
                    <span className="relative grid aspect-square w-[min(56px,9vw)] place-items-center rounded-full border-[3px] border-ink bg-butter transition-transform duration-300 group-hover/knob:rotate-[60deg] group-focus-visible/knob:rotate-[60deg]">
                      <span className="absolute top-[8%] h-[34%] w-[10%] rounded-full bg-ink" />
                    </span>
                    <span className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-paper sm:block">CH</span>
                  </Link>
                  <span aria-hidden="true" className="grid aspect-square w-[min(40px,6.5vw)] place-items-center rounded-full border-[3px] border-ink bg-cream" />
                  <span aria-hidden="true" className="grid aspect-square w-[min(40px,6.5vw)] place-items-center rounded-full border-[3px] border-ink bg-cream" />
                  <svg viewBox="0 0 40 60" className="w-[58%]" aria-hidden="true">
                    {[6, 18, 30, 42, 54].map((y) => (
                      <line key={y} x1="2" y1={y} x2="38" y2={y} stroke="#13233A" strokeWidth="5" strokeLinecap="round" />
                    ))}
                  </svg>
                </div>
              </div>

              {/* bottom bezel: the camera-mode switcher */}
              <div className="mt-[3%]">
                <ModeStrip current="/" variant="tv" />
              </div>
            </div>
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
      </motion.div>

      {/* fade into the city as we pass through the glass */}
      {entering && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 bg-blue-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        />
      )}
    </main>
  );
}
