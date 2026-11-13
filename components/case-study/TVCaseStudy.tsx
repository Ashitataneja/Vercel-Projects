"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/site";

/*
 * A case study, played on the painted yellow TV.
 * The screen overlay sits exactly on the painting's screen (measured from
 * public/world/objects/tv.webp). Sections are channels: a progress bar shows
 * where you are and jumps anywhere; Previous / Next and the TV's two knobs
 * step through; arrow keys work too.
 */
const SCREEN = { left: 5.73, top: 5.23, width: 68.82, height: 68.37 }; // % of the TV image
const KNOBS = { prev: { left: 85.5, top: 22 }, next: { left: 85.5, top: 47 } }; // % of the TV image

export default function TVCaseStudy({ project, next }: { project: Project; next: Project }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [tuning, setTuning] = useState(false);
  // where the TV is heading, so quick presses during the static still count
  const target = useRef(0);
  const total = project.sections.length;
  const s = project.sections[i];

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to >= total || to === target.current) return;
      target.current = to;
      if (reduce) return setI(to);
      setTuning(true);
      window.setTimeout(() => {
        setI(target.current);
        setTuning(false);
      }, 180);
    },
    [total, reduce],
  );
  const step = useCallback((d: number) => go(target.current + d), [go]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const last = i === total - 1;

  return (
    <div className="flex w-full flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-10">
      {/* progress: which part of the story, and a way to jump to any of it */}
      <nav aria-label="Case study sections" className="w-full max-w-[min(92vw,640px)] lg:w-56 lg:max-w-none">
        <ol className="flex gap-1.5 lg:flex-col lg:gap-0">
          {project.sections.map((sec, k) => (
            <li key={sec.title} className="flex-1 lg:flex-none">
              <button
                type="button"
                onClick={() => go(k)}
                aria-current={k === i ? "step" : undefined}
                className="group flex min-h-11 w-full flex-col justify-center gap-1.5 text-left lg:flex-row lg:items-center lg:justify-start lg:gap-3"
              >
                <span className="block h-1.5 w-full overflow-hidden rounded-full bg-white/20 lg:hidden">
                  <span className={`block h-full rounded-full bg-[#f2b51d] transition-all duration-300 ${k <= i ? "w-full" : "w-0"}`} />
                </span>
                <span className="relative hidden h-full lg:flex lg:flex-col lg:items-center">
                  <span className={`block h-3.5 w-3.5 rounded-full border-2 ${k === i ? "border-[#f2b51d] bg-[#f2b51d]" : k < i ? "border-[#f6eedc] bg-[#f6eedc]" : "border-[#f6eedc]/50"}`} />
                </span>
                <span className={`hidden text-sm font-semibold lg:block ${k === i ? "text-[#f2b51d]" : "text-[#f6eedc]/80 group-hover:text-[#f6eedc]"}`}>{sec.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f6eedc]/70 lg:hidden" aria-live="polite">
          {i + 1} / {total} · {s.title}
        </p>
      </nav>

      {/* the television */}
      <div className="relative w-[min(92vw,820px,calc((100dvh-260px)*1.31))] [container-type:inline-size]">
        <Image src="/world/objects/tv.webp" alt="" width={1100} height={841} priority className="h-auto w-full drop-shadow-[0_30px_30px_rgb(0_0_0/0.45)]" />

        <div
          className="absolute overflow-hidden rounded-[6%/8%] bg-[#151515]"
          style={{ left: `${SCREEN.left}%`, top: `${SCREEN.top}%`, width: `${SCREEN.width}%`, height: `${SCREEN.height}%` }}
        >
          {/* switching on */}
          <motion.div
            className="absolute inset-0 flex flex-col p-[6%] text-[#f6eedc]"
            initial={reduce ? false : { scaleY: 0.01, opacity: 0.6 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.3, 1.2, 0.4, 1] }}
          >
            <p className="flex items-center gap-2 text-[2.2cqw] font-bold uppercase tracking-[0.2em] text-[#f2b51d]">
              <span className="inline-block h-[1.2cqw] w-[1.2cqw] rounded-full bg-[#d9482b]" />
              CH {project.number} · {project.title}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                className="mt-auto"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-display text-[6.4cqw] uppercase leading-none">{s.title}</h2>
                <p className="mt-[2.5cqw] max-w-[52cqw] text-[3cqw] leading-snug">{s.body}</p>
                {last && (
                  <div className="mt-[3cqw] flex flex-wrap gap-[1.5cqw]">
                    <Link href="/contact" className="inline-flex min-h-11 items-center rounded-full bg-[#f2b51d] px-[2.6cqw] text-[2.4cqw] font-bold text-[#1c1b1d]">
                      Ring me up →
                    </Link>
                    <Link href={`/work/${next.slug}`} className="inline-flex min-h-11 items-center rounded-full border-2 border-[#f6eedc]/70 px-[2.6cqw] text-[2.4cqw] font-bold">
                      Next ticket: {next.title}
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {/* CRT glass */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgb(255_255_255/0.04)_0_1px,transparent_1px_3px)]" />
          <span aria-hidden="true" className="pointer-events-none absolute -left-[10%] -top-[30%] h-[70%] w-[60%] rotate-[-18deg] rounded-full bg-white/10" />
          {tuning && <span aria-hidden="true" className="tv-static pointer-events-none absolute inset-0" />}
        </div>

        {/* the knobs work: top steps back, bottom steps forward */}
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={i === 0}
          aria-label="Previous section (top knob)"
          className="absolute min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 rounded-full disabled:cursor-not-allowed"
          style={{ left: `${KNOBS.prev.left}%`, top: `${KNOBS.prev.top}%`, width: "11%", aspectRatio: "1" }}
        />
        <button
          type="button"
          onClick={() => step(1)}
          disabled={last}
          aria-label="Next section (bottom knob)"
          className="absolute min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 rounded-full disabled:cursor-not-allowed"
          style={{ left: `${KNOBS.next.left}%`, top: `${KNOBS.next.top}%`, width: "11%", aspectRatio: "1" }}
        />
      </div>

      <div className="flex gap-3 lg:hidden">
        <button type="button" onClick={() => step(-1)} disabled={i === 0} className="min-h-11 rounded-full bg-[#f6eedc] px-5 text-sm font-bold text-[#1c1b1d] disabled:opacity-40">
          ← Previous
        </button>
        <button type="button" onClick={() => step(1)} disabled={last} className="min-h-11 rounded-full bg-[#f2b51d] px-5 text-sm font-bold text-[#1c1b1d] disabled:opacity-40">
          Next →
        </button>
      </div>
      <div className="hidden w-56 flex-col gap-3 lg:flex">
        <button type="button" onClick={() => step(1)} disabled={last} className="min-h-11 rounded-full bg-[#f2b51d] px-5 text-sm font-bold text-[#1c1b1d] disabled:opacity-40">
          Next →
        </button>
        <button type="button" onClick={() => step(-1)} disabled={i === 0} className="min-h-11 rounded-full bg-[#f6eedc] px-5 text-sm font-bold text-[#1c1b1d] disabled:opacity-40">
          ← Previous
        </button>
      </div>
    </div>
  );
}
