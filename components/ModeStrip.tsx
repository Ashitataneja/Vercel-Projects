import Link from "next/link";
import { modes } from "@/lib/site";

type Props = {
  /** href of the current page */
  current: string;
  /** "tv" sits inside the TV bezel; "dock" is fixed to the bottom of inner pages */
  variant?: "tv" | "dock";
};

/**
 * Phone-camera style mode switcher. Real links, so it works without JS,
 * with the keyboard and with screen readers.
 */
export default function ModeStrip({ current, variant = "dock" }: Props) {
  const dock = variant === "dock";
  return (
    <nav
      aria-label="Site modes"
      className={
        dock
          ? "fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2"
          : "flex justify-center"
      }
    >
      <ul
        className={`flex max-w-full items-center gap-0.5 sm:gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none] ${
          dock ? "bg-ink/95 shadow-[0_6px_0_rgb(0_0_0/0.25)] backdrop-blur" : "bg-ink"
        }`}
      >
        {modes.map((m) => {
          const active = m.href === "/" ? current === "/" : current === m.href || current.startsWith(m.href + "/");
          return (
            <li key={m.href} className="shrink-0">
              <Link
                href={m.href}
                aria-current={active ? "page" : undefined}
                aria-label={m.href === "/" ? "TV (home)" : undefined}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors min-[400px]:text-[12px] sm:px-4 sm:text-[13px] sm:tracking-[0.14em] ${
                  active
                    ? "bg-butter text-ink"
                    : "text-cream hover:bg-white/10 hover:text-paper"
                }`}
              >
                {m.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
