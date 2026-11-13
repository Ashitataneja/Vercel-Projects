import ModeStrip from "./ModeStrip";

type Props = {
  current: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "city" | "paper";
  children?: React.ReactNode;
};

/** Temporary shell for inner pages until each gets its own scene. */
export default function PageShell({ current, eyebrow, title, intro, tone = "paper", children }: Props) {
  const city = tone === "city";
  return (
    <>
      <main
        className={`min-h-dvh px-4 pb-32 pt-16 sm:px-8 ${city ? "bg-blue-900 text-paper" : "bg-paper text-ink"}`}
      >
        <div className="mx-auto max-w-3xl">
          <p className={`text-sm font-bold uppercase tracking-[0.18em] ${city ? "text-butter" : "text-wood-dark"}`}>
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-none sm:text-7xl">{title}</h1>
          {intro && <p className="mt-4 max-w-prose text-lg">{intro}</p>}
          <div className="mt-10">{children}</div>
        </div>
      </main>
      <ModeStrip current={current} />
    </>
  );
}
