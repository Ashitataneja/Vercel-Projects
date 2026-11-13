"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import Avatar, { type Pose } from "./Avatar";
import HandNote from "./HandNote";
import Signboard from "./Signboard";
import ModeStrip from "../ModeStrip";
import Road from "./Road";

/*
 * Ashita's street: the home page and the hub of the world.
 * Everything is laid out in "u" units (CSS var --u = min(1dvh, 1.8vw)) so the
 * street keeps its proportions on any screen. The camera moves sideways;
 * the avatar stays put on screen and walks while the world slides by.
 */

type DestId = "work" | "about" | "blog" | "contact";
type Dest = {
  id: DestId;
  href: string;
  /** left edge and size of the drawing, in u */
  left: number;
  height: number;
  width: number;
  /** where the avatar stops, in u (world x) */
  stand: number;
  label: string;
  note: string;
  pose: Pose;
  fade: string; // colour we pass through on the way in
};

const DESTS: Dest[] = [
  { id: "work", href: "/work", left: 118, height: 46, width: 46 * (657 / 900), stand: 108, label: "Stall with my keepsake box: my work", note: "my ticket collection (my work!)", pose: "stand", fade: "bg-[#2a1d14]" },
  { id: "about", href: "/about", left: 262, height: 54, width: 54 * (401 / 900), stand: 254, label: "Signpost: how I got here (About me)", note: "the long way round", pose: "stand", fade: "bg-[#1c1b1d]" },
  { id: "blog", href: "/blog", left: 520, height: 30, width: 30 * (900 / 555), stand: 512, label: "Bench with my journal: the blog", note: "someone left their diary…", pose: "read", fade: "bg-[#2a1d14]" },
  { id: "contact", href: "/contact", left: 672, height: 56, width: 56 * (349 / 900), stand: 664, label: "Telephone booth: contact me", note: "ring me up?", pose: "phone", fade: "bg-[#2a1d14]" },
];

/** Painted objects standing on the street (public/world/objects), with their pixel sizes. */
const ART: Record<DestId, { src: string; w: number; h: number }> = {
  work: { src: "/world/objects/stall.webp", w: 657, h: 900 },
  about: { src: "/world/objects/signpost.webp", w: 401, h: 900 },
  blog: { src: "/world/objects/bench.webp", w: 900, h: 555 },
  contact: { src: "/world/objects/booth.webp", w: 349, h: 900 },
};

/** Ashita's painted Delhi, laid end to end behind the pavement. Widths in u (panel height is 76u). */
const SCENES = [
  { src: "/world/street.webp", w: 203, alt: "" },
  { src: "/world/cp.webp", w: 135, alt: "" },
  { src: "/world/chandnichowk.webp", w: 135, alt: "" },
  { src: "/world/lodhi.webp", w: 135, alt: "" },
  { src: "/world/indiagate.webp", w: 135, alt: "" },
];
const TRACK = SCENES.reduce((a, s) => a + s.w, 0); // u
const AVATAR_H = 34; // u
const START = 22; // u

const u = (n: number) => `calc(var(--u) * ${n})`;

