/**
 * One drawn landmark per chapter of the journey, in the street's comic style.
 * They are illustrations only; the stop's facts live in lib/site.ts.
 */
import type { JourneyStop } from "@/lib/site";

const INK = "#3b2b24"; // warm brown line, shared by every drawn object
const S = 3.5;

function College() {
  return (
    <svg viewBox="0 0 300 260" className="h-full w-auto overflow-visible" aria-hidden="true">
      <path d="M10 90 L150 20 L290 90 Z" fill="#FFE3B3" stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <circle cx="150" cy="66" r="14" fill="#FFC973" stroke={INK} strokeWidth="4" />
      <rect x="20" y="90" width="260" height="20" fill="#FFF6E6" stroke={INK} strokeWidth={S} />
      {[40, 90, 140, 190, 240].map((x) => (
        <rect key={x} x={x} y="110" width="22" height="120" fill="#FFF6E6" stroke={INK} strokeWidth="4" />
      ))}
      <rect x="10" y="230" width="280" height="22" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <path d="M150 20 V-20" stroke={INK} strokeWidth="4" />
      <path d="M150 -20 L186 -10 L150 0 Z" fill="#D9482B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function Office() {
  return (
    <svg viewBox="0 0 200 300" className="h-full w-auto overflow-visible" aria-hidden="true">
      <rect x="30" y="20" width="140" height="272" fill="#006BB9" stroke={INK} strokeWidth={S} />
      {Array.from({ length: 9 }, (_, r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={44 + c * 40} y={34 + r * 28} width="30" height="18" fill={r % 3 === c ? "#FFC973" : "#30A0E0"} stroke={INK} strokeWidth="2.5" />),
      )}
      <rect x="80" y="262" width="40" height="30" fill="#FFF6E6" stroke={INK} strokeWidth="4" />
      <rect x="22" y="8" width="156" height="16" fill="#13233A" />
    </svg>
  );
}

function Books() {
  return (
    <svg viewBox="0 0 260 240" className="h-full w-auto overflow-visible" aria-hidden="true">
      {[
        ["#D9482B", 20, 200, 220],
        ["#006BB9", 34, 166, 196],
        ["#FFC973", 14, 132, 210],
        ["#4E9A4B", 40, 98, 180],
        ["#E8588A", 26, 64, 200],
      ].map(([c, x, y, w], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height="34" rx="4" fill={c as string} stroke={INK} strokeWidth="4" />
          <rect x={(x as number) + 14} y={(y as number) + 10} width={(w as number) * 0.4} height="6" fill="#FFF6E6" opacity=".8" />
        </g>
      ))}
      {/* thought bubble: psychology */}
      <circle cx="150" cy="30" r="30" fill="#FFF6E6" stroke={INK} strokeWidth="4" />
      <circle cx="108" cy="54" r="8" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
      <text x="150" y="42" textAnchor="middle" fontSize="34" fontWeight="900" fill={INK}>?</text>
    </svg>
  );
}

function Billboard() {
  return (
    <svg viewBox="0 0 300 280" className="h-full w-auto overflow-visible" aria-hidden="true">
      <path d="M70 160 V280 M230 160 V280" stroke={INK} strokeWidth="12" />
      <rect x="10" y="20" width="280" height="150" fill="#FFF6E6" stroke={INK} strokeWidth={S} />
      <rect x="22" y="32" width="256" height="126" fill="#E8588A" stroke={INK} strokeWidth="3" />
      <path d="M60 80 V112 H84 L150 140 V52 L84 80 Z" fill="#FFC973" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M170 70 Q190 96 170 122 M190 58 Q220 96 190 134" stroke="#FFF6E6" strokeWidth="6" fill="none" strokeLinecap="round" />
      <text x="244" y="104" textAnchor="middle" fontSize="30" fontWeight="900" fill="#FFF6E6">GO!</text>
      {[40, 110, 180, 250].map((x) => (
        <path key={x} d={`M${x} 20 l10 -16 l10 16`} fill="#13233A" />
      ))}
    </svg>
  );
}

function Desk() {
  return (
    <svg viewBox="0 0 280 240" className="h-full w-auto overflow-visible" aria-hidden="true">
      {/* drafting desk with laptop, pencil cup and sketches */}
      <rect x="20" y="130" width="240" height="20" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <path d="M40 150 L30 240 M240 150 L250 240" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <path d="M80 130 L96 70 H190 L200 130 Z" fill="#13233A" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M102 78 H184 L192 122 H92 Z" fill="#30A0E0" />
      <rect x="112" y="88" width="30" height="20" fill="#FFF6E6" stroke={INK} strokeWidth="2" />
      <rect x="150" y="88" width="30" height="8" fill="#FFC973" stroke={INK} strokeWidth="2" />
      <rect x="150" y="100" width="22" height="8" fill="#E8588A" stroke={INK} strokeWidth="2" />
      <path d="M216 130 h26 l-4 -30 h-18 z" fill="#FFE3B3" stroke={INK} strokeWidth="3" />
      <path d="M222 100 l-6 -36 M230 100 l2 -40 M236 100 l10 -32" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M222 100 l-6 -36" stroke="#FFC973" strokeWidth="3" strokeLinecap="round" />
      <rect x="28" y="96" width="44" height="34" fill="#FFF6E6" stroke={INK} strokeWidth="3" transform="rotate(-8 50 113)" />
      <path d="M36 112 q8 -8 16 0 t16 0" stroke="#D9482B" strokeWidth="2.5" fill="none" transform="rotate(-8 50 113)" />
    </svg>
  );
}

function FerrisWheel() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-auto overflow-visible" aria-hidden="true">
      <g className="ferris-spin" style={{ transformOrigin: "150px 130px", transformBox: "view-box" }}>
        <circle cx="150" cy="130" r="110" fill="none" stroke={INK} strokeWidth={S} />
        <circle cx="150" cy="130" r="96" fill="none" stroke="#D9482B" strokeWidth="4" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1="150" y1="130" x2={150 + Math.cos(a) * 110} y2={130 + Math.sin(a) * 110} stroke={INK} strokeWidth="3" />;
        })}
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <rect
            key={i}
            x={150 + Math.cos(a) * 110 - 14}
            y={130 + Math.sin(a) * 110 - 4}
            width="28"
            height="22"
            rx="5"
            fill={["#FFC973", "#30A0E0", "#E8588A", "#4E9A4B"][i % 4]}
            stroke={INK}
            strokeWidth="3"
          />
        );
      })}
      <circle cx="150" cy="130" r="14" fill="#FFC973" stroke={INK} strokeWidth="4" />
      <path d="M150 130 L90 296 M150 130 L210 296" stroke={INK} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

