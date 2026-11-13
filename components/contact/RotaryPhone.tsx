"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { directory } from "@/lib/site";

/*
 * Geometry of a real rotary dial (angles in degrees, 0 = 3 o'clock, clockwise).
 * The finger stop sits at STOP. Hole for value v (1..10, where 10 is "0")
 * sits v*STEP counter-clockwise from the stop. Dialling v means dragging
 * that hole clockwise until it hits the stop: a rotation of v*STEP.
 */
const STOP = 62;
const STEP = 30;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const value = (d: number) => (d === 0 ? 10 : d);
const holeAngle = (d: number) => STOP - value(d) * STEP;
const HOLE_R = 37; // hole centre, as % of the dial's width from its centre
/** Same radius in the finger plate's own coordinates (plate is inset 3% each side). */
const PLATE_R = HOLE_R / 0.94;

type Status =
  | { kind: "idle" }
  | { kind: "dialling"; digit: number }
  | { kind: "ringing"; digit: number }
  | { kind: "connected"; digit: number }
  | { kind: "wrong"; digit: number };

/* ---------------- sound: tiny synthesised clicks, no audio files ---------------- */
function useClicks(muted: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  return useCallback(
    (kind: "tick" | "stop") => {
      if (muted) return;
      try {
        ctx.current ??= new AudioContext();
        const ac = ctx.current;
        const len = kind === "tick" ? 0.018 : 0.05;
        const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * len), ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = kind === "tick" ? 2400 : 900;
        const gain = ac.createGain();
        gain.gain.value = kind === "tick" ? 0.35 : 0.6;
        src.buffer = buf;
        src.connect(filter).connect(gain).connect(ac.destination);
        src.start();
      } catch {
        /* audio unavailable: stay silent */
      }
    },
    [muted],
  );
}

