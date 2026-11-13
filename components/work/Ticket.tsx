"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import type { Project } from "@/lib/site";

const toneBg: Record<Project["tone"], string> = {
  butter: "bg-butter",
  cream: "bg-cream",
  sky: "bg-sky",
  paper: "bg-paper",
};

/** Zig-zag rip along the perforation, as clip-path polygons. */
const TEETH = 14;
function ripEdge(side: "right" | "left") {
  const pts: string[] = [];
  for (let i = 0; i <= TEETH; i++) {
    const y = (i / TEETH) * 100;
    const inset = i % 2 ? 7 : 0; // px
    pts.push(side === "right" ? `calc(100% - ${inset}px) ${y}%` : `${inset}px ${y}%`);
  }
  return side === "right"
    ? `polygon(0 0, ${pts.join(", ")}, 0 100%)`
    : `polygon(${pts.join(", ")}, 100% 100%, 100% 0)`;
}
const BODY_RIP = ripEdge("right");
const STUB_RIP = ripEdge("left");

/** Printed details that make each ticket a different kind of ticket. */
const STYLE: Record<Project["style"], { top: string; bottom: string; note: string }> = {
  cinema: { top: "Admit one · Screen 2", bottom: "Row F · Seat 12", note: "first-day first-show" },
  train: { top: "Boarding pass · Platform 3", bottom: "Coach B2 · Berth 34", note: "a long journey" },
  bus: { top: "Bus ticket · Route 7", bottom: "Fare paid · keep till end", note: "kept it for years" },
  museum: { top: "Museum entry · Gallery 5", bottom: "Valid for one visit", note: "visited twice" },
  concert: { top: "Live · Gate 4", bottom: "Standing · no re-entry", note: "loud & lovely" },
};

const TEAR_AT = 70; // px of pull before the paper gives

type Props = { project: Project; tilt: number; onTearStart: (rect: DOMRect, tone: Project["tone"]) => void };

