"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { journalEntries } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */
type Page = { id: string; render: () => React.ReactNode };

function Ruled({ children, side }: { children: React.ReactNode; side: "left" | "right" }) {
  return (
    <div
      className={`relative h-full overflow-y-auto bg-paper px-6 py-8 sm:px-10 sm:py-12 ${side === "left" ? "md:shadow-[inset_-28px_0_30px_-24px_rgb(19_35_58/0.35)]" : "md:shadow-[inset_28px_0_30px_-24px_rgb(19_35_58/0.35)]"}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0 46px, rgb(217 72 43 / 0.45) 46px 48px, transparent 48px), repeating-linear-gradient(180deg, transparent 0 33px, rgb(0 107 185 / 0.18) 33px 35px)",
      }}
    >
      <div className="relative mx-auto max-w-[34rem] pl-6 sm:pl-8">{children}</div>
    </div>
  );
}

function TapedPhoto({ caption }: { caption: string }) {
  return (
    <figure className="relative mx-auto mt-6 w-[86%] rotate-[-2deg] border-[3px] border-ink bg-paper p-3 pb-2 shadow-[4px_4px_0_rgb(19_35_58/0.3)]">
      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[3deg] bg-butter/80" />
      <div className="grid aspect-[4/3] place-items-center bg-ink/10 text-sm font-semibold text-ink-soft">[PLACEHOLDER: photo]</div>
      <figcaption className="mt-2 text-center text-sm">{caption}</figcaption>
    </figure>
  );
}

const PAGES: Page[] = [
  {
    id: "inside-cover",
    render: () => (
      <div className="flex h-full flex-col items-center justify-center bg-cream p-8 text-center">
        <div className="halftone absolute inset-0 opacity-40" />
        <p className="relative text-xs font-bold uppercase tracking-[0.24em] text-wood-dark">This journal belongs to</p>
        <p className="relative mt-2 font-display text-5xl uppercase">Ashita</p>
        <p className="relative mt-6 max-w-xs text-ink-soft">Notes and photographs from walks, work and the things in between.</p>
      </div>
    ),
  },
  {
    id: "contents",
    render: () => (
      <Ruled side="right">
        <h2 className="font-display text-4xl uppercase">Contents</h2>
        <ol className="mt-6 space-y-[11px] text-lg leading-[24px]">
          {journalEntries.map((e, i) => (
            <li key={e.id} className="flex justify-between gap-4">
              <span>{e.title}</span>
              <span className="text-ink-soft">{i + 2}</span>
            </li>
          ))}
        </ol>
      </Ruled>
    ),
  },
  ...journalEntries.map((e, i) => ({
    id: e.id,
    render: () => (
      <Ruled side={i % 2 ? "right" : "left"}>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-wood-dark">{e.date}</p>
        <h2 className="mt-1 font-display text-3xl uppercase leading-tight sm:text-4xl">{e.title}</h2>
        <p className="mt-4 text-lg leading-[35px]">{e.body}</p>
        <TapedPhoto caption={e.photo} />
      </Ruled>
    ),
  })),
  {
    id: "end",
    render: () => (
      <Ruled side="left">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="font-display text-4xl uppercase">More pages soon.</p>
          <p className="mt-3 text-ink-soft">The rest of this journal is still blank.</p>
        </div>
      </Ruled>
    ),
  },
];

/* ------------------------------------------------------------------ */

function useIsWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setWide(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return wide;
}

type Turn = { dir: 1 | -1; from: number } | null;

export default function Journal() {
  const reduce = useReducedMotion();
  const wide = useIsWide();
  const [open, setOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  // Desktop: index of the left page of the spread (always even). Phone: index of the single page (inside cover skipped).
  const [pos, setPos] = useState(0);
  const [turn, setTurn] = useState<Turn>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<number | null>(null);

  const step = wide ? 2 : 1;
  const first = wide ? 0 : 1;
  const lastPos = wide ? Math.floor((PAGES.length - 1) / 2) * 2 : PAGES.length - 1;

  useEffect(() => setPos(wide ? 0 : 1), [wide]);

  function openBook() {
    setOpen(true);
    setPos(first);
    window.setTimeout(() => setCoverOpen(true), reduce ? 0 : 450);
  }
  const close = useCallback(() => {
    setCoverOpen(false);
    window.setTimeout(() => {
      setOpen(false);
      triggerRef.current?.focus();
    }, reduce ? 0 : 500);
  }, [reduce]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (turn) return;
      const next = pos + dir * step;
      if (next < first || next > lastPos) return;
      if (reduce) {
        setPos(next);
        return;
      }
      setTurn({ dir, from: pos });
    },
    [turn, pos, step, first, lastPos, reduce],
  );

  // Keyboard, scroll lock and focus while the journal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, go]);

  const page = (i: number) => (PAGES[i] ? PAGES[i].render() : <div className="h-full bg-paper" />);

  // What sits underneath while a leaf is turning.
  const under = turn ? turn.from + turn.dir * step : pos;
  const leftIdx = wide ? (turn?.dir === -1 ? under : pos) : -1;
  const rightIdx = wide ? (turn?.dir === 1 ? under + 1 : pos + 1) : turn?.dir === 1 ? under : pos;

  return (
    <>
      {/* ---------------- closed journal on the desk ---------------- */}
      <div className="flex justify-center py-6">
        <motion.button
          ref={triggerRef}
          type="button"
          onClick={openBook}
          aria-haspopup="dialog"
          aria-label="Open Ashita's journal"
          whileHover={reduce ? undefined : { rotate: -1, y: -6 }}
          className="sticker relative aspect-[3/4] w-[min(78vw,360px)] rotate-[-3deg] rounded-r-[18px] rounded-l-[6px] border-[5px] border-ink bg-red text-left shadow-[12px_12px_0_rgb(19_35_58/0.35)]"
        >
          <span aria-hidden="true" className="halftone absolute inset-0 rounded-r-[14px] opacity-70" />
          <span aria-hidden="true" className="absolute inset-y-0 left-[9%] w-[4px] bg-ink/60" />
          <span aria-hidden="true" className="absolute inset-y-[-5px] right-[16%] w-4 border-x-[3px] border-ink bg-ink/80" />
          <span aria-hidden="true" className="absolute -bottom-8 left-[30%] h-12 w-4 border-[3px] border-ink bg-butter [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
          <span className="absolute left-[18%] right-[24%] top-[22%] rotate-[1deg] rounded-md border-[4px] border-ink bg-paper px-3 py-4 text-center">
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-wood-dark">Field journal</span>
            <span className="mt-1 block font-display text-3xl uppercase leading-none text-ink">Notes from the walk</span>
          </span>
          <span className="absolute bottom-[8%] left-[18%] text-xs font-bold uppercase tracking-[0.2em] text-paper">Tap to open</span>
        </motion.button>
      </div>

      {/* ---------------- the open journal takes the whole screen ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Ashita's journal"
            className="fixed inset-0 z-50 flex flex-col bg-wood-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <div aria-hidden="true" className="floorboards absolute inset-0 opacity-60" />

            {/* toolbar */}
            <div className="relative z-20 flex items-center justify-between gap-3 px-3 py-2 sm:px-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-paper" aria-live="polite">
                {wide ? `Spread ${pos / 2 + 1} of ${lastPos / 2 + 1}` : `Page ${pos} of ${PAGES.length - 1}`}
              </p>
              <button ref={closeRef} type="button" onClick={close} className="min-h-11 rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold">
                Close journal ✕
              </button>
            </div>

            {/* the book */}
            <motion.div
              className="relative z-10 mx-2 mb-2 flex-1 [perspective:2400px] sm:mx-4 sm:mb-4"
              initial={{ scale: reduce ? 1 : 0.55, y: reduce ? 0 : 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              onPointerDown={(e) => (swipe.current = e.clientX)}
              onPointerUp={(e) => {
                if (swipe.current === null) return;
                const dx = e.clientX - swipe.current;
                swipe.current = null;
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              }}
            >
              <div className={`relative grid h-full grid-cols-1 rounded-[10px] border-[5px] md:grid-cols-2 md:gap-[3px] ${wide && !coverOpen ? "border-transparent bg-transparent" : "overflow-hidden border-ink bg-ink"}`}>
                {wide && <div className="relative h-full overflow-hidden">{coverOpen ? page(leftIdx) : null}</div>}
                <div className="relative h-full overflow-hidden">{coverOpen || !wide ? page(rightIdx) : null}</div>

                {/* the turning leaf */}
                {turn && (
                  <motion.div
                    key={`${turn.from}-${turn.dir}`}
                    className={`absolute inset-y-0 z-10 [transform-style:preserve-3d] ${wide ? "w-1/2" : "w-full"} ${
                      wide && turn.dir === -1 ? "left-0" : wide ? "left-1/2" : "left-0"
                    }`}
                    style={{ transformOrigin: wide && turn.dir === -1 ? "right center" : "left center" }}
                    initial={{ rotateY: turn.dir === 1 ? 0 : wide ? 0 : -180 }}
                    animate={{ rotateY: turn.dir === 1 ? -180 : wide ? 180 : 0 }}
                    transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
                    onAnimationComplete={() => {
                      setPos(turn.from + turn.dir * step);
                      setTurn(null);
                    }}
                  >
                    {/* front face */}
                    <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">
                      {wide ? page(turn.dir === 1 ? turn.from + 1 : turn.from) : page(turn.dir === 1 ? turn.from : turn.from - 1)}
                    </div>
                    {/* back face */}
                    <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      {wide ? page(turn.dir === 1 ? turn.from + 2 : turn.from - 1) : <div className="h-full bg-cream" />}
                    </div>
                  </motion.div>
                )}

                {/* front cover swinging open (desktop: hinges at the spine) */}
                {wide && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-1/2 z-20 w-1/2 [transform-style:preserve-3d]"
                    style={{ transformOrigin: "left center", pointerEvents: coverOpen ? "none" : "auto" }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: coverOpen ? -180 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.8, ease: [0.5, 0, 0.2, 1] }}
                  >
                    <div className="absolute inset-0 grid place-items-center rounded-r-[10px] border-[5px] border-ink bg-red [backface-visibility:hidden]">
                      <span className="halftone absolute inset-0 opacity-70" />
                      <span className="relative rounded-md border-[4px] border-ink bg-paper px-6 py-5 text-center">
                        <span className="block text-xs font-bold uppercase tracking-[0.22em] text-wood-dark">Field journal</span>
                        <span className="mt-1 block font-display text-5xl uppercase leading-none">Notes from the walk</span>
                      </span>
                    </div>
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{page(0)}</div>
                  </motion.div>
                )}
              </div>

              {/* page controls */}
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={pos <= first || !!turn}
                aria-label="Previous page"
                className="absolute bottom-3 left-3 z-30 grid h-12 w-12 place-items-center rounded-full border-[3px] border-ink bg-butter font-display text-xl shadow-[3px_3px_0_var(--color-ink)] disabled:opacity-0"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={pos >= lastPos || !!turn}
                aria-label="Next page"
                className="absolute bottom-3 right-3 z-30 grid h-12 w-12 place-items-center rounded-full border-[3px] border-ink bg-butter font-display text-xl shadow-[3px_3px_0_var(--color-ink)] disabled:opacity-0"
              >
                →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
