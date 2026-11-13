"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import Avatar from "../world/Avatar";
import HandNote from "../world/HandNote";
import Signboard from "../world/Signboard";
import Road from "../world/Road";
import ModeStrip from "../ModeStrip";
import { journey } from "@/lib/site";
import { downloadMemoryCard } from "@/lib/memoryCard";

/*
 * About me as a road trip through Ashita's painted scenes.
 * Everything is measured in "u" (CSS var --u = min(1dvh, 1.8vw)); scenes are
 * 76u tall and as wide as their painting. The avatar stays put on screen and
 * walks while the world slides by (scroll, drag, swipe, arrow keys, buttons).
 */
const H = 76; // scene height in u
const START_SCENE = { scene: "/world/journey/delhi.webp", ratio: 2048 / 768 };
const RATIO: Record<string, number> = { sbsc: 2172 / 724 };
const width = (id: string) => H * (RATIO[id] ?? 2048 / 768);
const LEAD = H * START_SCENE.ratio; // Delhi, where the walk begins
const panelLeft = (i: number) => LEAD + journey.slice(0, i).reduce((a, s) => a + width(s.id), 0);
const stand = (i: number) => panelLeft(i) + 34;
const START = 30;
const TRACK = panelLeft(journey.length);
const u = (n: number) => `calc(var(--u) * ${n})`;
const ROUTE = ["Delhi", ...journey.map((s) => s.sign.split(" · ")[1] ?? s.sign)];

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
  const [saving, setSaving] = useState(false);
  const stopTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const ready = useRef(false);
  const cardRef = useRef<HTMLHeadingElement>(null);

  const bounds = useCallback(() => {
    const w = mainRef.current?.clientWidth ?? 1000;
    return { ax: w * frac.current, min: 0, max: TRACK * unit.current - w };
  }, []);
  const clamp = useCallback(
    (v: number) => {
      const b = bounds();
      return Math.min(b.max, Math.max(b.min, v));
    },
    [bounds],
  );

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
      if (pos >= stand(i) - 10) r = i;
    });
    setReached((old) => Math.max(old, r));
  });

  const walkTo = useCallback(
    (worldU: number) => {
      const target = clamp(worldU * unit.current - bounds().ax);
      const dist = Math.abs(target - cam.get());
      if (reduce || dist < 2) return cam.set(target);
      animate(cam, target, { duration: Math.min(2.4, 0.45 + dist / 900), ease: [0.45, 0, 0.55, 1] });
    },
    [bounds, cam, clamp, reduce],
  );

  const at = journey.findIndex((_, i) => Math.abs(here - stand(i)) < 18);
  const showCard = !walking && !overview;
  const next = at >= 0 ? at + 1 : journey.findIndex((_, i) => stand(i) > here);
  const prev = at >= 0 ? at - 1 : -1;

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

  useEffect(() => {
    if (at >= 0 && showCard) cardRef.current?.focus({ preventScroll: true });
  }, [at, showCard]);

  const stop = at >= 0 ? journey[at] : null;

  async function keepMemory() {
    if (!stop) return;
    setSaving(true);
    try {
      await downloadMemoryCard(
        { scene: stop.scene, title: stop.place.split(",")[0], subtitle: `${stop.role} · ${stop.when}`, route: { names: ROUTE, at: at + 1 } },
        `ashita-${stop.id}-memory.png`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      ref={mainRef}
      className="relative h-dvh touch-pan-y select-none overflow-clip bg-[#1c1b1d] [--u:min(1dvh,1.8vw)]"
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

      <motion.div className="absolute inset-y-0 left-0" style={{ x: worldX, width: u(TRACK + 20) }}>
        {/* Delhi, where the walk begins */}
        <div aria-hidden="true" className="street-ground absolute overflow-hidden" style={{ left: 0, width: u(LEAD + 0.5), height: u(H) }}>
          <Image src={START_SCENE.scene} alt="" fill priority sizes="200vw" className="object-cover object-bottom" draggable={false} />
        </div>
        {/* one painted scene per chapter; places not reached yet wait in the haze */}
        {journey.map((s, i) => (
          <div key={`scene-${s.id}`} aria-hidden="true" className="street-ground absolute overflow-hidden" style={{ left: u(panelLeft(i)), width: u(width(s.id) + 0.5), height: u(H) }}>
            <Image src={s.scene} alt="" fill priority={i === 0} sizes="200vw" className="object-cover object-bottom" draggable={false} />
            <span className={`absolute inset-0 bg-[#f6eedc] transition-opacity duration-700 ${i <= reached + 1 ? "opacity-0" : "opacity-70"}`} />
          </div>
        ))}
        <Road />

        {/* signboards: real buttons that walk you there */}
        {journey.map((s, i) => {
          const known = i <= reached + 1;
          return (
            <div key={s.id} className="street-ground absolute" style={{ left: u(stand(i) + 14) }}>
              <button
                type="button"
                onClick={() => walkTo(stand(i))}
                onFocus={() => walkTo(stand(i))}
                aria-label={known ? `Walk to ${s.place}` : `Walk to stop ${i + 1}`}
                className={`block transition-opacity duration-500 ${known ? "opacity-100" : "opacity-60"}`}
              >
                <span className="sticker block">
                  <Signboard point="none" tone={i === at ? "butter" : "cream"}>
                    <span className="block text-[0.62em] opacity-70">{known ? s.when : `Stop ${i + 1}`}</span>
                    {known ? s.sign : "?"}
                  </Signboard>
                </span>
              </button>
            </div>
          );
        })}
      </motion.div>

      {/* Ashita */}
      <div className="street-feet pointer-events-none absolute z-10 -translate-x-1/2" style={{ left: `${avatarFrac * 100}%`, height: u(34) }}>
        <Avatar pose={walking ? "walk" : at === -1 && here < stand(0) ? "wave" : "stand"} facing={facing} className="h-full w-auto" priority />
      </div>

      {/* header */}
      <header className="absolute left-3 right-3 top-3 z-30 flex items-start justify-between gap-3 sm:left-6 sm:right-6 sm:top-5">
        <div>
          <h1 className="inline-block rounded-full bg-[#1c1b1d]/80 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f6eedc] backdrop-blur">About me</h1>
          <ol className="mt-2 flex w-max rounded-full bg-[#1c1b1d]/70 px-1 backdrop-blur" aria-label="Stops on the road">
            {journey.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => walkTo(stand(i))}
                  aria-label={`Stop ${i + 1}${i <= reached ? `: ${s.place}` : ""}`}
                  aria-current={i === at ? "step" : undefined}
                  className="grid h-11 w-11 place-items-center"
                >
                  <span className={`block h-3 w-3 rounded-full border-2 border-[#f6eedc] ${i === at ? "bg-[#f2b51d]" : i <= reached ? "bg-[#f6eedc]" : "bg-transparent"}`} />
                </button>
              </li>
            ))}
          </ol>
        </div>
        <button type="button" onClick={() => setOverview(true)} className="min-h-11 rounded-full bg-[#1c1b1d]/80 px-4 text-sm font-bold text-[#f6eedc] backdrop-blur">
          All stops
        </button>
      </header>

      {/* the story at this stop */}
      <AnimatePresence>
        {showCard && (
          <motion.section
            key={stop?.id ?? "intro"}
            data-card
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-3 bottom-[104px] z-20 max-h-[34dvh] overflow-y-auto rounded-2xl bg-[#f6eedc] p-4 shadow-[0_20px_50px_rgb(0_0_0/0.35)] sm:inset-x-auto sm:right-6 sm:top-24 sm:bottom-auto sm:max-h-[60dvh] sm:w-[380px] sm:p-5"
          >
            {stop ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-wood-dark">{stop.when}</p>
                <h2 ref={cardRef} tabIndex={-1} className="mt-1 font-display text-2xl uppercase leading-none text-line outline-none sm:text-3xl">
                  {stop.place}
                </h2>
                <p className="mt-1 font-semibold text-line">{stop.role}</p>
                <ul className="mt-2 space-y-1.5 text-[15px] text-line">
                  {stop.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                      {p}
                    </li>
                  ))}
                </ul>
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="What it added">
                  {stop.skills.map((k) => (
                    <li key={k} className="rounded-full bg-line/10 px-2.5 py-1 text-xs font-semibold text-line">
                      {k}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {at < journey.length - 1 ? (
                    <button type="button" onClick={() => walkTo(stand(at + 1))} className="min-h-11 rounded-full bg-line px-4 text-sm font-bold text-[#f6eedc]">
                      Walk on →
                    </button>
                  ) : (
                    <HandNote>that&apos;s me, today</HandNote>
                  )}
                  <button type="button" onClick={keepMemory} disabled={saving} className="min-h-11 rounded-full border-2 border-line px-4 text-sm font-bold text-line disabled:opacity-60">
                    {saving ? "Printing…" : "Keep this memory ↓"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl uppercase leading-none text-line sm:text-3xl">Walk with me</h2>
                <p className="mt-2 text-line">From Delhi to Jodhpur: commerce, audit, psychology, marketing, product, then design.</p>
                <button type="button" onClick={() => walkTo(stand(next >= 0 ? next : 0))} className="mt-3 min-h-11 rounded-full bg-line px-4 text-sm font-bold text-[#f6eedc]">
                  Start walking →
                </button>
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
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={(e) => e.key === "Escape" && setOverview(false)}
          >
            <div className="mx-auto max-w-3xl rounded-2xl bg-[#f6eedc] p-5 text-line shadow-[0_20px_60px_rgb(0_0_0/0.4)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 id="overview-h" className="font-display text-3xl uppercase sm:text-4xl">The whole road</h2>
                <button type="button" autoFocus onClick={() => setOverview(false)} className="min-h-11 rounded-full bg-line px-4 text-sm font-bold text-[#f6eedc]">
                  Close
                </button>
              </div>
              <ol className="mt-6 space-y-6">
                {journey.map((s) => (
                  <li key={s.id} className="grid gap-4 sm:grid-cols-[180px_1fr]">
                    <Image src={s.scene} alt="" width={360} height={135} className="aspect-[8/3] w-full rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-wood-dark">{s.when}</p>
                      <h3 className="font-display text-2xl uppercase">{s.place}</h3>
                      <p className="font-semibold">{s.role}</p>
                    </div>
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
