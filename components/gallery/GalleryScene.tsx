"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Avatar from "../world/Avatar";
import HandNote from "../world/HandNote";
import ModeStrip from "../ModeStrip";
import { galleryPhotos, type Photo } from "@/lib/site";
import { downloadMemoryCard } from "@/lib/memoryCard";

/*
 * Gallery: Ashita's photographs hung as Polaroids in a painted gallery room.
 * Clicking one lifts it off the wall into a memory card (photo, caption,
 * her name, her avatar) that can be downloaded.
 */
const SPOTS = [{ tilt: -4 }, { tilt: 3 }, { tilt: -2 }, { tilt: 4 }, { tilt: -3 }];

export default function GalleryScene() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo: Photo | null = picked === null ? null : galleryPhotos[picked];

  useEffect(() => {
    if (picked === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPicked(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picked]);

  async function download() {
    if (!photo) return;
    setSaving(true);
    try {
      await downloadMemoryCard({ scene: photo.src, title: photo.caption, subtitle: [photo.place, photo.date].filter(Boolean).join(" · "), photo: true }, `ashita-photo-${(picked ?? 0) + 1}.png`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <main className="relative h-dvh overflow-hidden bg-[#2a1d14]">
        <h1 className="sr-only">Gallery: photographs from my walks</h1>
        <div className="absolute left-1/2 top-1/2 h-[max(56.25vw,100dvh)] w-[max(100vw,177.78dvh)] -translate-x-1/2 -translate-y-1/2">
          <Image src="/world/scenes/gallery-room.webp" alt="" fill priority sizes="180vw" className="object-cover" />
          {galleryPhotos.length > 0 ? null : (
            <p className="absolute left-1/2 top-[30%] -translate-x-1/2 rotate-[-2deg] rounded-md bg-[#f6eedc]/90 px-3 py-1">
              <HandNote>the first photographs are still developing</HandNote>
            </p>
          )}
        </div>

        {/* the photographs, hung in a row across the painted wall; wraps to fit any screen */}
        {galleryPhotos.length > 0 && (
          <ul className="absolute inset-x-0 top-[14%] mx-auto flex max-w-5xl flex-wrap items-start justify-center gap-x-[clamp(12px,3vw,40px)] gap-y-6 px-4">
            {galleryPhotos.map((p, i) => (
              <li key={p.src} className="w-[clamp(110px,22vw,190px)]">
                <button
                  type="button"
                  onClick={() => setPicked(i)}
                  aria-label={`Photo: ${p.caption}. Pick it up`}
                  className="block w-full bg-[#fbf6ec] p-[6%] pb-[18%] shadow-[0_10px_18px_rgb(40_25_10/0.35)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0"
                  style={{ rotate: `${SPOTS[i % SPOTS.length].tilt}deg` }}
                >
                  <Image src={p.src} alt="" width={p.width} height={p.height} sizes="200px" className="aspect-square w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* a photograph, picked up off the wall */}
        <AnimatePresence>
          {photo && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={photo.caption}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setPicked(null)}
            >
              <motion.figure
                className="relative w-[min(88vw,460px,calc((100dvh-180px)*0.8))] bg-[#fbf6ec] p-[5%] pb-[4%] shadow-[0_30px_60px_rgb(0_0_0/0.5)]"
                initial={reduce ? false : { scale: 0.4, rotate: -8, y: 80 }}
                animate={{ scale: 1, rotate: -1.5, y: 0 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              >
                <Image src={photo.src} alt={photo.caption} width={photo.width} height={photo.height} sizes="460px" className="aspect-square w-full object-cover" />
                <figcaption className="mt-3 flex items-end justify-between gap-3">
                  <span>
                    <span className="block font-hand text-3xl leading-none text-[#3b2b24]">{photo.caption}</span>
                    {(photo.place || photo.date) && <span className="mt-1 block text-sm text-[#6b5547]">{[photo.place, photo.date].filter(Boolean).join(" · ")}</span>}
                    <span className="mt-2 block font-display text-lg uppercase tracking-wide text-[#3b2b24]">Ashita</span>
                  </span>
                  <Avatar className="h-24 w-auto shrink-0" />
                </figcaption>
              </motion.figure>
              <div className="absolute inset-x-4 bottom-6 flex flex-wrap justify-center gap-3">
                <button ref={closeRef} type="button" onClick={() => setPicked(null)} className="min-h-11 whitespace-nowrap rounded-full bg-[#f6eedc] px-5 text-sm font-bold text-[#3b2b24]">
                  ← Back to the wall
                </button>
                <button type="button" onClick={download} disabled={saving} className="min-h-11 whitespace-nowrap rounded-full bg-[#f2b51d] px-5 text-sm font-bold text-[#1c1b1d] disabled:opacity-60">
                  {saving ? "Printing…" : "Download ↓"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href="/" className="absolute left-3 top-3 z-30 inline-flex min-h-11 items-center rounded-full bg-[#1c1b1d]/80 px-4 text-sm font-bold text-[#f6eedc] backdrop-blur sm:left-6 sm:top-5">
          ← Street
        </Link>
      </main>
      <ModeStrip current="/gallery" />
    </>
  );
}