function Campus() {
  return (
    <svg viewBox="0 0 340 260" className="h-full w-auto overflow-visible" aria-hidden="true">
      <path d="M0 260 Q80 200 170 236 Q250 196 340 240 V260 Z" fill="#FFC973" stroke={INK} strokeWidth="4" />
      {/* fort-like campus block, sandstone */}
      <rect x="60" y="100" width="220" height="140" fill="#E8A866" stroke={INK} strokeWidth={S} />
      {[60, 96, 132, 168, 204, 240].map((x) => (
        <rect key={x} x={x} y="84" width="22" height="18" fill="#E8A866" stroke={INK} strokeWidth="4" />
      ))}
      {[84, 132, 180, 228].map((x) => (
        <path key={x} d={`M${x} 200 V160 Q${x + 14} 140 ${x + 28} 160 V200 Z`} fill="#13233A" />
      ))}
      <path d="M170 84 V20" stroke={INK} strokeWidth="5" />
      <path d="M170 20 L216 32 L170 44 Z" fill="#D9482B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <text x="170" y="236" textAnchor="middle" fontSize="20" fontWeight="900" letterSpacing="3" fill={INK}>YOU ARE HERE</text>
    </svg>
  );
}

export default function Landmark({ icon }: { icon: JourneyStop["icon"] }) {
  switch (icon) {
    case "college":
      return <College />;
    case "office":
      return <Office />;
    case "book":
      return <Books />;
    case "megaphone":
      return <Billboard />;
    case "pencil":
      return <Desk />;
    case "rocket":
      return <FerrisWheel />;
    case "flag":
      return <Campus />;
  }
}
