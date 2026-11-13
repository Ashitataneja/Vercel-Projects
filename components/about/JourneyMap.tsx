"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { journey, type JourneyStop } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Two hand-drawn layouts of the same journey: wide for tablet/desktop, */
/* tall for phones. Same stops, same behaviour.                         */
/* ------------------------------------------------------------------ */
type Pt = [number, number];
type Layout = { w: number; h: number; start: Pt; stops: Pt[]; labels: { text: string; at: Pt }[] };

const WIDE: Layout = {
  w: 1600,
  h: 900,
  start: [110, 800],
  stops: [
    [250, 640],
    [500, 520],
    [330, 300],
    [690, 210],
    [930, 430],
    [1160, 230],
    [1440, 560],
  ],
  labels: [
    { text: "DELHI", at: [470, 760] },
    { text: "JODHPUR", at: [1400, 800] },
  ],
};

const TALL: Layout = {
  w: 400,
  h: 1180,
  start: [70, 70],
  stops: [
    [130, 190],
    [300, 330],
    [110, 480],
    [290, 630],
    [110, 780],
    [290, 930],
    [190, 1080],
  ],
  labels: [
    { text: "DELHI", at: [300, 120] },
    { text: "JODHPUR", at: [320, 1150] },
  ],
};

/** Smooth curve through points (Catmull-Rom → cubic Bézier). */
function smoothPath(pts: Pt[]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = 0.18;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Small drawn landmarks for each stop                                 */
/* ------------------------------------------------------------------ */
function Glyph({ icon }: { icon: JourneyStop["icon"] }) {
  const s = { stroke: "currentColor", strokeWidth: 2.4, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "college":
      return <path {...s} d="M4 10 L12 5 L20 10 M6 10 V18 M10 10 V18 M14 10 V18 M18 10 V18 M4 19 H20" />;
    case "office":
      return <path {...s} d="M6 20 V5 H18 V20 M9 8 H11 M13 8 H15 M9 12 H11 M13 12 H15 M10 20 V16 H14 V20" />;
    case "book":
      return <path {...s} d="M4 6 Q8 4 12 7 Q16 4 20 6 V18 Q16 16 12 19 Q8 16 4 18 Z M12 7 V19" />;
    case "megaphone":
      return <path {...s} d="M4 10 V14 H7 L16 19 V5 L7 10 Z M18.5 9.5 Q20 12 18.5 14.5" />;
    case "pencil":
      return <path {...s} d="M5 19 L6 15 L16 5 L19 8 L9 18 Z M14 7 L17 10" />;
    case "rocket":
      return <path {...s} d="M12 3 Q17 7 16 15 H8 Q7 7 12 3 Z M8 13 L5 17 H8 M16 13 L19 17 H16 M10 18 Q12 21 14 18" />;
    case "flag":
      return <path {...s} d="M6 21 V4 M6 5 H17 L14.5 8.5 L17 12 H6" />;
  }
}

/* ------------------------------------------------------------------ */

type MapProps = {
  layout: Layout;
  reached: number; // furthest stop discovered (-1 = at the start)
  at: number; // stop the walker is heading to / standing at
  onPick: (i: number) => void;
  className?: string;
  label: string;
};

function MapView({ layout, reached, at, onPick, className, label }: MapProps) {
  const reduce = useReducedMotion();
  const pts = useMemo(() => [layout.start, ...layout.stops], [layout]);
  const d = useMemo(() => smoothPath(pts), [pts]);
  const routeRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const walkerRef = useRef<SVGGElement>(null);
  const [lengths, setLengths] = useState<number[] | null>(null);
  const progress = useRef(0);
  const [walking, setWalking] = useState(false);
  // the walker is drawn at phone scale; enlarge it on the wide map so it reads at desktop size
  const k = layout.w > layout.h ? 1.9 : 1;
  const wrapRef = useRef<HTMLDivElement>(null);

  // On a phone the map is taller than the screen: bring the next stop into view, above the story sheet.
  useEffect(() => {
    if (at < 0) return;
    const btn = wrapRef.current?.querySelectorAll("li")[at];
    const wrap = wrapRef.current;
    if (!btn || !wrap || !(btn as HTMLElement).offsetParent || wrap.offsetHeight < window.innerHeight * 0.8) return;
    const r = btn.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.12 && r.bottom < window.innerHeight * 0.42) return;
    window.scrollBy({ top: r.top - window.innerHeight * 0.22, behavior: reduce ? "auto" : "smooth" });
  }, [at, reduce]);

  // Measure how far along the route each stop sits.
  useLayoutEffect(() => {
    const ns = "http://www.w3.org/2000/svg";
    const tmp = document.createElementNS(ns, "path");
    const ls = pts.map((_, i) => {
      if (i === 0) return 0;
      tmp.setAttribute("d", smoothPath(pts.slice(0, i + 1)));
      return tmp.getTotalLength();
    });
    setLengths(ls);
  }, [pts]);

  const place = useCallback(
    (len: number, revealTo: number) => {
      const path = routeRef.current;
      if (!path) return;
      const p = path.getPointAtLength(len);
      // stand just beside the pin, not underneath it
      walkerRef.current?.setAttribute("transform", `translate(${p.x - 42 * k} ${p.y + 26 * k}) scale(${k})`);
      const total = path.getTotalLength();
      if (drawnRef.current) {
        drawnRef.current.style.strokeDasharray = `${total}`;
        drawnRef.current.style.strokeDashoffset = `${total - revealTo}`;
      }
    },
    [k],
  );

  // Walk the avatar along the route whenever the target stop changes.
  useEffect(() => {
    if (!lengths) return;
    const target = lengths[at + 1];
    const revealed = () => Math.max(lengths[reached + 1], progress.current);
    if (reduce || progress.current === target) {
      progress.current = target;
      place(target, lengths[reached + 1]);
      return;
    }
    setWalking(true);
    const controls = animate(progress.current, target, {
      duration: Math.min(2.4, 0.5 + Math.abs(target - progress.current) / 420),
      ease: [0.45, 0, 0.55, 1],
      onUpdate: (v) => {
        progress.current = v;
        place(v, revealed());
      },
      onComplete: () => setWalking(false),
    });
    return () => controls.stop();
  }, [at, reached, lengths, place, reduce]);

  return (
    <div className={className} ref={wrapRef}>
      <div className="relative mx-auto w-full" style={{ aspectRatio: `${layout.w} / ${layout.h}` }}>
        <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className="absolute inset-0 h-full w-full" role="img" aria-label={label}>
          <MapDecor layout={layout} />
          {/* the whole route, faint and undiscovered */}
          <path ref={routeRef} d={d} fill="none" stroke="#13233A" strokeOpacity=".22" strokeWidth="5" strokeDasharray="2 16" strokeLinecap="round" />
          {/* the part you've walked, inked in */}
          <path ref={drawnRef} d={d} fill="none" stroke="#13233A" strokeWidth="6" strokeLinecap="round" style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }} />
          {/* start flag */}
          <g transform={`translate(${layout.start[0]} ${layout.start[1]})`}>
            <circle r="12" fill="#FFF6E6" stroke="#13233A" strokeWidth="4" />
            <text y="40" textAnchor="middle" className="fill-ink text-[22px] font-bold uppercase tracking-widest">Start</text>
          </g>
          {/* walker */}
          <g ref={walkerRef} transform={`translate(${layout.start[0] - 42 * k} ${layout.start[1] + 26 * k}) scale(${k})`}>
            <motion.g animate={walking ? { y: [0, -7, 0] } : { y: 0 }} transition={walking ? { repeat: Infinity, duration: 0.36 } : undefined}>
              <ellipse cx="0" cy="4" rx="16" ry="5" fill="#13233A" opacity=".25" />
              <path d="M-13 -8 L0 -40 L13 -8 Z" fill="#D9482B" stroke="#13233A" strokeWidth="4" strokeLinejoin="round" />
              <circle cx="0" cy="-50" r="12" fill="#FFE3B3" stroke="#13233A" strokeWidth="4" />
              <path d="M-12 -52 Q-12 -66 0 -64 Q12 -66 12 -52 Q12 -44 14 -36 L8 -40 Q8 -54 0 -56 Q-8 -54 -8 -40 L-14 -36 Q-12 -44 -12 -52 Z" fill="#13233A" />
              <path d="M-5 -8 V2 M5 -8 V2" stroke="#13233A" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
          </g>
        </svg>

        {/* stops: real buttons laid over the drawing */}
        <ol className="absolute inset-0">
          {journey.map((s, i) => {
            const [x, y] = layout.stops[i];
            const visited = i <= reached;
            const next = i === reached + 1;
            const locked = !visited && !next;
            const current = i === at;
            return (
              <li key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(x / layout.w) * 100}%`, top: `${(y / layout.h) * 100}%` }}>
                <button
                  type="button"
                  onClick={() => !locked && onPick(i)}
                  aria-disabled={locked}
                  aria-current={current ? "step" : undefined}
                  aria-label={locked ? `Stop ${i + 1}: not discovered yet` : `Stop ${i + 1}: ${s.place}, ${s.when}`}
                  className={`relative grid h-12 w-12 place-items-center rounded-full border-[4px] border-ink transition-transform sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${
                    locked
                      ? "cursor-not-allowed bg-paper/80 text-ink/40"
                      : visited
                        ? `bg-red text-paper hover:scale-110 ${current ? "scale-110 shadow-[0_0_0_6px_var(--color-butter)]" : ""}`
                        : "bg-butter text-ink hover:scale-110"
                  }`}
                >
                  {next && !reduce && <span aria-hidden="true" className="absolute inset-[-10px] animate-ping rounded-full border-[3px] border-butter" />}
                  {locked ? (
                    <span aria-hidden="true" className="font-display text-xl">?</span>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden="true">
                      <Glyph icon={s.icon} />
                    </svg>
                  )}
                  <span aria-hidden="true" className="absolute -bottom-2 -right-2 grid h-6 w-6 place-items-center rounded-full border-[3px] border-ink bg-paper text-[11px] font-bold text-ink">
                    {i + 1}
                  </span>
                </button>
                {next && (
                  <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-md border-[3px] border-ink bg-paper px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                    {reached < 0 ? "Start here" : "Walk on"}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/** Hand-drawn map furniture: river, parks, roads, dunes, compass. */
function MapDecor({ layout }: { layout: Layout }) {
  const wide = layout.w > layout.h;
  return (
    <g aria-hidden="true">
      <rect width={layout.w} height={layout.h} fill="#FFF6E6" />
      <rect width={layout.w} height={layout.h} fill="url(#map-dots)" />
      <defs>
        <pattern id="map-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="#13233A" opacity=".14" />
        </pattern>
        <pattern id="map-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M80 0 H0 V80" fill="none" stroke="#13233A" strokeOpacity=".07" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width={layout.w} height={layout.h} fill="url(#map-grid)" />
      {wide ? (
        <>
          {/* river */}
          <path d="M0 140 Q200 200 300 420 T560 860 L640 900 L560 900 Q420 640 250 470 T-40 230 Z" fill="#30A0E0" stroke="#13233A" strokeWidth="5" opacity=".9" />
          {/* parks */}
          <path d="M760 520 q60 -60 140 -10 q70 40 20 110 q-70 60 -150 10 q-50 -50 -10 -110Z" fill="#4E9A4B" stroke="#13233A" strokeWidth="5" />
          <path d="M520 70 q50 -30 100 0 q40 40 -10 70 q-60 30 -100 -10 q-20 -40 10 -60Z" fill="#4E9A4B" stroke="#13233A" strokeWidth="5" />
          {/* dunes toward Jodhpur */}
          <path d="M1180 900 Q1270 760 1360 840 Q1450 730 1600 820 V900Z" fill="#FFC973" stroke="#13233A" strokeWidth="5" />
          <path d="M1300 120 l40 -60 l40 60 z M1360 140 l50 -80 l50 80 z" fill="#FFE3B3" stroke="#13233A" strokeWidth="5" strokeLinejoin="round" />
          {/* roads */}
          <path d="M0 600 Q600 500 1000 640 T1600 380" fill="none" stroke="#13233A" strokeOpacity=".25" strokeWidth="14" />
          <path d="M820 0 Q860 300 780 900" fill="none" stroke="#13233A" strokeOpacity=".2" strokeWidth="10" />
          {/* compass */}
          <g transform="translate(1500 110)">
            <circle r="48" fill="#FFF6E6" stroke="#13233A" strokeWidth="5" />
            <path d="M0 -40 L10 0 L0 40 L-10 0Z" fill="#D9482B" stroke="#13233A" strokeWidth="3" />
            <text y="-54" textAnchor="middle" className="fill-ink text-[22px] font-bold">N</text>
          </g>
        </>
      ) : (
        <>
          <path d="M400 230 Q240 300 260 420 T120 640 T0 760 V840 Q160 760 220 640 T400 330Z" fill="#30A0E0" stroke="#13233A" strokeWidth="5" opacity=".9" />
          <path d="M20 300 q40 -40 90 -10 q40 40 0 80 q-60 30 -100 -10 q-10 -40 10 -60Z" fill="#4E9A4B" stroke="#13233A" strokeWidth="5" />
          <path d="M0 1180 Q90 1080 200 1140 Q300 1060 400 1120 V1180Z" fill="#FFC973" stroke="#13233A" strokeWidth="5" />
          <path d="M200 0 Q160 600 230 1180" fill="none" stroke="#13233A" strokeOpacity=".18" strokeWidth="12" />
          <g transform="translate(340 60)">
            <circle r="32" fill="#FFF6E6" stroke="#13233A" strokeWidth="4" />
            <path d="M0 -26 L7 0 L0 26 L-7 0Z" fill="#D9482B" stroke="#13233A" strokeWidth="2.5" />
          </g>
        </>
      )}
      {layout.labels.map((l) => (
        <text key={l.text} x={l.at[0]} y={l.at[1]} textAnchor="middle" className="fill-ink/50 font-display" style={{ fontSize: wide ? 44 : 30, letterSpacing: "0.3em" }}>
          {l.text}
        </text>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The page-level component: shared state, two map layouts, one card.  */
/* ------------------------------------------------------------------ */
export default function JourneyMap() {
  const [reached, setReached] = useState(-1);
  const [at, setAt] = useState(-1);
  const [open, setOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  const pick = useCallback(
    (i: number) => {
      setAt(i);
      setReached((r) => Math.max(r, i));
      setOpen(true);
    },
    [],
  );

  // Move focus to the story once the walker arrives, so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!open || at < 0) return;
    const id = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), reduce ? 0 : 900);
    return () => window.clearTimeout(id);
  }, [at, open, reduce]);

  const stop = at >= 0 ? journey[at] : null;
  const last = journey.length - 1;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
      <div className="overflow-hidden rounded-2xl border-[5px] border-ink shadow-[8px_8px_0_var(--color-ink)]">
        <MapView layout={WIDE} reached={reached} at={at} onPick={pick} className="hidden md:block" label="Hand-drawn map of Ashita's journey from Delhi to Jodhpur" />
        <MapView layout={TALL} reached={reached} at={at} onPick={pick} className="md:hidden" label="Hand-drawn map of Ashita's journey from Delhi to Jodhpur" />
      </div>

      {/* story card: side panel on desktop, bottom sheet on phones and tablets */}
      <aside
        aria-live="polite"
        className={`fixed inset-x-3 bottom-[76px] z-30 max-h-[52dvh] overflow-y-auto rounded-2xl border-[4px] border-ink bg-cream p-5 shadow-[6px_6px_0_var(--color-ink)] transition-transform duration-300 lg:sticky lg:inset-auto lg:top-8 lg:z-auto lg:max-h-none lg:translate-y-0 ${
          open || !stop ? "translate-y-0" : "translate-y-[calc(100%+90px)] lg:translate-y-0"
        }`}
      >
        {stop ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-wood-dark">
                Stop {at + 1} of {journey.length} · {stop.when}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full font-bold lg:hidden"
                aria-label="Close this stop"
              >
                ✕
              </button>
            </div>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 font-display text-3xl uppercase leading-none outline-none">
              {stop.place}
            </h2>
            <p className="mt-2 font-semibold">{stop.role}</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {stop.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              {at < last ? (
                <button type="button" onClick={() => pick(at + 1)} className="min-h-11 rounded-full border-[3px] border-ink bg-butter px-5 font-bold shadow-[3px_3px_0_var(--color-ink)]">
                  Walk to stop {at + 2} →
                </button>
              ) : (
                <p className="font-semibold">That&apos;s where I am now. Thanks for walking with me.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl uppercase leading-none">Where I&apos;ve been</h2>
            <p className="mt-3">
              Commerce, then audit, then psychology, marketing, product and design. Seven stops so far. Tap the first pin to start walking.
            </p>
            <button type="button" onClick={() => pick(0)} className="mt-5 min-h-11 rounded-full border-[3px] border-ink bg-butter px-5 font-bold shadow-[3px_3px_0_var(--color-ink)]">
              Start walking →
            </button>
          </>
        )}
      </aside>

      {/* for anyone in a hurry */}
      <div className="mt-6 lg:col-start-1">
        <button
          type="button"
          onClick={() => {
            setReached(last);
            setAt(last);
            setOpen(true);
          }}
          className="min-h-11 font-semibold underline decoration-wood decoration-2 underline-offset-4"
        >
          In a hurry? Reveal the whole journey
        </button>
      </div>
    </div>
  );
}