export default function Ticket({ project, tilt, onTearStart }: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const dragged = useRef(false);
  const [torn, setTorn] = useState(false);
  const href = `/work/${project.slug}`;

  // Stub follows the finger; the body leans away a little, like real paper under strain.
  const pull = useMotionValue(0);
  const stubRotate = useTransform(pull, [0, TEAR_AT], [0, 9]);
  const bodyRotate = useTransform(pull, [0, TEAR_AT], [0, -2.5]);
  const strain = useTransform(pull, [0, TEAR_AT * 0.6, TEAR_AT], [0, 0.4, 1]);

  function tear() {
    if (torn) return;
    setTorn(true);
    const rect = ref.current?.getBoundingClientRect();
    if (rect) onTearStart(rect, project.tone);
    animate(pull, 260, { duration: 0.45, ease: [0.3, 0, 0.6, 1] });
    router.prefetch(href);
    window.setTimeout(() => router.push(href), 950);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    window.setTimeout(() => (dragged.current = false), 0);
    if (info.offset.x > TEAR_AT || info.velocity.x > 700) tear();
    else animate(pull, 0, { type: "spring", stiffness: 500, damping: 22 });
  }

  return (
    <motion.li
      className="relative list-none"
      style={{ rotate: tilt }}
      whileHover={reduce || torn ? undefined : { rotate: 0, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        ref={ref}
        href={href}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || reduce) return;
          e.preventDefault();
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          tear();
        }}
        aria-label={`${project.title}, ${project.client}. Tear the ticket to open the case study.`}
        className="group relative flex min-h-[156px] touch-pan-y select-none rounded-[6px] focus-visible:outline-offset-8 sm:min-h-[180px]"
      >
        {/* ---------- ticket body ---------- */}
        <motion.span
          aria-hidden="true"
          style={{ rotate: bodyRotate, clipPath: torn ? BODY_RIP : undefined, transformOrigin: "0% 100%" }}
          animate={torn ? { x: -40, y: 140, rotate: -14, opacity: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.5, 0, 0.75, 0] }}
          className={`relative flex flex-1 flex-col justify-between rounded-l-[14px] border-[4px] border-r-0 border-ink p-4 pr-6 shadow-[6px_6px_0_var(--color-ink)] sm:p-5 sm:pr-7 ${toneBg[project.tone]}`}
        >
          <span className="halftone pointer-events-none absolute inset-0 rounded-l-[10px] opacity-60" />
          {/* washi tape holding it in the collection */}
          <span className="absolute -left-3 -top-3 h-5 w-16 -rotate-[24deg] bg-rose-light/80" />
          {project.style === "train" && <span className="pointer-events-none absolute inset-x-0 top-[38%] h-3 bg-[repeating-linear-gradient(90deg,var(--color-red)_0_10px,transparent_10px_20px)] opacity-60" />}
          {project.style === "bus" && (
            <span className="pointer-events-none absolute inset-y-3 left-1.5 flex flex-col justify-between">
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-paper" />
              ))}
            </span>
          )}
          {project.style === "museum" && (
            <span className="pointer-events-none absolute right-6 top-[30%] grid h-16 w-16 rotate-[-14deg] place-items-center rounded-full border-[3px] border-double border-red text-center text-[9px] font-black uppercase leading-tight text-red opacity-80">
              Visited
            </span>
          )}
          {project.style === "concert" && <span className="pointer-events-none absolute -right-2 bottom-3 h-10 w-10 rounded-full bg-[radial-gradient(circle,var(--color-butter)_30%,transparent_31%)] [background-size:10px_10px] opacity-70" />}
          <span className="relative flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.2em]">
            <span>{STYLE[project.style].top}</span>
            <span className="hidden sm:inline">{project.kind}</span>
          </span>
          <span className="relative mt-3 block font-display text-[clamp(1.75rem,6vw,2.6rem)] uppercase leading-[0.95]">
            {project.title}
          </span>
          <span className="relative mt-3 flex items-end justify-between gap-3">
            <span>
              <span className="block text-sm font-semibold">{project.client}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">{STYLE[project.style].bottom}</span>
            </span>
            {/* barcode */}
            <svg viewBox="0 0 60 22" className="h-5 w-14 shrink-0" aria-hidden="true">
              {[0, 3, 5, 9, 12, 14, 18, 21, 25, 27, 31, 35, 37, 41, 44, 47, 51, 54, 57].map((x, i) => (
                <rect key={x} x={x} y="0" width={i % 3 ? 1.5 : 2.5} height="22" fill="#13233A" />
              ))}
            </svg>
          </span>
        </motion.span>

        {/* ---------- perforation ---------- */}
        <span aria-hidden="true" className={`relative w-0 ${torn ? "opacity-0" : ""}`}>
          <span className="absolute -left-[10px] -top-[2px] z-10 h-5 w-5 rounded-b-full border-[4px] border-t-0 border-ink bg-cream" />
          <span className="absolute -left-[10px] -bottom-[2px] z-10 h-5 w-5 rounded-t-full border-[4px] border-b-0 border-ink bg-cream" />
          <span className="absolute inset-y-5 -left-[2px] border-l-[4px] border-dashed border-ink" />
          {/* strain marks as you pull */}
          <motion.span style={{ opacity: strain }} className="absolute inset-y-6 -left-[9px] w-[18px] bg-[repeating-linear-gradient(180deg,transparent_0_6px,rgb(19_35_58/0.5)_6px_8px)]" />
        </span>

        {/* ---------- stub: pull it to tear ---------- */}
        <motion.span
          aria-hidden="true"
          drag={reduce || torn ? false : "x"}
          dragDirectionLock
          dragConstraints={{ left: 0, right: 220 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={onDragEnd}
          style={{ x: pull, rotate: stubRotate, clipPath: torn ? STUB_RIP : undefined, transformOrigin: "0% 0%" }}
          animate={torn ? { y: 220, rotate: 38, opacity: 0 } : undefined}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.5, 0, 0.75, 0] }}
          className={`relative flex w-[26%] min-w-[86px] cursor-grab flex-col items-center justify-between rounded-r-[14px] border-[4px] border-l-0 border-ink py-4 pl-3 pr-2 shadow-[6px_6px_0_var(--color-ink)] active:cursor-grabbing ${toneBg[project.tone]}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">No.</span>
          <span className="font-display text-4xl leading-none sm:text-5xl">{project.number}</span>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em]">
            Pull
            <svg viewBox="0 0 16 10" className="h-2.5 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
              <path d="M1 5 H13 M9 1 L14 5 L9 9" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </motion.span>
      </Link>
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-7 right-4 rotate-[-3deg] font-hand text-xl text-ink-soft opacity-0 transition-opacity duration-300 [li:hover_&]:opacity-100">
        {STYLE[project.style].note}
      </span>
    </motion.li>
  );
}
