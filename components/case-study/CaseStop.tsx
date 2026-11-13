type Props = { n: number; id: string; title: string };

export default function CaseStop({ n, id, title }: Props) {
  return (
    <section aria-labelledby={`${id}-h`} className="grid gap-6 md:grid-cols-[120px_1fr]">
      <p className="font-display text-6xl leading-none text-wood" aria-hidden="true">
        {String(n).padStart(2, "0")}
      </p>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Stop {n}</p>
        <h2 id={`${id}-h`} className="mt-1 font-display text-4xl uppercase">{title}</h2>
        <p className="mt-4 max-w-prose text-lg">[PLACEHOLDER: {title.toLowerCase()}]</p>
        <div className="mt-6 grid aspect-[16/9] place-items-center rounded-xl border-[3px] border-dashed border-ink/40 bg-ink/5 text-sm font-semibold text-ink-soft">
          [PLACEHOLDER: image]
        </div>
      </div>
    </section>
  );
}
