"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import Avatar from "../world/Avatar";
import HandNote from "../world/HandNote";
import Signboard from "../world/Signboard";
import PinnedPhoto from "../world/PinnedPhoto";
import ModeStrip from "../ModeStrip";
import Landmark from "./Landmarks";
import { journey } from "@/lib/site";

/*
 * About me as a road. The visitor walks Ashita along it (scroll, drag,
 * swipe, arrow keys or the Walk on button); each landmark is a chapter.
 * Same "u" unit and camera model as the street on the home page.
 */
const SHORT: Record<string, string> = {
  sbsc: "SBSC · 2018",
  kpmg: "KPMG · 2021",
  psychology: "Psychology MA",
  sociowash: "Sociowash · 2022",
  "woovly-freelance": "Woovly + freelance",
  karnival: "Karnival · 2024",
  iitj: "IIT Jodhpur · now",
};
const MEMORY: Record<string, string> = {
  sbsc: "[PLACEHOLDER: a college memory]",
  kpmg: "[PLACEHOLDER: first job memory]",
  psychology: "[PLACEHOLDER: why psychology]",
  sociowash: "[PLACEHOLDER: a campaign day]",
  "woovly-freelance": "[PLACEHOLDER: first design gig]",
  karnival: "[PLACEHOLDER: a launch day]",
  iitj: "[PLACEHOLDER: campus in Jodhpur]",
};

/** A painted Delhi scene behind each stop (the last stop, Jodhpur, is drawn). Widths in u; panels are 76u tall. */
const SCENE: Record<string, { src?: string; w: number }> = {
  sbsc: { src: "/world/chandnichowk.webp", w: 135 },
  kpmg: { src: "/world/cp.webp", w: 135 },
  psychology: { src: "/world/lodhi.webp", w: 135 },
  sociowash: { src: "/world/indiagate.webp", w: 135 },
  "woovly-freelance": { src: "/world/street.webp", w: 203 },
  karnival: { src: "/world/qutub.webp", w: 135 },
  iitj: { w: 120 },
};
const LEAD = 30; // u of open road before the first scene
const panelLeft = (i: number) => LEAD + journey.slice(0, i).reduce((a, s) => a + SCENE[s.id].w, 0);
const START = 10;
const stand = (i: number) => panelLeft(i) + 16;
const TRACK = panelLeft(journey.length);
const u = (n: number) => `calc(var(--u) * ${n})`;

