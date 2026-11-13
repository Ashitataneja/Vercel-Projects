"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { menu } from "@/lib/site";

type Props = {
  /** href of the current page */
  current: string;
};

/**
 * The site menu, styled like a phone camera's mode switcher: a dark bar,
 * section names in a row, the current one centred in a dark pill in yellow,
 * names fading out toward the edges. Real links, keyboard reachable.
 */
export default function ModeStrip({ current }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the current mode centred, the way a camera keeps its mode under the shutter.
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>("[aria-current='page']");
    if (!list || !active) return;
    list.scrollLeft = active.offsetLeft + active.offsetWidth / 2 - list.clientWidth / 2;
  }, [current]);

  return (
    <nav aria-label="Site" className="fixed inset-x-0 bottom-0 z-40 bg-[#0d0d0e]/92 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur">
      <ul
        ref={listRef}
        className="mx-auto flex max-w-xl items-center gap-1 overflow-x-auto px-[calc(50%-60px)] [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)] [scrollbar-width:none] sm:justify-center sm:px-4 sm:[mask-image:none]"
      >
        {menu().map((m) => {
          const active = m.href === "/" ? current === "/" : current === m.href || current.startsWith(m.href + "/");
          return (
            <li key={m.href} className="shrink-0">
              <Link
                href={m.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center justify-center rounded-full px-4 text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors sm:px-5 sm:text-sm ${
                  active ? "bg-[#2a2a2c] text-[#f5b81b]" : "text-white/85 hover:text-white"
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
