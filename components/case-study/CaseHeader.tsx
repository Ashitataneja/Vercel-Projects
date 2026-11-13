import type { Project } from "@/lib/site";

const toneBg: Record<Project["tone"], string> = {
  butter: "bg-butter",
  cream: "bg-cream",
  sky: "bg-sky",
  paper: "bg-paper",
};

const meta = [
  { label: "Role", value: "[PLACEHOLDER]" },
  { label: "Timeline", value: "[PLACEHOLDER]" },
  { label: "Kit", value: "[PLACEHOLDER]" },
  { label: "Stops", value: "4" },
];

/** The inside of the torn ticket: same colour, ripped bottom edge. */
export default function CaseHeader({ project }: { project: Project }) {
  return (
    <header className={`relative px-5 pb-16 pt-12 sm:px-10 sm:pt-16 ${toneBg[project.tone]}`}>
      <span aria-hidden="true" className="halftone pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em]">
          Ticket No. {project.number} · {project.kind}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.75rem,10vw,6rem)] uppercase leading-[0.9]">{project.title}</h1>
        <p className="mt-3 text-lg font-semibold">{project.client}</p>
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border-[3px] border-ink bg-ink sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="bg-paper px-4 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">{m.label}</dt>
              <dd className="mt-1 font-semibold">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {/* ripped edge */}
      <svg aria-hidden="true" viewBox="0 0 100 4" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-[11px] h-3 w-full">
        <path d={`M0 0 ${Array.from({ length: 50 }, (_, i) => `L${i * 2 + 1} ${i % 2 ? 1 : 3.4} L${i * 2 + 2} 0.6`).join(" ")} V0Z`} className="fill-current text-ink" />
      </svg>
    </header>
  );
}
