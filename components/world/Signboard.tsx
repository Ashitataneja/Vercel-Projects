/** A painted wooden signboard on a post. Pure illustration; wrap it in a link to make it navigation. */
export default function Signboard({
  children,
  point = "right",
  tone = "butter",
  className = "",
  post = true,
}: {
  children: React.ReactNode;
  point?: "left" | "right" | "none";
  tone?: "butter" | "cream" | "paper" | "sky";
  className?: string;
  post?: boolean;
}) {
  const bg = { butter: "bg-butter", cream: "bg-cream", paper: "bg-paper", sky: "bg-sky" }[tone];
  const clip =
    point === "right"
      ? "[clip-path:polygon(0_0,calc(100%-18px)_0,100%_50%,calc(100%-18px)_100%,0_100%)] pr-7"
      : point === "left"
        ? "[clip-path:polygon(18px_0,100%_0,100%_100%,18px_100%,0_50%)] pl-7"
        : "";
  return (
    <span className={`relative inline-flex flex-col items-center ${className}`}>
      <span className="relative inline-block drop-shadow-[3px_3px_0_var(--color-ink)]">
        <span className={`block bg-ink p-[3px] ${clip}`}>
          <span className={`block whitespace-nowrap px-3 py-1.5 font-display text-lg uppercase leading-none tracking-wide text-ink ${bg} ${clip}`}>{children}</span>
        </span>
      </span>
      {post && <span aria-hidden="true" className="h-10 w-2.5 border-x-[3px] border-ink bg-wood" />}
    </span>
  );
}
