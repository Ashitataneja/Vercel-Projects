"use client";

import Image from "next/image";
import Link from "next/link";
import ModeStrip from "../ModeStrip";
import RotaryPhone from "./RotaryPhone";

/*
 * The telephone on the side table by the lamp. The painting and the phone
 * share one stage that covers the screen, so the phone always sits on the
 * painted table; the list of numbers floats above the menu.
 */
export default function ContactScene() {
  return (
    <>
      <main className="relative h-dvh overflow-hidden bg-[#2a1d14]">
        <h1 className="sr-only">Contact: dial 1 for LinkedIn, 2 for email, 3 for my website</h1>
        <RotaryPhone
          layout={(phone, legend) => (
            <>
              <div className="absolute left-1/2 top-1/2 h-[max(56.25vw,100dvh)] w-[max(100vw,177.78dvh)] -translate-x-1/2 -translate-y-1/2">
                <Image src="/world/scenes/contact-room.webp" alt="" fill priority sizes="180vw" className="object-cover" />
                <div className="absolute bottom-[29%] left-1/2 w-[min(25%,62dvh,88vw)] -translate-x-1/2 sm:left-[56%] drop-shadow-[0_24px_20px_rgb(30_15_5/0.5)]">{phone}</div>
              </div>
              <div className="absolute inset-x-3 bottom-[84px] z-20 flex justify-center">{legend}</div>
            </>
          )}
        />
        <Link href="/" className="absolute left-3 top-3 z-30 inline-flex min-h-11 items-center rounded-full bg-[#1c1b1d]/80 px-4 text-sm font-bold text-[#f6eedc] backdrop-blur sm:left-6 sm:top-5">
          ← Street
        </Link>
      </main>
      <ModeStrip current="/contact" />
    </>
  );
}
