import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { cityStops } from "@/lib/site";

export const metadata: Metadata = { title: "About me" };

export default function About() {
  return (
    <PageShell
      current="/about"
      tone="city"
      eyebrow="You're inside the TV"
      title="Ashita's city"
      intro="[PLACEHOLDER] The city walk goes here, using the illustrations from Figma. For now, the stops in order:"
    >
      <ol className="space-y-4">
        {cityStops.map((s, i) => (
          <li key={s.id} className="flex gap-4 rounded-2xl border-[3px] border-ink bg-paper p-4 text-ink">
            <span className="font-display text-3xl text-wood-dark">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="block font-bold">{s.name}</span>
              <span className="block text-ink-soft">{s.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