export default function Street() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const unit = useRef(8); // px per u, read from CSS
  const avatarX = useRef(0.26); // avatar's screen position as a fraction of the width
  const probeRef = useRef<HTMLDivElement>(null);
  const [avatarFrac, setAvatarFrac] = useState(0.26);
  const cam = useMotionValue(0); // world px at the left edge of the screen
  const worldX = useTransform(cam, (c) => -c);
  const [here, setHere] = useState<number>(START); // avatar world position, u
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [active, setActive] = useState<DestId | null>(null);
  const [zoom, setZoom] = useState<{ origin: string; fade: string } | null>(null);
  const [greeted, setGreeted] = useState(false);
  const stopTimer = useRef<number | undefined>(undefined);
  const dragging = useRef<{ x: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const busy = useRef(false);
  const ready = useRef(false); // ignore the camera moves we make while measuring

  /* ---------- measuring ---------- */
  const bounds = useCallback(() => {
    const w = mainRef.current?.clientWidth ?? 1000;
    const ax = w * avatarX.current;
    return { min: 0, max: TRACK * unit.current - (mainRef.current?.clientWidth ?? 1000), ax };
  }, []);

  const clampCam = useCallback(
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
      avatarX.current = el.clientWidth < 640 ? 0.22 : 0.26;
      setAvatarFrac(avatarX.current);
      const { ax } = bounds();
      ready.current = false;
      cam.set(clampCam(START * unit.current - ax));
      ready.current = true;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [bounds, cam, clampCam]);

  // Track where the avatar is, which way it faces, and whether it's mid-stride.
  useMotionValueEvent(cam, "change", (v) => {
    const prev = cam.getPrevious() ?? v;
    if (ready.current && Math.abs(v - prev) > 0.5) {
      setFacing(v > prev ? "right" : "left");
      setWalking(true);
      setGreeted(true);
      window.clearTimeout(stopTimer.current);
      stopTimer.current = window.setTimeout(() => setWalking(false), 160);
    }
    const { ax } = bounds();
    setHere((v + ax) / unit.current);
  });

  const walkTo = useCallback(
    (worldU: number, then?: () => void) => {
      const { ax } = bounds();
      const target = clampCam(worldU * unit.current - ax);
      const dist = Math.abs(target - cam.get());
      if (reduce || dist < 2) {
        cam.set(target);
        then?.();
        return;
      }
      animate(cam, target, { duration: Math.min(1.8, 0.35 + dist / 900), ease: [0.45, 0, 0.55, 1], onComplete: then });
    },
    [bounds, cam, clampCam, reduce],
  );

  /* ---------- input: wheel, drag, keys ---------- */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      if (busy.current) return;
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      cam.stop();
      cam.set(clampCam(cam.get() + d));
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [cam, clampCam]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (busy.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const step = 30 * unit.current;
      if (e.key === "ArrowRight") animate(cam, clampCam(cam.get() + step), { duration: 0.45 });
      else if (e.key === "ArrowLeft") animate(cam, clampCam(cam.get() - step), { duration: 0.45 });
      else if (e.key === "Home") walkTo(START);
      else if (e.key === "End") walkTo(TRACK);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cam, clampCam, walkTo]);

  function onPointerDown(e: React.PointerEvent) {
    if (busy.current || e.pointerType === "mouse" && e.button !== 0) return;
    dragging.current = { x: e.clientX, moved: false };
    cam.stop();
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragging.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    d.moved = true;
    d.x = e.clientX;
    cam.set(clampCam(cam.get() - dx * 1.4));
  }
  function onPointerUp() {
    if (dragging.current?.moved) {
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 0);
    }
    dragging.current = null;
  }

  /* ---------- going into a destination ---------- */
  function enter(e: React.MouseEvent, d: Dest) {
    if (suppressClick.current) {
      e.preventDefault();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || reduce) return;
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    router.prefetch(d.href);
    walkTo(d.stand, () => {
      setActive(d.id);
      window.setTimeout(() => {
        const obj = sceneRef.current?.querySelector<HTMLElement>(`[data-dest="${d.id}"]`)?.getBoundingClientRect();
        const box = sceneRef.current?.getBoundingClientRect();
        const origin = obj && box ? `${obj.left + obj.width / 2 - box.left}px ${obj.top + obj.height * 0.45 - box.top}px` : "50% 50%";
        setZoom({ origin, fade: d.fade });
      }, 520);
    });
  }

  const near = (d: Dest) => Math.abs(here - d.stand) < 16;
  const nearest = DESTS.find((d) => near(d));
  const pose: Pose = walking ? "walk" : !greeted ? "wave" : nearest ? nearest.pose : "stand";

  return (
    <main
      ref={mainRef}
      className="relative h-dvh touch-pan-y select-none overflow-clip bg-[#1c1b1d] [--u:min(1dvh,1.8vw)]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={probeRef} aria-hidden="true" className="invisible absolute h-0" style={{ width: u(100) }} />
      <h1 className="sr-only">Ashita, interaction and product designer: a walk through my world</h1>

      <motion.div
        ref={sceneRef}
        className="absolute inset-0"
        style={{ transformOrigin: zoom?.origin }}
        animate={zoom ? { scale: 7 } : { scale: 1 }}
        transition={{ duration: 0.85, ease: [0.7, 0, 0.3, 1] }}
        onAnimationComplete={() => {
          if (zoom && active) router.push(DESTS.find((d) => d.id === active)!.href);
        }}
      >
        {/* the world */}
        <motion.div className="absolute inset-y-0 left-0" style={{ x: worldX, width: u(TRACK + 200) }}>
          {/* painted Delhi, end to end */}
          {SCENES.map((sc, i) => {
            const left = SCENES.slice(0, i).reduce((a, x) => a + x.w, 0);
            return (
              <div key={sc.src} aria-hidden="true" className="street-ground absolute overflow-hidden" style={{ left: u(left), width: u(sc.w + 0.5), height: u(76) }}>
                <Image src={sc.src} alt={sc.alt} fill priority={i === 0} sizes="(max-width: 640px) 160vw, 140vw" className="object-cover object-bottom" draggable={false} />
              </div>
            );
          })}
          {/* pavement + road */}
          <Road />

          {/* destinations */}
          {DESTS.map((d) => {
            const Art = <Image src={ART[d.id].src} alt="" width={ART[d.id].w} height={ART[d.id].h} sizes="40vw" className="h-full w-auto" draggable={false} />;
            const showNote = near(d);
            return (
              <div key={d.id} data-dest={d.id} className="street-ground group absolute" style={{ left: u(d.left), height: u(d.height), width: u(d.width) }}>
                <div className="h-full drop-shadow-[0_14px_10px_rgb(30_15_5/0.4)] transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1">{Art}</div>
                {/* handwritten note: appears when you walk up, hover or focus */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-full left-0 mb-2 w-max max-w-[70vw] rotate-[-3deg] transition-all duration-300 group-focus-within:opacity-100 group-hover:opacity-100 ${showNote ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                >
                  <HandNote arrow="down" className="rounded-md bg-paper/90 px-2">{d.note}</HandNote>
                </span>
                {/* the hit area: a real link */}
                {d.id === "about" ? (
                  <Link
                    href={d.href}
                    onClick={(e) => enter(e, d)}
                    onFocus={() => walkTo(d.stand)}
                    aria-label={d.label}
                    draggable={false}
                    className="absolute inset-0 [container-type:inline-size]"
                  >
                    {/* lettered onto the painted boards */}
                    <span aria-hidden="true" className="absolute left-[18%] top-[5%] w-[70%] -rotate-1 text-center font-hand text-[17cqw] font-semibold leading-none text-line">
                      about me →
                    </span>
                    <span aria-hidden="true" className="absolute left-[8%] top-[25%] w-[70%] rotate-1 text-center font-hand text-[15cqw] font-semibold leading-none text-line">
                      ← start
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={d.href}
                    onClick={(e) => enter(e, d)}
                    onFocus={() => walkTo(d.stand)}
                    aria-label={d.label}
                    draggable={false}
                    className="absolute inset-0 rounded-xl"
                  />
                )}
              </div>
            );
          })}

          {/* the end of the road */}
          <div className="street-ground absolute" style={{ left: u(TRACK - 26) }}>
            <button
              type="button"
              onClick={() => walkTo(START)}
              onFocus={() => walkTo(TRACK - 26)}
              className="rotate-[2deg]"
              aria-label="Walk back to the start of the street"
            >
              <span className="sticker block"><Signboard point="left" tone="cream">Back to the start</Signboard></span>
            </button>
          </div>
        </motion.div>

        {/* Ashita, walking */}
        <div className="street-feet pointer-events-none absolute z-10 -translate-x-1/2" style={{ left: `${avatarFrac * 100}%`, height: u(AVATAR_H) }}>
          <Avatar pose={pose} facing={facing} className="h-full w-auto" priority />
          {!greeted && (
            <span className="absolute bottom-[86%] left-[78%] w-max max-w-[60vw] rotate-[-4deg] rounded-2xl border-[3px] border-ink bg-paper px-3 py-2 shadow-[3px_3px_0_var(--color-ink)]">
              <HandNote>
                Hi, I&apos;m Ashita! I design products
                <br />
                and interactions. Walk through Delhi with me →
              </HandNote>
            </span>
          )}
        </div>
      </motion.div>

      {/* fade into the next place */}
      {zoom && (
        <motion.div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-40 ${zoom.fade}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.35 }} />
      )}

      {/* chrome */}
      <Link
        href="/work"
        className="absolute right-3 top-3 z-30 flex min-h-11 items-center rounded-full border-[3px] border-ink bg-butter px-4 text-sm font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] sm:right-6 sm:top-5"
      >
        Skip to my work →
      </Link>
      <p aria-hidden="true" className="absolute left-4 top-4 z-30 hidden rounded-md bg-paper/85 px-2 font-hand text-xl text-ink sm:block">
        scroll, drag or use ← → to walk
      </p>
      <ModeStrip current="/" />
    </main>
  );
}
