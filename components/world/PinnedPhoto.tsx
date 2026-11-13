/** A photograph pinned or taped up like a memory. Shows a grey placeholder until a real image is given. */
export default function PinnedPhoto({
  caption,
  tilt = -3,
  fastener = "pin",
  className = "",
  children,
}: {
  caption?: string;
  tilt?: number;
  fastener?: "pin" | "tape";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <figure className={`relative border-[3px] border-ink bg-paper p-2 pb-1 shadow-[4px_4px_0_rgb(19_35_58/0.3)] ${className}`} style={{ rotate: `${tilt}deg` }}>
      {fastener === "pin" ? (
        <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-ink bg-red" />
      ) : (
        <span aria-hidden="true" className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[4deg] bg-butter/80" />
      )}
      <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-ink/10 text-xs font-semibold text-ink-soft">
        {children ?? "[PLACEHOLDER: photo]"}
      </div>
      {caption && <figcaption className="mt-1 text-center font-hand text-lg leading-tight">{caption}</figcaption>}
    </figure>
  );
}
