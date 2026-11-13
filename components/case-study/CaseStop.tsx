import Image from "next/image";

type Props = {
  n: number;
  id: string;
  title: string;
  children: React.ReactNode;
  image?: { src: string; alt: string; width: number; height: number };
};

/** One stop of a case-study walk: the problem, field notes, turning points, where it landed. */
export default function CaseStop({ n, id, title, children, image }: Props) {
  return (
    <section aria-labelledby={`${id}-h`} className="grid gap-6 md:grid-cols-[120px_1fr]">
      <p className="font-display text-6xl leading-none text-wood" aria-hidden="true">
        {String(n).padStart(2, "0")}
      </p>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Stop {n}</p>
        <h2 id={`${id}-h`} className="mt-1 font-display text-4xl uppercase">{title}</h2>
        <div className="mt-4 max-w-prose space-y-4 text-lg">{children}</div>
        {image && <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="mt-6 w-full rounded-xl border-[3px] border-ink" />}
      </div>
    </section>
  );
}