export default function JourneyRoad() {
  const reduce = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const unit = useRef(8);
  const frac = useRef(0.3);
  const [avatarFrac, setAvatarFrac] = useState(0.3);
  const cam = useMotionValue(0);
  const worldX = useTransform(cam, (c) => -c);
    const [here, setHere] = useState(START);
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [reached, setReached] = useState(-1);
  const [overview, setOverview] = useState(false);
  const [memory, setMemory] = useState<string | null>(null);
  const stopTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const ready = useRef(false);
  const cardRef = useRef<HTMLHeadingElement>(null);

  const bounds = useCallback(() => {
    const w = mainRef.current?.clientWidth ?? 1000;
    const ax = w * frac.current;
    return { ax, min: START * unit.current - ax - 4 * unit.current, max: TRACK * unit.current - ax };
  }, []);
  const clamp = useCallback((v: number) => {
    const b = bounds();
    return Math.min(b.max, Math.max(b.min, v));
  }, [bounds]);

  useEffect(() => {
    function measure() {
      const el = mainRef.current;
      if (!el) return;
      unit.current = (probeRef.current?.offsetWidth ?? el.clientHeight) / 100;
      frac.current = el.clientWidth < 640 ? 0.24 : 0.3;
      setAvatarFrac(frac.current);
      ready.current = false;
      cam.set(clamp(START * unit.current - bounds().ax));
      ready.current = true;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [bounds, cam, clamp]);

  useMotionValueEvent(cam, "change", (v) => {
    const prev = cam.getPrevious() ?? v;
    if (ready.current && Math.abs(v - prev) > 0.5) {
      setFacing(v > prev ? "right" : "left");
      setWalking(true);
      window.clearTimeout(stopTimer.current);
      stopTimer.current = window.setTimeout(() => setWalking(false), 180);
    }
    const pos = (v + bounds().ax) / unit.current;
    setHere(pos);
    let r = -1;
    journey.forEach((_, i) => {
      if (pos >= stand(i) - 8) r = i;
    });
    setReached((old) => Math.max(old, r));
  });

  const walkTo = useCallback(
    (worldU: number) => {
      const target = clamp(worldU * unit.current - bounds().ax);
      const dist = Math.abs(target - cam.get());
      if (reduce || dist < 2) return cam.set(target);
      animate(cam, target, { duration: Math.min(2.2, 0.4 + dist / 800), ease: [0.45, 0, 0.55, 1] });
    },
    [bounds, cam, clamp, reduce],
  );

  const at = journey.findIndex((_, i) => Math.abs(here - stand(i)) < 14);
  const showCard = !walking && !overview;
  const next = at >= 0 ? at + 1 : journey.findIndex((_, i) => stand(i) > here);
  const prev = at >= 0 ? at - 1 : -1;

  // Input: wheel and keys move the camera; arrow keys hop between stops.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      if (overview) return;
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      cam.stop();
      cam.set(clamp(cam.get() + d));
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [cam, clamp, overview]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (overview || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" && next >= 0 && next < journey.length) walkTo(stand(next));
      if (e.key === "ArrowLeft") walkTo(prev >= 0 ? stand(prev) : START);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, walkTo, overview]);

  // Focus the stop's heading on arrival so keyboard and screen-reader users follow the walk.
  useEffect(() => {
    if (at >= 0 && showCard) cardRef.current?.focus({ preventScroll: true });
  }, [at, showCard]);

  const stop = at >= 0 ? journey[at] : null;

  return (
    <main
      ref={mainRef}
      className="relative h-dvh touch-pan-y select-none overflow-clip bg-sky [--u:min(1dvh,1.8vw)]"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button, a, [data-card]")) return;
        drag.current = { x: e.clientX, moved: false };
        cam.stop();
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (!d.moved && Math.abs(dx) < 6) return;
        if (!d.moved) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        d.moved = true;
        d.x = e.clientX;
        cam.set(clamp(cam.get() - dx * 1.4));
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <div ref={probeRef} aria-hidden="true" className="invisible absolute h-0" style={{ width: u(100) }} />

      <div aria-hidden="true" className="halftone absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      {/* the road and the stops */}
      <motion.div className="absolute inset-y-0 left-0" style={{ x: worldX, width: u(TRACK + 120) }}>
        {/* the road before the first stop */}
        <div aria-hidden="true" className="street-ground absolute overflow-hidden" style={{ left: u(LEAD - 140), width: u(140.5), height: u(76) }}>
          <Image src="/world/street.webp" alt="" fill sizes="100vw" className="object-cover object-left-bottom" draggable={false} priority />
        </div>
        {/* painted Delhi behind each stop */}
        {journey.map((s, i) =>
          SCENE[s.id].src ? (
            <div key={`scene-${s.id}`} aria-hidden="true" className="street-ground absolute overflow-hidden" style={{ left: u(panelLeft(i)), width: u(SCENE[s.id].w + 0.5), height: u(76) }}>
              <Image src={SCENE[s.id].src!} alt="" fill sizes="(max-width: 640px) 160vw, 100vw" className="object-cover object-bottom" draggable={false} priority={i === 0} />
              {/* places you haven't reached yet are still a sketch in the fog */}
              <span className={`absolute inset-0 bg-paper transition-opacity duration-700 ${i <= reached + 1 ? "opacity-0" : "opacity-75"}`} />
            </div>
          ) : (
            <div key={`scene-${s.id}`} aria-hidden="true" className="street-ground absolute bg-[linear-gradient(to_bottom,var(--color-sky),var(--color-cream))]" style={{ left: u(panelLeft(i)), width: u(SCENE[s.id].w + 40), height: u(76) }} />
          ),
        )}
        <div aria-hidden="true" className="street-road absolute bottom-0 left-[-100vw] right-[-100vw] border-t-[4px] border-ink bg-stone">
          <div className="absolute inset-x-0 top-[22%] h-[78%] border-t-[4px] border-ink bg-asphalt">
            <div className="absolute inset-x-0 -top-[10px] h-[10px] bg-[repeating-linear-gradient(90deg,var(--color-ink)_0_28px,var(--color-paper)_28px_56px)]" />
            <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--color-paper)_0_48px,transparent_48px_96px)] opacity-80" />
          </div>
        </div>

        {/* start */}
        <div className="street-ground absolute" style={{ left: u(START - 6) }}>
          <span className="sticker block"><Signboard point="right" tone="cream">Start</Signboard></span>
        </div>

        {journey.map((s, i) => {
          const known = i <= reached + 1;
          return (
            <div key={s.id} className="street-ground absolute" style={{ left: u(stand(i) + 6) }}>
              <div className={`relative flex items-end gap-[calc(var(--u)*2)] transition-opacity duration-500 ${known ? "opacity-100" : "opacity-30"}`}>
                <button
                  type="button"
                  onClick={() => walkTo(stand(i))}
                  onFocus={() => walkTo(stand(i))}
                  aria-label={known ? `Walk to stop ${i + 1}: ${s.place}` : `Walk to stop ${i + 1}`}
                  className="relative z-10 -mb-1"
                >
                  <span className="sticker block">
                  <Signboard point="none" tone={i === at ? "butter" : "cream"}>
                    <span className="block text-[0.7em] opacity-70">Stop {i + 1}</span>
                    {known ? SHORT[s.id] : "?"}
                  </Signboard>
                  </span>
                </button>
                <div className="relative" style={{ height: u(SCENE[s.id].src ? 30 : 40), width: u(SCENE[s.id].src ? 12 : 52) }}>
                  {!SCENE[s.id].src && (
                    <span className="sticker block h-full">
                      <Landmark icon={s.icon} />
                    </span>
                  )}
                  {known && (
                    <button
                      type="button"
                      onClick={() => setMemory(memory === s.id ? null : s.id)}
                      aria-expanded={memory === s.id}
                      aria-label={`Photo from ${s.place}: show the story`}
                      className="absolute -top-[calc(var(--u)*6)] left-0 w-[calc(var(--u)*16)] max-w-[170px]"
                    >
                      <PinnedPhoto tilt={i % 2 ? 4 : -4} caption={memory === s.id ? undefined : "tap me"}>
                        {memory === s.id ? <span className="p-1 font-hand text-sm leading-tight text-ink">{MEMORY[s.id]}</span> : undefined}
                      </PinnedPhoto>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="street-ground absolute" style={{ left: u(TRACK - 16) }}>
          <Link href="/" aria-label="Back to the street">
            <span className="sticker block"><Signboard point="left" tone="cream">To the street</Signboard></span>
          </Link>
        </div>
      </motion.div>

      {/* Ashita */}
      <div className="street-feet pointer-events-none absolute z-10 -translate-x-1/2" style={{ left: `${avatarFrac * 100}%`, height: u(34) }}>
        <Avatar pose={walking ? "walk" : at === -1 && here < stand(0) ? "wave" : "stand"} facing={facing} className="h-full w-auto" />
      </div>

      {/* header */}
      <header className="absolute left-3 right-3 top-3 z-30 flex items-start justify-between gap-3 sm:left-6 sm:right-6 sm:top-5">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]">
            ← Street
          </Link>
          <h1 className="mt-3 inline-block -rotate-1 rounded-md border-[3px] border-ink bg-paper px-3 pt-1 font-display text-[clamp(1.6rem,5vw,3rem)] uppercase leading-none shadow-[3px_3px_0_var(--color-ink)]">How I got here</h1>
          <ol className="mt-2 flex w-max gap-1.5 rounded-full bg-paper/85 px-2" aria-label="Stops on the road">
            {journey.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => walkTo(stand(i))}
                  aria-label={`Stop ${i + 1}${i <= reached ? `: ${s.place}` : ""}`}
                  aria-current={i === at ? "step" : undefined}
                  className="grid h-11 w-6 place-items-center"
                >
                  <span className={`block h-3.5 w-3.5 rounded-full border-[3px] border-ink ${i === at ? "bg-red" : i <= reached ? "bg-butter" : "bg-paper"}`} />
                </button>
              </li>
            ))}
          </ol>
        </div>
        <button
          type="button"
          onClick={() => setOverview(true)}
          className="min-h-11 rounded-full border-[3px] border-ink bg-butter px-4 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]"
        >
          <span className="hidden sm:inline">In a hurry? </span>All stops
        </button>
      </header>

      {/* the story at this stop */}
      <AnimatePresence>
        {showCard && (
          <motion.section
            key={stop?.id ?? "intro"}
            data-card
            aria-live="polite"
            initial={{ opacity: 0, y: 16, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-3 bottom-[84px] z-20 max-h-[34dvh] overflow-y-auto rounded-xl border-[4px] border-ink bg-cream p-4 shadow-[6px_6px_0_var(--color-ink)] sm:inset-x-auto sm:right-6 sm:top-28 sm:bottom-auto sm:max-h-[60dvh] sm:w-[380px] sm:p-5"
          >
            <span aria-hidden="true" className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[3deg] bg-butter/80" />
            {stop ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-wood-dark">
                  Stop {at + 1} of {journey.length} · {stop.when}
                </p>
                <h2 ref={cardRef} tabIndex={-1} className="mt-1 font-display text-2xl uppercase leading-none outline-none sm:text-3xl">
                  {stop.place}
                </h2>
                <p className="mt-1 font-semibold">{stop.role}</p>
                <ul className="mt-2 space-y-1.5 text-[15px]">
                  {stop.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {at < journey.length - 1 ? (
                    <button type="button" onClick={() => walkTo(stand(at + 1))} className="min-h-11 rounded-full border-[3px] border-ink bg-butter px-4 font-bold shadow-[3px_3px_0_var(--color-ink)]">
                      Walk on →
                    </button>
                  ) : (
                    <HandNote>that&apos;s me, today. thanks for walking with me!</HandNote>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl uppercase leading-none sm:text-3xl">Walk with me</h2>
                <p className="mt-2">Commerce, audit, psychology, marketing, product, then design. Seven stops so far.</p>
                <button type="button" onClick={() => walkTo(stand(next >= 0 ? next : 0))} className="mt-3 min-h-11 rounded-full border-[3px] border-ink bg-butter px-4 font-bold shadow-[3px_3px_0_var(--color-ink)]">
                  Start walking →
                </button>
                <HandNote className="mt-2 block text-ink-soft">or scroll, drag, swipe or use ← →</HandNote>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* everything at once, for anyone in a hurry */}
      <AnimatePresence>
        {overview && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="overview-h"
            className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={(e) => e.key === "Escape" && setOverview(false)}
          >
            <div className="mx-auto max-w-3xl rounded-2xl border-[4px] border-ink bg-paper p-5 shadow-[8px_8px_0_var(--color-ink)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 id="overview-h" className="font-display text-3xl uppercase sm:text-4xl">The whole road</h2>
                <button type="button" autoFocus onClick={() => setOverview(false)} className="min-h-11 rounded-full border-[3px] border-ink bg-butter px-4 text-sm font-bold">
                  Close ✕
                </button>
              </div>
              <ol className="mt-6 space-y-6">
                {journey.map((s, i) => (
                  <li key={s.id} className="border-l-[4px] border-dashed border-ink pl-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-wood-dark">
                      Stop {i + 1} · {s.when}
                    </p>
                    <h3 className="font-display text-2xl uppercase">{s.place}</h3>
                    <p className="font-semibold">{s.role}</p>
                    <ul className="mt-1 list-disc pl-5 text-[15px]">
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModeStrip current="/about" />
    </main>
  );
}
