"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "framer-motion";
import type { Project } from "@/lib/site";

/*
 * A painted paper ticket (public/world/objects/ticket.webp) printed with a
 * project. It tears along its own perforation, which sits at PERF of the
 * ticket's width: the body and the stub are the same painting, clipped apart.
 */
const PERF = 77.5; // % across, measured from the painting
const IMG = "url(/world/objects/ticket.webp)";
const TEAR_AT = 60; // px of pull before the paper gives

function Face({ tint, part, children }: { tint: string; part: "body" | "stub"; children: React.ReactNode }) {
  return (
    <span
      className="absolute inset-0 block"
      style={{ clipPath: part === "body" ? `inset(0 ${100 - PERF}% 0 0)` : `inset(0 0 0 ${PERF}%)` }}
    >
      <span className="absolute inset-0 block bg-contain bg-center bg-no-repeat" style={{ backgroundImage: IMG }} />
      {/* the ink: tinted only where there's paper */}
      <span
        className="absolute inset-0 block opacity-55 mix-blend-multiply"
        style={{ background: tint, maskImage: IMG, WebkitMaskImage: IMG, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
      />
      {children}
    </span>
  );
}

type Props = {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
  onTorn: () => void;
};

export default function PaintedTicket({ project, className = "", style, onTorn }: Props) {
  const reduce = useReducedMotion();
  const [torn, setTorn] = useState(false);
  const dragged = useRef(false);
  const pull = useMotionValue(0);
  const stubRotate = useTransform(pull, [0, TEAR_AT], [0, 10]);

  function tear() {
    if (torn) return;
    setTorn(true);
    if (reduce) return onTorn();
    animate(pull, 220, { duration: 0.4, ease: [0.3, 0, 0.6, 1] });
    window.setTimeout(onTorn, 650);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    window.setTimeout(() => (dragged.current = false), 0);
    if (info.offset.x > TEAR_AT || info.velocity.x > 700) tear();
    else animate(pull, 0, { type: "spring", stiffness: 500, damping: 22 });
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (dragged.current) return;
        tear();
      }}
      aria-label={`${project.title}, ${project.client}. Tear the ticket to open the case study.`}
      className={`group relative block aspect-[1100/520] touch-pan-y [container-type:inline-size] select-none drop-shadow-[0_10px_14px_rgb(59_43_36/0.35)] ${className}`}
      style={style}
    >
      {/* body */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block"
        style={{ transformOrigin: "0% 100%" }}
        animate={torn ? { y: 60, rotate: -8, opacity: 0 } : undefined}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.5, 0, 0.75, 0] }}
      >
        <Face tint={project.tint} part="body">
          <span className="absolute left-[7%] top-[16%] block w-[66%] text-left text-[#3b2b24]">
            <span className="block text-[2.6cqw] font-bold uppercase tracking-[0.2em] opacity-75">
              {project.printed} · {project.kind}
            </span>
            <span className="mt-[4%] block font-display text-[8cqw] uppercase leading-[0.95]">{project.title}</span>
            <span className="mt-[4%] block text-[3.4cqw] font-semibold">{project.client}</span>
          </span>
        </Face>
      </motion.span>
      {/* stub: pull it to tear */}
      <motion.span
        aria-hidden="true"
        drag={reduce || torn ? false : "x"}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 200 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={onDragEnd}
        className="absolute inset-0 block cursor-grab active:cursor-grabbing"
        style={{ x: pull, rotate: stubRotate, transformOrigin: `${PERF}% 0%` }}
        animate={torn ? { y: 140, rotate: 30, opacity: 0 } : undefined}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.5, 0, 0.75, 0] }}
      >
        <Face tint={project.tint} part="stub">
          <span className="absolute left-[80%] top-0 flex h-full w-[16%] flex-col items-center justify-center text-[#3b2b24]">
            <span className="text-[2.2cqw] font-bold uppercase tracking-[0.2em] opacity-75">No.</span>
            <span className="font-display text-[9cqw] leading-none">{project.number}</span>
          </span>
        </Face>
      </motion.span>
    </button>
  );
}
