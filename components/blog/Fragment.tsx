"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** A photo on the desk. Tap it to flip it over and read what's written on the back. */
export default function Fragment({ caption, story, tilt, className = "" }: { caption: string; story: string; tilt: number; className?: string }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={flipped ? `${caption}. On the back: ${story}` : `Photo: ${caption}. Flip it over`}
      className={`sticker relative block w-40 [perspective:800px] sm:w-48 ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <motion.span
        className="relative block [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* front */}
        <span className="block border-[3px] border-ink bg-paper p-2 pb-1 shadow-[4px_4px_0_rgb(19_35_58/0.3)] [backface-visibility:hidden]">
          <span aria-hidden="true" className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[4deg] bg-butter/80" />
          <span className="grid aspect-[4/3] place-items-center bg-ink/10 text-xs font-semibold text-ink-soft">[PLACEHOLDER: photo]</span>
          <span className="mt-1 block text-center font-hand text-lg leading-tight">{caption}</span>
        </span>
        {/* back: handwriting */}
        <span className="absolute inset-0 grid place-items-center border-[3px] border-ink bg-cream p-3 text-center font-hand text-lg leading-tight [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {story}
        </span>
      </motion.span>
    </button>
  );
}
