"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Ticket from "./Ticket";
import { projects, type Project } from "@/lib/site";

const tilts = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2];

const toneBg: Record<Project["tone"], string> = {
  butter: "bg-butter",
  cream: "bg-cream",
  sky: "bg-sky",
  paper: "bg-paper",
};

/**
 * The box-office wall. When a ticket tears, the case study "opens" from
 * where the ticket was and fills the screen before the route changes.
 */
export default function TicketBoard() {
  const [opening, setOpening] = useState<{ rect: DOMRect; tone: Project["tone"] } | null>(null);

  return (
    <>
      <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2 xl:gap-x-14">
        {projects.map((p, i) => (
          <Ticket key={p.slug} project={p} tilt={tilts[i % tilts.length]} onTearStart={(rect, tone) => setOpening({ rect, tone })} />
        ))}
      </ul>

      {opening && (
        <motion.div
          aria-hidden="true"
          className={`fixed z-50 border-[4px] border-ink ${toneBg[opening.tone]}`}
          initial={{
            top: opening.rect.top,
            left: opening.rect.left,
            width: opening.rect.width,
            height: opening.rect.height,
            borderRadius: 14,
            opacity: 0,
          }}
          animate={{ top: 0, left: 0, width: "100vw", height: "100dvh", borderRadius: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
        >
          <span className="halftone absolute inset-0 opacity-50" />
        </motion.div>
      )}
    </>
  );
}
