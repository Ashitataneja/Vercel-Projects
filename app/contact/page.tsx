import type { Metadata } from "next";
import Link from "next/link";
import ModeStrip from "@/components/ModeStrip";
import RotaryPhone from "@/components/contact/RotaryPhone";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[radial-gradient(ellipse_at_50%_55%,var(--color-cream),var(--color-paper)_70%)] px-5 pb-28 pt-5 sm:px-10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]">
            ← Street
          </Link>
          <h1 className="font-display text-2xl uppercase tracking-wide">Contact</h1>
        </div>
        <div className="flex flex-1 items-center justify-center py-4">
          <RotaryPhone />
        </div>
      </main>
      <ModeStrip current="/contact" />
    </>
  );
}
