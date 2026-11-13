/** A crumpled paper receipt or scrap: one of the little things Ashita keeps. */
export default function Receipt({ lines, title, tilt = 4, className = "" }: { lines: string[]; title: string; tilt?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`w-44 bg-paper px-4 pb-6 pt-4 font-mono text-[11px] leading-5 text-ink shadow-[4px_4px_0_rgb(19_35_58/0.25)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),92%_100%,84%_calc(100%-8px),76%_100%,68%_calc(100%-8px),60%_100%,52%_calc(100%-8px),44%_100%,36%_calc(100%-8px),28%_100%,20%_calc(100%-8px),12%_100%,4%_calc(100%-8px),0_100%)] ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <p className="text-center font-bold uppercase tracking-widest">{title}</p>
      <p className="my-1 border-t-2 border-dashed border-ink/40" />
      {lines.map((l) => (
        <p key={l} className="flex justify-between gap-2">
          <span>{l.split("|")[0]}</span>
          <span>{l.split("|")[1]}</span>
        </p>
      ))}
    </div>
  );
}