export default function RotaryPhone() {
  const reduce = useReducedMotion();
  const rot = useMotionValue(0);
  const dialRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ digit: number; last: number; total: number; hit: boolean } | null>(null);
  const busy = useRef(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [muted, setMuted] = useState(false);
  const click = useClicks(muted);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem("phone-muted") === "1");
    } catch {}
  }, []);
  function toggleMute() {
    setMuted((m) => {
      try {
        localStorage.setItem("phone-muted", m ? "0" : "1");
      } catch {}
      return !m;
    });
  }

  /** What happens once a number has been dialled. */
  const connect = useCallback((digit: number) => {
    const entry = directory.find((e) => e.digit === digit);
    if (!entry) {
      setStatus({ kind: "wrong", digit });
      return;
    }
    setStatus({ kind: "ringing", digit });
    window.setTimeout(() => {
      setStatus({ kind: "connected", digit });
      if (entry.href.startsWith("mailto:")) window.location.href = entry.href;
      else window.open(entry.href, "_blank", "noopener");
    }, 900);
  }, []);

  /** Let the dial spin home, ticking once per number, then connect. */
  const release = useCallback(
    (digit: number, completed: boolean) => {
      const from = rot.get();
      if (from <= 0.5) {
        busy.current = false;
        return;
      }
      if (!completed) {
        animate(rot, 0, { type: "spring", stiffness: 260, damping: 26, onComplete: () => (busy.current = false) });
        return;
      }
      let lastTick = Math.floor(from / STEP);
      animate(rot, 0, {
        duration: reduce ? 0.01 : 0.18 + value(digit) * 0.09,
        ease: "linear",
        onUpdate: (v) => {
          const t = Math.floor(v / STEP);
          if (t < lastTick) {
            lastTick = t;
            click("tick");
          }
        },
        onComplete: () => {
          busy.current = false;
          connect(digit);
        },
      });
    },
    [click, connect, reduce, rot],
  );

  /** Keyboard / tap: the dial turns itself all the way, then returns. */
  const autoDial = useCallback(
    (digit: number) => {
      if (busy.current) return;
      busy.current = true;
      setStatus({ kind: "dialling", digit });
      if (reduce) {
        busy.current = false;
        connect(digit);
        return;
      }
      animate(rot, value(digit) * STEP, {
        duration: 0.25 + value(digit) * 0.05,
        ease: [0.3, 0, 0.4, 1],
        onComplete: () => {
          click("stop");
          window.setTimeout(() => release(digit, true), 120);
        },
      });
    },
    [click, connect, reduce, release, rot],
  );

  // Pressing 1–0 anywhere on the page dials that number.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]")) return;
      if (/^[0-9]$/.test(e.key)) autoDial(Number(e.key));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoDial]);

  function pointerAngle(e: React.PointerEvent) {
    const r = dialRef.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  }

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>, digit: number) {
    if (busy.current || reduce) return;
    e.preventDefault();
    busy.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { digit, last: pointerAngle(e), total: 0, hit: false };
    setStatus({ kind: "dialling", digit });
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const a = pointerAngle(e);
    let delta = a - d.last;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    d.last = a;
    const max = value(d.digit) * STEP;
    d.total = Math.min(max, Math.max(0, d.total + delta));
    rot.set(d.total);
    if (!d.hit && d.total >= max - 0.5) {
      d.hit = true;
      click("stop");
    } else if (d.hit && d.total < max - 4) d.hit = false;
  }
  function onPointerUp() {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (rot.get() < 3) {
      // A tap without a turn: dial it for them.
      busy.current = false;
      autoDial(d.digit);
      return;
    }
    release(d.digit, d.hit);
    if (!d.hit) setStatus({ kind: "idle" });
  }

  const entry = "digit" in status ? directory.find((x) => x.digit === status.digit) : undefined;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      {/* ---------------- the phone ---------------- */}
      <div className="relative mx-auto w-full max-w-[520px]">
        <PhoneBody lifted={status.kind === "ringing" || status.kind === "connected"} reduce={!!reduce} />

        {/* dial, mounted on the phone's face */}
        <div
          ref={dialRef}
          className="absolute left-1/2 top-[52%] aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-ink bg-cream shadow-[inset_0_-6px_0_rgb(19_35_58/0.15)]"
        >
          {/* numbers printed on the fixed base, seen through the holes */}
          {DIGITS.map((d) => {
            const a = (holeAngle(d) * Math.PI) / 180;
            return (
              <span
                key={d}
                aria-hidden="true"
                className="absolute grid h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 place-items-center font-display text-[clamp(1rem,4.5vw,1.6rem)] text-ink"
                style={{ left: `${50 + Math.cos(a) * HOLE_R}%`, top: `${50 + Math.sin(a) * HOLE_R}%` }}
              >
                {d}
              </span>
            );
          })}

          {/* rotating finger plate */}
          <motion.div className="absolute inset-[3%] rounded-full" style={{ rotate: rot }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <mask id="holes">
                  <rect width="100" height="100" fill="white" />
                  {DIGITS.map((d) => {
                    const a = (holeAngle(d) * Math.PI) / 180;
                    const r = PLATE_R;
                    return <circle key={d} cx={50 + Math.cos(a) * r} cy={50 + Math.sin(a) * r} r="9.6" fill="black" />;
                  })}
                </mask>
              </defs>
              <circle cx="50" cy="50" r="49" fill="#D9482B" mask="url(#holes)" />
              <circle cx="50" cy="50" r="49" fill="none" stroke="#13233A" strokeWidth="2.4" />
              {DIGITS.map((d) => {
                const a = (holeAngle(d) * Math.PI) / 180;
                const r = PLATE_R;
                return <circle key={d} cx={50 + Math.cos(a) * r} cy={50 + Math.sin(a) * r} r="9.6" fill="none" stroke="#13233A" strokeWidth="2.4" />;
              })}
            </svg>
            {DIGITS.map((d) => {
              const a = (holeAngle(d) * Math.PI) / 180;
              const r = PLATE_R;
              const e = directory.find((x) => x.digit === d);
              return (
                <button
                  key={d}
                  type="button"
                  aria-label={e ? `Dial ${d}: ${e.label}` : `Dial ${d}: not connected`}
                  onPointerDown={(ev) => onPointerDown(ev, d)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      ev.stopPropagation();
                      autoDial(d);
                    }
                  }}
                  className="absolute h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full focus-visible:outline-offset-1 active:cursor-grabbing"
                  style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%` }}
                />
              );
            })}
          </motion.div>

          {/* centre label */}
          <div aria-hidden="true" className="absolute inset-[30%] grid place-items-center rounded-full border-[4px] border-ink bg-paper text-center">
            <span className="px-1 leading-tight">
              <span className="block text-[clamp(8px,2.2vw,11px)] font-bold uppercase tracking-[0.16em] text-ink-soft">Dial</span>
              <span className="block font-display text-[clamp(1rem,4.5vw,1.6rem)] leading-none">1 · 2</span>
            </span>
          </div>

          {/* finger stop */}
          <span
            aria-hidden="true"
            className="absolute h-[16%] w-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-butter"
            style={{
              left: `${50 + Math.cos((STOP * Math.PI) / 180) * 49}%`,
              top: `${50 + Math.sin((STOP * Math.PI) / 180) * 49}%`,
              rotate: `${STOP + 90}deg`,
            }}
          />
        </div>
      </div>

      {/* ---------------- display + directory ---------------- */}
      <div className="space-y-6">
        <div
          role="status"
          aria-live="polite"
          className="min-h-[92px] rounded-xl border-[4px] border-ink bg-ink px-5 py-4 font-mono text-paper shadow-[6px_6px_0_rgb(19_35_58/0.3)]"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-butter">Line {status.kind === "idle" ? "open" : status.kind}</p>
          <p className="mt-1 text-lg">
            {status.kind === "idle" && "Put a finger in a hole and turn it to the stop."}
            {status.kind === "dialling" && `Dialling ${status.digit}…`}
            {status.kind === "ringing" && `Ring ring… connecting you to ${entry?.label}.`}
            {status.kind === "connected" && entry && (
              <>
                Connected.{" "}
                <a href={entry.href} target={entry.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="text-butter underline underline-offset-4">
                  Open {entry.label}
                </a>
              </>
            )}
            {status.kind === "wrong" && `${status.digit} isn't connected. Try 1 or 2.`}
          </p>
        </div>

        <section aria-labelledby="directory-h" className="rounded-xl border-[4px] border-ink bg-cream p-5 shadow-[6px_6px_0_var(--color-ink)]">
          <h2 id="directory-h" className="font-display text-2xl uppercase">Directory</h2>
          <ul className="mt-3 divide-y-2 divide-dashed divide-ink/40">
            {directory.map((e) => (
              <li key={e.digit}>
                <a
                  href={e.href}
                  target={e.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  className="flex min-h-12 items-center gap-4 py-2 hover:text-wood-dark"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-red font-display text-lg text-paper">
                    {e.digit}
                  </span>
                  <span>
                    <span className="block font-bold">{e.label}</span>
                    <span className="block text-sm text-ink-soft">{e.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={muted}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-ink bg-paper px-4 text-sm font-bold"
        >
          <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span> Sound {muted ? "off" : "on"}
        </button>
      </div>
    </div>
  );
}

/** Comic rotary phone body. The handset lifts when a call connects. */
function PhoneBody({ lifted, reduce }: { lifted: boolean; reduce: boolean }) {
  return (
    <svg viewBox="0 0 520 470" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <pattern id="phone-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="#13233A" opacity=".2" />
        </pattern>
      </defs>
      {/* shadow */}
      <ellipse cx="270" cy="452" rx="230" ry="14" fill="#13233A" opacity=".2" />
      {/* body */}
      <path d="M70 440 L110 150 Q118 112 160 112 H360 Q402 112 410 150 L450 440 Z" fill="#D9482B" stroke="#13233A" strokeWidth="7" strokeLinejoin="round" />
      <path d="M70 440 L110 150 Q118 112 160 112 H360 Q402 112 410 150 L450 440 Z" fill="url(#phone-dots)" />
      <rect x="54" y="424" width="412" height="26" rx="10" fill="#8A3F1C" stroke="#13233A" strokeWidth="7" />
      {/* cradle prongs */}
      <path d="M128 126 V92 M392 126 V92" stroke="#13233A" strokeWidth="14" strokeLinecap="round" />
      {/* handset */}
      <motion.g
        animate={lifted && !reduce ? { y: -46, rotate: -8 } : { y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        style={{ transformOrigin: "260px 80px" }}
      >
        <path
          d="M40 98 Q40 40 100 40 H420 Q480 40 480 98 Q480 120 456 120 H404 Q388 120 384 100 Q380 84 360 84 H160 Q140 84 136 100 Q132 120 116 120 H64 Q40 120 40 98 Z"
          fill="#D9482B"
          stroke="#13233A"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path d="M70 62 Q110 52 160 58" stroke="#FFF6E6" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".7" />
      </motion.g>
      {/* coiled cord */}
      <path
        d="M66 400 q-22 -6 -16 -28 q22 -6 16 -28 q-22 -6 -16 -28 q22 -6 16 -28 q-22 -6 -16 -28 q22 -6 16 -28 q-22 -6 -8 -40"
        stroke="#13233A"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
