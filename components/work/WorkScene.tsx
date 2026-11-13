"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import PaintedTicket from "./PaintedTicket";
import HandNote from "../world/HandNote";
import ModeStrip from "../ModeStrip";
import { projects } from "@/lib/site";

/*
 * Work: a keepsake box on a table in a painted room.
 * closed → (click) zoom toward the box → it opens and light spills out →
 * the tickets rise into a fan → tearing one opens its case study on the TV.
 * The painting and the box sit on one "stage" that covers the screen like
 * object-fit: cover, so the box always lands on the painted table.
 */
type Stage = "closed" | "zooming" | "open" | "tickets";

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const set = () => setNarrow(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return narrow;
}

export default function WorkScene() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const narrow = useNarrow();
  const [stage, setStage] = useState<Stage>("closed");
  const [leaving, setLeaving] = useState(false);

  function openBox() {
    if (stage !== "closed") return;
    projects.forEach((p) => router.prefetch(`/work/${p.slug}`));
    if (reduce) return setStage("tickets");
    setStage("zooming");
    window.setTimeout(() => setStage("open"), 650);
    window.setTimeout(() => setStage("tickets"), 1250);
  }

  const isOpen = stage === "open" || stage === "tickets";
  const n = projects.length;

  return (
    <>
      <main className="relative h-dvh overflow-hidden bg-[#2a1d14]">
        {/* the painted room and the box on its table */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[max(56.25vw,100dvh)] w-[max(100vw,177.78dvh)] -translate-x-1/2 -translate-y-1/2"
          style={{ transformOrigin: "50% 46%" }}
          animate={{ scale: stage === "closed" ? 1 : 1.55, filter: stage === "tickets" ? "brightness(0.55)" : "brightness(1)" }}
          transition={{ duration: reduce ? 0 : 0.75, ease: [0.6, 0, 0.3, 1] }}
        >
          <Image src="/world/scenes/work-room.webp" alt="" fill priority sizes="180vw" className="object-cover" />

          {/* warm light from inside the open box */}
          <AnimatePresence>
            {isOpen && (
              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-[30%] h-[46%] w-[40%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_70%,rgb(255_226_150/0.95),rgb(255_190_90/0.45)_35%,transparent_70%)] mix-blend-screen"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={openBox}
            disabled={stage !== "closed"}
            aria-label="Open the box of tickets: one ticket per project"
            className="group absolute bottom-[42%] left-1/2 w-[21%] -translate-x-1/2 disabled:cursor-default"
          >
            <motion.span className="relative block" animate={stage === "closed" && !reduce ? { y: [0, -4, 0] } : { y: 0 }} transition={{ repeat: stage === "closed" ? Infinity : 0, duration: 2.4, ease: "easeInOut" }}>
              <Image
                src="/world/objects/box-closed.webp"
                alt=""
                width={924}
                height={766}
                priority
                className={`h-auto w-full drop-shadow-[0_18px_18px_rgb(40_25_10/0.45)] transition-opacity duration-300 group-hover:brightness-105 ${isOpen ? "opacity-0" : "opacity-100"}`}
              />
              <Image
                src="/world/objects/box-open.webp"
                alt=""
                width={826}
                height={874}
                className={`absolute bottom-0 left-1/2 h-auto w-[90%] -translate-x-1/2 drop-shadow-[0_18px_18px_rgb(40_25_10/0.45)] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
              />
            </motion.span>
          </button>
        </motion.div>

        {/* one quiet invitation, gone once the box is open */}
        <AnimatePresence>
          {stage === "closed" && (
            <motion.p aria-hidden="true" exit={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 rotate-[-3deg] rounded-md bg-[#f6eedc]/90 px-3 py-1">
              <HandNote arrow="down">open the box</HandNote>
            </motion.p>
          )}
        </AnimatePresence>

        {/* the tickets, risen from the box */}
        {stage === "tickets" && (
          <div className={narrow ? "absolute inset-0 overflow-y-auto pb-32 pt-20" : "absolute inset-0"}>
            <h1 className="sr-only">Work: one ticket per project</h1>
            <ul className={narrow ? "mx-auto flex w-[min(86vw,420px)] flex-col gap-5" : "absolute inset-0"}>
              {projects.map((p, i) => {
                const mid = (n - 1) / 2;
                const k = i - mid;
                const fan = { left: `calc(50% + ${k * 18}vw)`, top: `calc(38% + ${Math.abs(k) * 5}vh)`, rotate: k * 6 };
                return (
                  <motion.li
                    key={p.slug}
                    className={narrow ? "relative" : "absolute w-[min(19vw,300px)] -translate-x-1/2 -translate-y-1/2"}
                    style={narrow ? undefined : { left: fan.left, top: fan.top }}
                    initial={reduce ? false : { opacity: 0, y: narrow ? 120 : 260, scale: 0.3, rotate: 0 }}
                    animate={{ opacity: leaving ? 0.25 : 1, y: 0, scale: 1, rotate: narrow ? (i % 2 ? 1.5 : -1.5) : fan.rotate }}
                    whileHover={reduce ? undefined : { y: -14, rotate: 0, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 150, damping: 17, delay: reduce ? 0 : i * 0.08 }}
                  >
                    <PaintedTicket
                      project={p}
                      className="w-full"
                      onTorn={() => {
                        setLeaving(true);
                        router.push(`/work/${p.slug}`);
                      }}
                    />
                  </motion.li>
                );
              })}
            </ul>
            {!narrow && (
              <p aria-hidden="true" className="pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 rotate-[-2deg] rounded-md bg-[#f6eedc]/90 px-3 py-1">
                <HandNote>pick one and tear it</HandNote>
              </p>
            )}
          </div>
        )}

        <Link
          href="/"
          className="absolute left-3 top-3 z-30 inline-flex min-h-11 items-center rounded-full bg-[#1c1b1d]/80 px-4 text-sm font-bold text-[#f6eedc] backdrop-blur sm:left-6 sm:top-5"
        >
          ← Street
        </Link>
        {stage === "tickets" && (
          <button
            type="button"
            onClick={() => setStage("closed")}
            className="absolute right-3 top-3 z-30 inline-flex min-h-11 items-center rounded-full bg-[#1c1b1d]/80 px-4 text-sm font-bold text-[#f6eedc] backdrop-blur sm:right-6 sm:top-5"
          >
            Close the box
          </button>
        )}
      </main>
      <ModeStrip current="/work" />
    </>
  );
}
