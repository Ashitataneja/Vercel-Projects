"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Journal from "./Journal";
import HandNote from "../world/HandNote";
import ModeStrip from "../ModeStrip";

/*
 * Blog: Ashita's journal lying on a painted desk. Clicking it leans in
 * toward the desk, then the journal opens full screen as a 3D book.
 * The painting and the notebook share one stage that covers the screen,
 * so the notebook always sits in the same spot on the desk.
 */
export default function BlogScene() {
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);

  return (
    <>
      <main className="relative h-dvh overflow-hidden bg-[#2a1d14]">
        <h1 className="sr-only">Blog: Ashita&apos;s journal</h1>
        <Journal
          onClosed={() => setNear(false)}
          trigger={({ open, buttonRef }) => (
            <motion.div
              className="absolute left-1/2 top-1/2 h-[max(56.25vw,100dvh)] w-[max(100vw,177.78dvh)] -translate-x-1/2 -translate-y-1/2"
              style={{ transformOrigin: "50% 52%" }}
              animate={{ scale: near ? 2.1 : 1 }}
              transition={{ duration: reduce ? 0 : 0.6, ease: [0.6, 0, 0.3, 1] }}
            >
              <Image src="/world/scenes/blog-desk.webp" alt="" fill priority sizes="180vw" className="object-cover" />
              <button
                ref={buttonRef}
                type="button"
                aria-haspopup="dialog"
                aria-label="Open Ashita's journal"
                onClick={() => {
                  if (near) return;
                  setNear(true);
                  window.setTimeout(open, reduce ? 0 : 520);
                }}
                className="group absolute left-1/2 top-[52%] w-[13%] -translate-x-1/2 -translate-y-1/2 -rotate-6"
              >
                <Image
                  src="/world/objects/notebook.webp"
                  alt=""
                  width={552}
                  height={906}
                  priority
                  className="h-auto w-full drop-shadow-[10px_18px_14px_rgb(40_25_10/0.45)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2"
                />
              </button>
            </motion.div>
          )}
        />

        <AnimatePresence>
          {!near && (
            <motion.p aria-hidden="true" exit={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 rotate-[-3deg] rounded-md bg-[#f6eedc]/90 px-3 py-1">
              <HandNote arrow="down">open my journal</HandNote>
            </motion.p>
          )}
        </AnimatePresence>

        <Link href="/" className="absolute left-3 top-3 z-30 inline-flex min-h-11 items-center rounded-full bg-[#1c1b1d]/80 px-4 text-sm font-bold text-[#f6eedc] backdrop-blur sm:left-6 sm:top-5">
          ← Street
        </Link>
      </main>
      <ModeStrip current="/blog" />
    </>
  );
}
