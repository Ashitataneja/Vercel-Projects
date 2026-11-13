"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { directory } from "@/lib/site";

/*
 * A rotary telephone with two numbers on its dial.
 * Angles in degrees, 0 = 3 o'clock, clockwise. The finger stop sits at STOP;
 * hole d sits d*STEP counter-clockwise from it, so dialling d means turning
 * the finger wheel d*STEP clockwise until the hole meets the stop.
 */
const STOP = 58;
const STEP = 62;
const DIGITS: number[] = directory.map((d) => d.digit);
const holeAngle = (d: number) => STOP - d * STEP;
const HOLE_R = 34; // % of the dial's width, from its centre
const rad = (a: number) => (a * Math.PI) / 180;
const LINE = "#3b2b24";

type Status = { kind: "idle" } | { kind: "dialling" | "ringing" | "connected"; digit: number };

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
        /* no audio: stay silent */
      }
    },
    [muted],
  );
}

export default function RotaryPhone({ layout }: { layout: (phone: React.ReactNode, legend: React.ReactNode) => React.ReactNode }) {
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

  const connect = useCallback((digit: number) => {
    const entry = directory.find((e) => e.digit === digit);
    if (!entry) return;
    setStatus({ kind: "ringing", digit });
    window.setTimeout(() => {
      setStatus({ kind: "connected", digit });
      if (entry.href.startsWith("mailto:")) window.location.href = entry.href;
      else window.open(entry.href, "_blank", "noopener");
    }, 900);
  }, []);

  const release = useCallback(
    (digit: number, completed: boolean) => {
      const from = rot.get();
      if (!completed) {
        animate(rot, 0, { type: "spring", stiffness: 260, damping: 26, onComplete: () => (busy.current = false) });
        return;
      }
      // The governor lets the wheel return at an even pace, ticking once per number.
      let lastTick = Math.floor(from / (STEP / 3));
      animate(rot, 0, {
        duration: reduce ? 0.01 : 0.25 + digit * 0.35,
        ease: "linear",
        onUpdate: (v) => {
          const t = Math.floor(v / (STEP / 3));
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
      animate(rot, digit * STEP, {
        duration: 0.35 + digit * 0.15,
        ease: [0.3, 0, 0.4, 1],
        onComplete: () => {
          click("stop");
          window.setTimeout(() => release(digit, true), 140);
        },
      });
    },
    [click, connect, reduce, release, rot],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input, textarea, [contenteditable]")) return;
      const n = Number(e.key);
      if (DIGITS.includes(n)) autoDial(n);
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
    const max = d.digit * STEP;
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
      busy.current = false;
      autoDial(d.digit);
      return;
    }
    release(d.digit, d.hit);
    if (!d.hit) setStatus({ kind: "idle" });
  }

  const entry = status.kind !== "idle" ? directory.find((x) => x.digit === status.digit) : undefined;
  const lifted = status.kind === "ringing" || status.kind === "connected";

  const phone = (
      <div className="relative w-full [container-type:inline-size]">
        <PhoneBody lifted={lifted} reduce={!!reduce} />

        <div
          ref={dialRef}
          className="absolute left-1/2 top-[58%] aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle at 35% 30%, #fff, #d9d4cc 45%, #9d968c 100%)", boxShadow: `0 0 0 3px ${LINE}, inset 0 -6px 12px rgb(0 0 0 / 0.25)` }}
        >
          {/* number card under the finger wheel */}
          <div className="absolute inset-[9%] rounded-full bg-[#f6eedc] shadow-[inset_0_2px_6px_rgb(0_0_0/0.25)]" />
          {DIGITS.map((d) => {
            const a = rad(holeAngle(d));
            return (
              <span
                key={d}
                aria-hidden="true"
                className="absolute grid h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 place-items-center font-display text-[clamp(1.2rem,5vw,2rem)] text-[#3b2b24]"
                style={{ left: `${50 + Math.cos(a) * HOLE_R}%`, top: `${50 + Math.sin(a) * HOLE_R}%` }}
              >
                {d}
              </span>
            );
          })}

          {/* finger wheel: tinted glass with one hole per destination */}
          <motion.div className="absolute inset-[6%] rounded-full" style={{ rotate: rot }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <mask id="dial-holes">
                  <rect width="100" height="100" fill="white" />
                  {DIGITS.map((d) => {
                    const a = rad(holeAngle(d));
                    const r = HOLE_R / 0.88;
                    return <circle key={d} cx={50 + Math.cos(a) * r} cy={50 + Math.sin(a) * r} r="11.5" fill="black" />;
                  })}
                  <circle cx="50" cy="50" r="22" fill="black" />
                </mask>
                <radialGradient id="glass" cx="35%" cy="30%" r="80%">
                  <stop offset="0" stopColor="#5a4038" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#1e1714" stopOpacity="0.88" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="49" fill="url(#glass)" mask="url(#dial-holes)" />
              <circle cx="50" cy="50" r="49" fill="none" stroke={LINE} strokeWidth="1.5" />
              {DIGITS.map((d) => {
                const a = rad(holeAngle(d));
                const r = HOLE_R / 0.88;
                return <circle key={d} cx={50 + Math.cos(a) * r} cy={50 + Math.sin(a) * r} r="11.5" fill="none" stroke="#c9c2b8" strokeWidth="1.6" />;
              })}
              <path d="M18 30 Q30 14 50 12" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            {DIGITS.map((d) => {
              const a = rad(holeAngle(d));
              const r = HOLE_R / 0.88;
              const e = directory.find((x) => x.digit === d)!;
              return (
                <button
                  key={d}
                  type="button"
                  aria-label={`Dial ${d}: ${e.label}`}
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
                  className="absolute h-[28%] min-h-11 w-[28%] min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full focus-visible:outline-offset-1 active:cursor-grabbing"
                  style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%` }}
                />
              );
            })}
          </motion.div>

          {/* centre card */}
          <div aria-hidden="true" className="absolute inset-[30%] grid place-items-center rounded-full border-2 border-[#3b2b24] bg-[#f6eedc] text-center shadow-[inset_0_2px_4px_rgb(0_0_0/0.15)]">
            <span className="font-hand text-[clamp(1rem,3.6vw,1.5rem)] leading-tight text-ink">
              Ashita
            </span>
          </div>

          {/* what each hole calls: tags just outside the rim */}
          {DIGITS.map((d) => {
            const a = rad(holeAngle(d));
            const e = directory.find((x) => x.digit === d)!;
            return (
              <span
                key={`tag-${d}`}
                aria-hidden="true"
                className="pointer-events-none absolute w-max -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6eedc] px-2 py-0.5 text-[clamp(10px,2.4cqw,14px)] font-bold text-[#3b2b24] shadow-[0_2px_6px_rgb(0_0_0/0.25)]"
                style={{ left: `${50 + Math.cos(a) * 64}%`, top: `${50 + Math.sin(a) * 64}%` }}
              >
                {d} · {e.label}
              </span>
            );
          })}

          {/* chrome finger stop */}
          <span
            aria-hidden="true"
            className="absolute h-[16%] w-[4.5%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${50 + Math.cos(rad(STOP)) * 47}%`,
              top: `${50 + Math.sin(rad(STOP)) * 47}%`,
              rotate: `${STOP + 90}deg`,
              background: "linear-gradient(90deg, #8d877e, #f4f1ea, #8d877e)",
              boxShadow: `0 0 0 2px ${LINE}`,
            }}
          />
        </div>
      </div>
  );
  // What's on the line, and the same numbers as plain links.
  const legend = (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-live="polite">
        {status.kind === "idle" ? (
          directory.map((e) => (
            <a
              key={e.digit}
              href={e.href}
              target={e.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f6eedc] px-4 text-sm font-bold text-[#3b2b24] shadow-[0_6px_16px_rgb(0_0_0/0.3)]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#b83a22] font-display text-sm text-[#f6eedc]">{e.digit}</span>
              {e.label}
            </a>
          ))
        ) : (
          <p className="min-h-11 rounded-full bg-[#1c1b1d]/90 px-5 py-2.5 text-sm font-semibold text-[#f6eedc]">
            {status.kind === "dialling" && `Dialling ${status.digit}…`}
            {status.kind === "ringing" && `Ringing ${entry?.label}…`}
            {status.kind === "connected" && entry && (
              <>
                Connected ·{" "}
                <a href={entry.href} target={entry.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="text-butter underline underline-offset-4">
                  open {entry.label}
                </a>
              </>
            )}
          </p>
        )}
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? "Turn dial sound on" : "Turn dial sound off"}
          className="grid h-11 w-11 place-items-center rounded-full bg-[#f6eedc] text-base shadow-[0_6px_16px_rgb(0_0_0/0.3)]"
        >
          <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
        </button>
      </div>
  );
  return <>{layout(phone, legend)}</>;
}

/** The telephone body, with a coiled cord that runs from the base into the handset. */
function PhoneBody({ lifted, reduce }: { lifted: boolean; reduce: boolean }) {
  const up = lifted && !reduce;
  // Cord: plugs into the base's left side and into the handset's left end; stretches when lifted.
  const coil = (x0: number, y0: number, x1: number, y1: number) => {
    const n = 9;
    let d = `M${x0} ${y0}`;
    for (let i = 1; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      d += ` Q${x + (i % 2 ? -20 : 20)} ${y - (y1 - y0) / n / 2} ${x} ${y}`;
    }
    return d;
  };
  const cordRest = coil(78, 330, 64, 112);
  const cordUp = coil(78, 330, 66, 88);
  return (
    <svg viewBox="0 0 520 470" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="body-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9563a" />
          <stop offset="0.55" stopColor="#b83a22" />
          <stop offset="1" stopColor="#7e2414" />
        </linearGradient>
        <linearGradient id="base-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a2a1c" />
          <stop offset="1" stopColor="#2e1a14" />
        </linearGradient>
      </defs>
      <ellipse cx="265" cy="452" rx="235" ry="14" fill="#000" opacity=".22" />
      {/* base plate + body */}
      <rect x="50" y="420" width="420" height="28" rx="12" fill="url(#base-dark)" stroke={LINE} strokeWidth="4" />
      <path d="M72 424 L112 168 Q120 126 166 126 H354 Q400 126 408 168 L448 424 Z" fill="url(#body-red)" stroke={LINE} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M126 170 Q132 142 166 142 H250" stroke="#fff" strokeOpacity=".35" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* cradle */}
      <path d="M150 132 Q150 104 128 100 M370 132 Q370 104 392 100" stroke={LINE} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M150 132 Q150 104 128 100 M370 132 Q370 104 392 100" stroke="#a7321d" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* cord socket on the base */}
      <rect x="66" y="322" width="22" height="16" rx="4" fill="#2e1a14" stroke={LINE} strokeWidth="3" />
      {/* coiled cord, attached at both ends */}
      <motion.path
        d={cordRest}
        animate={{ d: up ? cordUp : cordRest }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        stroke="#2e1a14"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* handset */}
      <motion.g animate={up ? { y: -46, rotate: -6 } : { y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} style={{ transformOrigin: "260px 90px" }}>
        <path
          d="M44 108 Q44 52 104 52 H416 Q476 52 476 108 Q476 132 452 132 H404 Q388 132 384 112 Q380 96 360 96 H160 Q140 96 136 112 Q132 132 116 132 H68 Q44 132 44 108 Z"
          fill="url(#body-red)"
          stroke={LINE}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path d="M72 72 Q110 62 170 66" stroke="#fff" strokeOpacity=".4" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* where the cord enters the handset */}
        <rect x="56" y="106" width="16" height="12" rx="3" fill="#2e1a14" stroke={LINE} strokeWidth="2.5" />
      </motion.g>
    </svg>
  );
}
