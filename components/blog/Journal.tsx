"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { journalEntries } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */
type Page = { id: string; render: () => React.ReactNode };

function Paper({ children, side }: { children?: React.ReactNode; side: "left" | "right" | "single" }) {
  // Ruled paper with a soft shadow toward the spine.
  const gutter =
    side === "left"
      ? "shadow-[inset_-40px_0_40px_-30px_rgb(59_43_36/0.35)]"
      : side === "right"
        ? "shadow-[inset_40px_0_40px_-30px_rgb(59_43_36/0.35)]"
        : "shadow-[inset_24px_0_30px_-26px_rgb(59_43_36/0.35)]";
  return (
    <div
      className={`relative h-full overflow-y-auto bg-[#fbf3e2] px-7 py-10 sm:px-12 sm:py-14 ${gutter}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(180deg, transparent 0 35px, rgb(0 107 185 / 0.13) 35px 36px), radial-gradient(ellipse at 50% 0%, rgb(255 255 255 / 0.6), transparent 70%)",
      }}
    >
      <div className="mx-auto max-w-[32rem]">{children}</div>
    </div>
  );
}

function buildPages(): Page[] {
  const pages: Page[] = [
    {
      id: "inside-cover",
      render: () => (
        <div className="flex h-full flex-col items-center justify-center bg-[#f2e3c4] p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-wood-dark">This journal belongs to</p>
          <p className="mt-2 font-hand text-6xl leading-none">Ashita</p>
          <p className="mt-6 max-w-xs font-hand text-2xl leading-snug text-ink-soft">if found, please return. or keep reading.</p>
        </div>
      ),
    },
    {
      id: "about",
      render: () => (
        <>
          <h2 className="font-display text-4xl uppercase">What&apos;s in here</h2>
          <p className="mt-[35px] text-lg leading-[36px]">
            Notes from walks, photographs, and the design thoughts I want to keep. Written slowly, the way a diary should be.
          </p>
        </>
      ),
    },
    {
      id: "contents",
      render: () => (
        <>
          <h2 className="font-display text-4xl uppercase">Contents</h2>
          {journalEntries.length ? (
            <ol className="mt-[35px] space-y-0 text-lg leading-[36px]">
              {journalEntries.map((e, i) => (
                <li key={e.id} className="flex justify-between gap-4">
                  <span>{e.title}</span>
                  <span className="text-ink-soft">{i + 4}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-[35px] font-hand text-2xl leading-[36px] text-ink-soft">The first entries are being copied in by hand. Come back soon.</p>
          )}
        </>
      ),
    },
  ];
  journalEntries.forEach((e) =>
    pages.push({
      id: e.id,
      render: () => (
        <>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-wood-dark">{e.date}</p>
          <h2 className="mt-1 font-display text-3xl uppercase leading-tight sm:text-4xl">{e.title}</h2>
          <div className="mt-[35px] space-y-[36px] text-lg leading-[36px]">
            {e.body.split("\n\n").map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </>
      ),
    }),
  );
  pages.push({
    id: "end",
    render: () => <div className="flex h-full items-center justify-center bg-[#f2e3c4] font-hand text-2xl text-ink-soft">the end, for now</div>,
  });
  return pages;
}
const PAGES = buildPages();
const isBare = (i: number) => PAGES[i]?.id === "inside-cover" || PAGES[i]?.id === "end";

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

/* ------------------------------------------------------------------ */
/* The closed book, in 3D                                              */
/* ------------------------------------------------------------------ */
function ClosedBook({ onOpen, reduce, buttonRef }: { onOpen: () => void; reduce: boolean; buttonRef: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label="Open Ashita's journal"
      className="group relative block [--t:calc(var(--w)*0.13)] [--w:min(300px,62vw)] [perspective:1600px]"
      style={{ width: "var(--w)", height: "calc(var(--w) * 1.36)" }}
    >
      {/* floor shadow */}
      <span aria-hidden="true" className="absolute -bottom-6 left-[6%] h-10 w-[100%] rounded-[50%] bg-ink/30 blur-lg transition-transform duration-500 group-hover:scale-90" />
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: -30, rotateX: 12 }}
        whileHover={reduce ? undefined : { rotateY: -16, rotateX: 8, y: -10 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
      >
        {/* back cover */}
        <span className="absolute inset-0 block rounded-r-[12px] rounded-l-[4px] bg-[#8f2f1d] [transform:translateZ(calc(var(--t)/-2))]" />
        {/* page block: fore-edge, top and bottom */}
        <span
          className="absolute right-[3px] top-[2%] block h-[96%] w-[var(--t)] [transform:translateX(calc(var(--t)/2))_rotateY(90deg)]"
          style={{ background: "repeating-linear-gradient(90deg, #fbf3e2 0 1.5px, #e3d3b2 1.5px 3px)" }}
        />
        <span
          className="absolute left-[3px] top-[2%] block h-[var(--t)] w-[calc(100%-6px)] origin-top [transform:translateZ(calc(var(--t)/2))_rotateX(-90deg)]"
          style={{ background: "repeating-linear-gradient(180deg, #fbf3e2 0 1.5px, #e3d3b2 1.5px 3px)" }}
        />
        {/* spine */}
        <span className="absolute left-0 top-0 block h-full w-[var(--t)] origin-left rounded-[3px] bg-[linear-gradient(90deg,#6e2214,#a8381f_45%,#7d2716)] [transform:translateZ(calc(var(--t)/2))_rotateY(-90deg)]">
          {[18, 30, 70, 82].map((t) => (
            <span key={t} className="absolute inset-x-0 h-[3px] bg-[#3b2b24]/50" style={{ top: `${t}%` }} />
          ))}
        </span>
        {/* front cover */}
        <span
          className="absolute inset-0 block overflow-hidden rounded-r-[12px] rounded-l-[4px] border-[2.5px] border-[#3b2b24] [transform:translateZ(calc(var(--t)/2))]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgb(255 255 255 / 0.22), transparent 55%), repeating-radial-gradient(circle at 70% 60%, rgb(0 0 0 / 0.04) 0 2px, transparent 2px 5px), linear-gradient(135deg, #c4462a, #9c3420)",
          }}
        >
          {/* hinge crease */}
          <span className="absolute inset-y-0 left-[8%] w-[2px] bg-[#3b2b24]/35" />
          {/* elastic band */}
          <span className="absolute inset-y-0 right-[14%] w-[9px] bg-[linear-gradient(90deg,#1c1714,#3a302a,#1c1714)]" />
          {/* label */}
          <span className="absolute left-[18%] right-[26%] top-[24%] rotate-[-1deg] rounded-[3px] border-2 border-[#3b2b24] bg-[#fbf3e2] px-3 py-4 text-center shadow-[2px_3px_0_rgb(59_43_36/0.35)]">
            <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-wood-dark">Journal</span>
            <span className="mt-1 block font-hand text-[clamp(1.4rem,5vw,2rem)] leading-none text-ink">notes from the walk</span>
          </span>
          {/* ribbon bookmark */}
          <span className="absolute -bottom-1 left-[34%] h-10 w-4 bg-butter [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]" />
        </span>
      </motion.span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* The open book                                                       */
/* ------------------------------------------------------------------ */
type Turn = { dir: 1 | -1; from: number };

export default function Journal() {
  const reduce = !!useReducedMotion();
  const wide = useIsWide();
  const [open, setOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [pos, setPos] = useState(0); // wide: left page of the spread (even); phone: the page shown
  const [turn, setTurn] = useState<Turn | null>(null);
  const angle = useMotionValue(0); // the turning leaf, in degrees
  const lift = useTransform(angle, (a) => Math.abs(Math.sin((a * Math.PI) / 180)));
  const leafShade = useTransform(lift, (l) => l * 0.32);
  const castShade = useTransform(lift, (l) => l * 0.45);
  // On a phone, a backward turn brings the previous page in from the left (-180 → 0).
  const backAngle = useTransform(angle, (a) => a - 180);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; dir: 1 | -1; started: boolean } | null>(null);

  const step = wide ? 2 : 1;
  const first = 0;
  const lastPos = wide ? Math.floor((PAGES.length - 1) / 2) * 2 : PAGES.length - 1;

  useEffect(() => setPos(0), [wide]);

  function openBook() {
    setPos(0);
    setOpen(true);
    window.setTimeout(() => setCoverOpen(true), reduce ? 0 : 420);
  }
  const close = useCallback(() => {
    setCoverOpen(false);
    window.setTimeout(
      () => {
        setOpen(false);
        triggerRef.current?.focus();
      },
      reduce ? 0 : 520,
    );
  }, [reduce]);

  /** Start (or continue) a turn and finish it by animating the leaf. */
  const finish = useCallback(
    (t: Turn, complete: boolean) => {
      const target = complete ? (t.dir === 1 ? -180 : 180) : 0;
      const done = () => {
        if (complete) setPos(t.from + t.dir * step);
        setTurn(null);
        angle.set(0);
      };
      if (reduce) return done();
      animate(angle, target, { duration: 0.55, ease: [0.3, 0, 0.2, 1], onComplete: done });
    },
    [angle, reduce, step],
  );

  const go = useCallback(
    (dir: 1 | -1) => {
      if (turn) return;
      const next = pos + dir * step;
      if (next < first || next > lastPos) return;
      const t = { dir, from: pos };
      setTurn(t);
      angle.set(0);
      finish(t, true);
    },
    [turn, pos, step, lastPos, angle, finish],
  );

  // Keys, scroll lock and focus while open.
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

  /* Drag a page to turn it, like holding its corner. */
  function onPointerDown(e: React.PointerEvent) {
    if (turn || !coverOpen) return;
    const r = bookRef.current!.getBoundingClientRect();
    const onRight = e.clientX > r.left + r.width / 2;
    const dir: 1 | -1 = wide ? (onRight ? 1 : -1) : onRight ? 1 : -1;
    const next = pos + dir * step;
    if (next < first || next > lastPos) return;
    drag.current = { x: e.clientX, dir, started: false };
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.started) {
      if (Math.abs(dx) < 8 || Math.sign(dx) !== -d.dir) return;
      d.started = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setTurn({ dir: d.dir, from: pos });
    }
    const width = (bookRef.current?.clientWidth ?? 800) / (wide ? 2 : 1);
    const p = Math.min(1, Math.max(0, (-dx * d.dir) / (width * 1.2)));
    angle.set(p * 180 * -d.dir);
  }
  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d?.started) return;
    finish({ dir: d.dir, from: pos }, Math.abs(angle.get()) > 70);
  }

  const page = (i: number, side: "left" | "right" | "single") =>
    PAGES[i] ? isBare(i) ? <div className="h-full">{PAGES[i].render()}</div> : <Paper side={side}>{PAGES[i].render()}</Paper> : <div className="h-full bg-[#f2e3c4]" />;

  // What lies underneath while a leaf turns.
  const under = turn ? turn.from + turn.dir * step : pos;
  const leftIdx = turn?.dir === -1 ? under : pos;
  const rightIdx = wide ? (turn?.dir === 1 ? under + 1 : pos + 1) : turn?.dir === 1 ? under : pos;

  const label = wide ? `Pages ${pos + 1}–${Math.min(pos + 2, PAGES.length)} of ${PAGES.length}` : `Page ${pos + 1} of ${PAGES.length}`;

  return (
    <>
      <ClosedBook onOpen={openBook} reduce={reduce} buttonRef={triggerRef} />

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Ashita's journal"
            className="fixed inset-0 z-50 flex flex-col bg-[#2b211c]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgb(255_220_160/0.18),transparent_65%)]" />

            <div className="relative z-20 flex items-center justify-between gap-3 px-3 py-2 sm:px-5">
              <p className="text-sm font-semibold text-paper/80" aria-live="polite">
                {label}
              </p>
              <button ref={closeRef} type="button" onClick={close} className="min-h-11 rounded-full bg-paper px-4 text-sm font-bold text-ink">
                Close ✕
              </button>
            </div>

            <motion.div
              className="relative z-10 mx-auto mb-3 w-full flex-1 px-2 [perspective:2600px] sm:px-6 md:max-w-[min(1400px,calc((100dvh-80px)*1.5))]"
              initial={{ scale: reduce ? 1 : 0.5, y: reduce ? 0 : 60, rotateX: reduce ? 0 : 18 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {/* the book: cover board behind the pages gives it an edge and thickness */}
              <div
                ref={bookRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className={`relative h-full touch-pan-y select-none ${wide && !coverOpen ? "" : "rounded-[10px] bg-[#9c3420] p-[6px] shadow-[0_30px_60px_rgb(0_0_0/0.5)] sm:p-[10px]"}`}
              >
                {/* page-block thickness peeking under the pages */}
                {(coverOpen || !wide) && <span aria-hidden="true" className="absolute inset-x-[10px] bottom-[2px] h-[8px] rounded-b-sm bg-[repeating-linear-gradient(180deg,#fbf3e2_0_1.5px,#e3d3b2_1.5px_3px)]" />}
                <div className="relative grid h-full grid-cols-1 overflow-hidden rounded-[4px] md:grid-cols-2">
                  {wide && <div className="relative h-full overflow-hidden">{coverOpen ? page(leftIdx, "left") : null}</div>}
                  <div className="relative h-full overflow-hidden">
                    {coverOpen || !wide ? page(rightIdx, wide ? "right" : "single") : null}
                    {/* the shadow the lifting leaf throws on the page below */}
                    {turn && turn.dir === 1 && <motion.span aria-hidden="true" style={{ opacity: castShade }} className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.5),transparent_60%)]" />}
                  </div>
                  {wide && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#3b2b24]/40" />}

                  {/* the turning leaf */}
                  {turn && (
                    <motion.div
                      className={`absolute inset-y-0 z-10 [transform-style:preserve-3d] ${wide ? "w-1/2" : "w-full"} ${wide && turn.dir === -1 ? "left-0" : wide ? "left-1/2" : "left-0"}`}
                      style={{
                        rotateY: !wide && turn.dir === -1 ? backAngle : angle,
                        transformOrigin: wide && turn.dir === -1 ? "right center" : "left center",
                      }}
                    >
                      <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">
                        {wide ? page(turn.dir === 1 ? turn.from + 1 : turn.from, turn.dir === 1 ? "right" : "left") : page(turn.dir === 1 ? turn.from : turn.from - 1, "single")}
                        <motion.span aria-hidden="true" style={{ opacity: leafShade }} className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.35),rgb(255_255_255/0.15)_70%,rgb(0_0_0/0.25))]" />
                      </div>
                      <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        {wide ? page(turn.dir === 1 ? turn.from + 2 : turn.from - 1, turn.dir === 1 ? "left" : "right") : <div className="h-full bg-[#f2e3c4]" />}
                        <motion.span aria-hidden="true" style={{ opacity: leafShade }} className="pointer-events-none absolute inset-0 bg-[linear-gradient(270deg,rgb(0_0_0/0.35),transparent_70%)]" />
                      </div>
                    </motion.div>
                  )}

                  {/* front cover swinging open on its spine (wide screens) */}
                  {wide && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-1/2 z-20 w-1/2 [transform-style:preserve-3d]"
                      style={{ transformOrigin: "left center", pointerEvents: coverOpen ? "none" : "auto" }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: coverOpen ? -180 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.85, ease: [0.5, 0, 0.2, 1] }}
                    >
                      <div
                        className="absolute inset-0 grid place-items-center rounded-r-[10px] border-[2.5px] border-[#3b2b24] [backface-visibility:hidden]"
                        style={{ background: "radial-gradient(ellipse at 30% 20%, rgb(255 255 255 / 0.2), transparent 55%), linear-gradient(135deg, #c4462a, #9c3420)" }}
                      >
                        <span className="rounded-[3px] border-2 border-[#3b2b24] bg-[#fbf3e2] px-8 py-6 text-center">
                          <span className="block text-xs font-bold uppercase tracking-[0.22em] text-wood-dark">Journal</span>
                          <span className="mt-1 block font-hand text-5xl leading-none">notes from the walk</span>
                        </span>
                      </div>
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{page(0, "left")}</div>
                    </motion.div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => go(-1)}
                disabled={pos <= first || !!turn}
                aria-label="Previous page"
                className="absolute bottom-4 left-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-paper/90 text-xl font-bold text-ink shadow-[0_4px_12px_rgb(0_0_0/0.3)] disabled:opacity-0 sm:left-8"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={pos >= lastPos || !!turn}
                aria-label="Next page"
                className="absolute bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-paper/90 text-xl font-bold text-ink shadow-[0_4px_12px_rgb(0_0_0/0.3)] disabled:opacity-0 sm:right-8"
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
