"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TicketBoard from "./TicketBoard";
import HandNote from "../world/HandNote";

/*
 * Ashita's keepsake box: a kraft-board box drawn in 3D with CSS.
 * The lid swings open on its back hinge, then the tickets inside rise out.
 * Box size is one CSS variable (--w); every face is derived from it.
 */
const faces = {
  // front and back are W x H, sides are D x H, top/bottom are W x D
  base: "absolute left-0 top-0 border-[2.5px] border-[#3b2b24]",
};

function Kraft({ shade = 0, children, className = "" }: { shade?: number; children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={`${faces.base} ${className}`}
      style={{
        backgroundColor: shade > 0 ? `color-mix(in oklab, #c8955c, #3b2b24 ${shade}%)` : "#d3a46b",
        backgroundImage:
          "repeating-linear-gradient(92deg, rgb(255 255 255 / 0.05) 0 2px, transparent 2px 7px), radial-gradient(ellipse at 30% 20%, rgb(255 255 255 / 0.18), transparent 60%)",
      }}
    >
      {children}
    </div>
  );
}

export default function KeepsakeBox() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="ticket-collection"
        aria-label={open ? "The keepsake box is open: tickets are above" : "Open my keepsake box of project tickets"}
        disabled={open}
        className={`group relative mt-6 transition-[--w] duration-500 [--d:calc(var(--w)*0.62)] [--h:calc(var(--w)*0.4)] disabled:cursor-default ${open ? "[--w:min(280px,56vw)]" : "[--w:min(440px,74vw)]"}`}
        style={{ width: "var(--w)", height: "calc(var(--h) + var(--d) * 0.5)" }}
      >
        {!open && (
          <span aria-hidden="true" className="absolute -top-12 left-1/2 w-max -translate-x-1/2 rotate-[-4deg]">
            <HandNote arrow="down">open me</HandNote>
          </span>
        )}
        {/* floor shadow */}
        <span aria-hidden="true" className="absolute -bottom-4 left-1/2 h-8 w-[110%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-md" />

        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 block [perspective:1400px]" style={{ height: "var(--h)" }}>
          <motion.span
            className="absolute inset-0 block [transform-style:preserve-3d]"
            initial={false}
            animate={{ rotateX: -24, rotateY: open ? 0 : -14, y: open ? 0 : 0 }}
            whileHover={open || reduce ? undefined : { rotateY: -6 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            {/* bottom */}
            <Kraft shade={45} className="h-[var(--d)] w-[var(--w)] [transform:translateY(calc(var(--h)-var(--d)/2))_rotateX(90deg)]" />
            {/* back (inside face shows when the lid is up) */}
            <Kraft shade={35} className="h-[var(--h)] w-[var(--w)] [transform:translateZ(calc(var(--d)/-2))]" />
            {/* sides */}
            <Kraft shade={22} className="h-[var(--h)] w-[var(--d)] [transform:translateX(calc(var(--d)/-2))_rotateY(-90deg)]" />
            <Kraft shade={22} className="h-[var(--h)] w-[var(--d)] [transform:translateX(calc(var(--w)-var(--d)/2))_rotateY(90deg)]" />
            {/* ticket ends peeking out once open */}
            {open && (
              <span className="absolute left-[12%] top-0 block h-[var(--h)] w-[76%] [transform:translateZ(calc(var(--d)/-6))]">
                {["#FFC973", "#30A0E0", "#FFE3B3", "#F7A8C4"].map((c, i) => (
                  <span key={c} className="absolute bottom-[40%] h-[60%] w-[22%] rounded-sm border-2 border-[#3b2b24]" style={{ left: `${i * 26}%`, background: c, rotate: `${(i - 1.5) * 6}deg` }} />
                ))}
              </span>
            )}
            {/* front, with label and tape */}
            <Kraft shade={0} className="h-[var(--h)] w-[var(--w)] [transform:translateZ(calc(var(--d)/2))]">
              <span className="absolute left-1/2 top-[28%] -translate-x-1/2 -rotate-2 rounded-sm border-2 border-[#3b2b24] bg-paper px-4 py-1.5 text-center shadow-[2px_2px_0_rgb(59_43_36/0.4)]">
                <span className="block font-hand text-[clamp(1.1rem,4vw,1.6rem)] leading-none text-ink">things I&apos;ve kept</span>
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">Work · 5 tickets</span>
              </span>
              <span className="absolute -top-1 left-[8%] h-5 w-14 rotate-[-8deg] bg-rose-light/80" />
            </Kraft>
            {/* lid: hinged along the back top edge. 90deg = closed (lying flat), ~205deg = flipped open */}
            <span className="absolute left-0 top-0 block h-[var(--d)] w-[var(--w)] [transform-style:preserve-3d] [transform:translateZ(calc(var(--d)/-2))]">
              <motion.span
                className="absolute inset-0 block origin-top [transform-style:preserve-3d]"
                initial={false}
                animate={{ rotateX: open ? 205 : 90 }}
                transition={{ duration: reduce ? 0 : 0.8, ease: [0.3, 1.25, 0.5, 1] }}
              >
                <Kraft shade={0} className="h-[var(--d)] w-[var(--w)]">
                  <span className="absolute inset-x-[44%] inset-y-0 bg-[#3b2b24]/15" />
                  <span className="absolute right-[10%] top-[34%] grid h-12 w-12 rotate-12 place-items-center rounded-full border-2 border-dashed border-red text-[9px] font-black uppercase leading-tight text-red">
                    Keep
                  </span>
                </Kraft>
              </motion.span>
            </span>
          </motion.span>
        </span>
      </button>

      {open && (
        <div className="mt-14 w-full">
          <TicketBoard />
        </div>
      )}
    </div>
  );
}
