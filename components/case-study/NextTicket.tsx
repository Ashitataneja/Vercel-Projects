import Link from "next/link";
import type { Project } from "@/lib/site";

export default function NextTicket({ next }: { next: Project }) {
  return (
    <Link
      href={`/work/${next.slug}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border-[4px] border-ink bg-cream p-5 shadow-[6px_6px_0_var(--color-ink)] transition-transform hover:-translate-y-1 sm:p-6"
    >
      <span>
        <span className="block text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Next ticket · No. {next.number}</span>
        <span className="mt-1 block font-display text-3xl uppercase sm:text-4xl">{next.title}</span>
      </span>
      <span aria-hidden="true" className="font-display text-4xl transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}
