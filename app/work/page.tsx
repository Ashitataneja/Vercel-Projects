import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { channels } from "@/lib/site";

export const metadata: Metadata = { title: "Work" };

export default function Work() {
  return (
    <PageShell
      current="/work"
      eyebrow="Channel surfing"
      title="Work"
      intro="[PLACEHOLDER] Each project is a channel. The channel-surfing view comes next."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {channels.map((c) => (
          <li key={c.slug} className="rounded-2xl border-[3px] border-ink bg-cream p-5 shadow-[5px_5px_0_var(--color-ink)]">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-wood-dark">CH {c.number}</span>
            <h2 className="mt-1 text-xl font-bold">{c.title}</h2>
            <p className="text-ink-soft">{c.genre}</p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
