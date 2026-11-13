/** A handwritten annotation, like a note scribbled in a margin. */
export default function HandNote({ children, className = "", arrow }: { children: React.ReactNode; className?: string; arrow?: "down" | "left" | "right" }) {
  return (
    <span className={`inline-flex items-center gap-1 font-hand text-[1.35rem] leading-tight text-ink ${className}`}>
      {arrow === "left" && <Squiggle dir="left" />}
      <span>{children}</span>
      {arrow === "right" && <Squiggle dir="right" />}
      {arrow === "down" && <Squiggle dir="down" />}
    </span>
  );
}

function Squiggle({ dir }: { dir: "down" | "left" | "right" }) {
  const rot = dir === "left" ? 180 : dir === "down" ? 90 : 0;
  return (
    <svg viewBox="0 0 40 20" className="h-4 w-8 shrink-0" style={{ rotate: `${rot}deg` }} aria-hidden="true">
      <path d="M2 12 Q12 2 22 10 T34 10 M28 4 L35 10 L28 16" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
