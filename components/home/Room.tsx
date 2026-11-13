/**
 * The living room around the TV. Pop-art comic style: thick ink outlines,
 * flat fills, halftone dots. Purely decorative, so everything is aria-hidden.
 */
const INK = "#13233A";
const S = 5; // outline weight

export function Window() {
  return (
    <svg viewBox="0 0 220 620" className="h-full w-auto" aria-hidden="true" focusable="false">
      {/* glass */}
      <rect x="-20" y="40" width="150" height="400" fill="#FFF6E6" stroke={INK} strokeWidth={S} />
      <line x1="-20" y1="240" x2="130" y2="240" stroke={INK} strokeWidth={S} />
      <rect x="-20" y="440" width="170" height="22" fill="#FFC973" stroke={INK} strokeWidth={S} />
      {/* curtain stripes */}
      {[
        ["#FFC973", 120],
        ["#D9482B", 142],
        ["#006BB9", 164],
        ["#30A0E0", 186],
      ].map(([c, x]) => (
        <rect key={x} x={x as number} y="0" width="22" height="620" fill={c as string} stroke={INK} strokeWidth="3" />
      ))}
      <rect x="110" y="0" width="110" height="26" fill="#13233A" />
    </svg>
  );
}

export function Clock() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true" focusable="false">
      <circle cx="64" cy="64" r="52" fill="#13233A" opacity=".18" />
      <circle cx="60" cy="60" r="52" fill="#D9482B" stroke={INK} strokeWidth={S} />
      <circle cx="60" cy="60" r="40" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={60 + Math.sin(a) * 33}
            y1={60 - Math.cos(a) * 33}
            x2={60 + Math.sin(a) * 37}
            y2={60 - Math.cos(a) * 37}
            stroke={INK}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      <line x1="60" y1="60" x2="78" y2="48" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <g className="clock-hand">
        <line x1="60" y1="60" x2="60" y2="26" stroke="#D9482B" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="4" fill={INK} />
    </svg>
  );
}

function Flower({ x, y, r, petal = "#D9482B" }: { x: number; y: number; r: number; petal?: string }) {
  return (
    <g stroke={INK} strokeWidth="3">
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <circle key={i} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r} r={r * 0.75} fill={petal} />;
      })}
      <circle cx={x} cy={y} r={r * 0.6} fill="#FFC973" />
    </g>
  );
}

export function FlowerPoster() {
  return (
    <svg viewBox="0 0 200 230" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect x="10" y="10" width="190" height="220" fill="#13233A" opacity=".18" />
      <rect x="2" y="2" width="190" height="220" fill="#FFF6E6" stroke={INK} strokeWidth={S} />
      <rect x="20" y="20" width="154" height="184" fill="#006BB9" stroke={INK} strokeWidth="3" />
      <path d="M20 140 Q80 110 174 150 V204 H20Z" fill="#4E9A4B" stroke={INK} strokeWidth="3" />
      <path d="M20 20 H90 Q60 60 20 70Z" fill="#FFC973" stroke={INK} strokeWidth="3" />
      <Flower x={70} y={110} r={16} />
      <Flower x={128} y={74} r={13} />
      <Flower x={136} y={150} r={11} petal="#FFC973" />
    </svg>
  );
}

export function SmallFrame() {
  return (
    <svg viewBox="0 0 120 160" className="h-full w-full" aria-hidden="true" focusable="false">
      <path d="M60 4 L22 34 M60 4 L98 34" stroke={INK} strokeWidth="3" fill="none" />
      <circle cx="60" cy="6" r="5" fill="#006BB9" stroke={INK} strokeWidth="3" />
      <rect x="8" y="34" width="104" height="122" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <rect x="22" y="48" width="76" height="94" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
      <path d="M60 140 V96" stroke="#2F6B33" strokeWidth="4" />
      <path d="M60 120 Q42 112 40 100 Q56 104 60 120Z M60 118 Q78 110 80 98 Q64 102 60 118Z" fill="#4E9A4B" stroke={INK} strokeWidth="2.5" />
      <Flower x={60} y={80} r={10} />
    </svg>
  );
}

function Books({ x, y, colors }: { x: number; y: number; colors: string[] }) {
  let cx = x;
  return (
    <g stroke={INK} strokeWidth="3">
      {colors.map((c, i) => {
        const w = 14 + ((i * 7) % 9);
        const h = 64 + ((i * 13) % 22);
        const r = <rect key={i} x={cx} y={y - h} width={w} height={h} fill={c} />;
        cx += w;
        return r;
      })}
    </g>
  );
}

function Plant({ x, y, pot = "#FFC973" }: { x: number; y: number; pot?: string }) {
  return (
    <g stroke={INK} strokeWidth="3">
      {[-38, -18, 0, 18, 38].map((a, i) => (
        <path
          key={i}
          d={`M${x} ${y - 30} q${a * 0.6} -${40 + (i % 2) * 14} ${a} -${56 + (i % 2) * 10} q${-a * 0.1} ${30} ${-a} ${56 + (i % 2) * 10}Z`}
          fill={i % 2 ? "#2F6B33" : "#4E9A4B"}
        />
      ))}
      <path d={`M${x - 26} ${y - 34} H${x + 26} L${x + 20} ${y} H${x - 20}Z`} fill={pot} />
      <rect x={x - 30} y={y - 40} width="60" height="10" fill={pot} />
    </g>
  );
}

export function Bookshelf() {
  const shelfY = [140, 290, 440, 590];
  return (
    <svg viewBox="0 0 300 700" className="h-full w-auto" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="300" height="700" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <rect x="22" y="22" width="300" height="660" fill="#13233A" />
      {shelfY.map((y) => (
        <rect key={y} x="22" y={y} width="300" height="16" fill="#C8662E" stroke={INK} strokeWidth="3" />
      ))}
      <Books x={30} y={140} colors={["#D9482B", "#FFC973", "#006BB9", "#30A0E0", "#D9482B", "#FFE3B3"]} />
      <Plant x={230} y={140} />
      <Plant x={90} y={290} pot="#D9482B" />
      <Books x={150} y={290} colors={["#006BB9", "#D9482B", "#FFC973", "#30A0E0", "#D9482B", "#4E9A4B"]} />
      <Books x={30} y={440} colors={["#30A0E0", "#D9482B", "#FFC973", "#006BB9", "#FFE3B3", "#D9482B", "#006BB9", "#FFC973", "#D9482B"]} />
      <rect x="40" y="540" width="200" height="50" fill="#FFC973" stroke={INK} strokeWidth="3" />
      <rect x="130" y="556" width="18" height="22" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
      <g fill="#FFF6E6" stroke={INK} strokeWidth="2.5">
        {[60, 82, 104, 126, 148].map((cx, i) => (
          <circle key={cx} cx={cx} cy={530 - (i % 2) * 8} r="12" />
        ))}
      </g>
    </svg>
  );
}

export function SideTable() {
  return (
    <svg viewBox="0 0 260 360" className="h-full w-auto" aria-hidden="true" focusable="false">
      <Plant x={150} y={120} pot="#D9482B" />
      <g stroke={INK} strokeWidth="3">
        <rect x="20" y="104" width="110" height="16" fill="#006BB9" />
        <rect x="28" y="90" width="96" height="14" fill="#D9482B" />
        <rect x="36" y="76" width="80" height="14" fill="#FFC973" />
      </g>
      <rect x="0" y="120" width="250" height="26" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <path d="M22 146 L12 350 M228 146 L238 350 M52 146 L56 300 M198 146 L194 300" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d="M22 146 L12 350 M228 146 L238 350" stroke="#C8662E" strokeWidth="8" strokeLinecap="round" />
      {/* basket */}
      <path d="M40 250 H210 L196 346 H54Z" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <path d="M48 270 H204 M52 296 H200 M56 322 H196" stroke={INK} strokeWidth="2.5" strokeDasharray="8 6" />
      <rect x="70" y="228" width="44" height="30" fill="#006BB9" stroke={INK} strokeWidth="3" transform="rotate(-10 92 243)" />
      <rect x="120" y="226" width="50" height="32" fill="#30A0E0" stroke={INK} strokeWidth="3" transform="rotate(8 145 242)" />
    </svg>
  );
}

export function Armchair() {
  return (
    <svg viewBox="0 0 520 420" className="h-full w-auto" aria-hidden="true" focusable="false">
      {/* back */}
      <path d="M150 420 V120 Q150 40 240 36 H470 Q530 40 530 110 V420Z" fill="#4E9A4B" stroke={INK} strokeWidth="6" />
      <path d="M240 60 H460 Q500 64 500 110 V420 H250Z" fill="#13233A" />
      {/* arm */}
      <path d="M20 420 V260 Q20 196 96 196 H170 Q230 200 230 260 V420Z" fill="#4E9A4B" stroke={INK} strokeWidth="6" />
      <path d="M40 250 Q60 218 110 216" stroke="#2F6B33" strokeWidth="10" strokeLinecap="round" fill="none" />
      <rect x="0" y="0" width="520" height="420" fill="url(#chair-dots)" />
      <defs>
        <pattern id="chair-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#13233A" opacity=".22" />
        </pattern>
      </defs>
    </svg>
  );
}

export function Rug() {
  const colors = ["#006BB9", "#FFC973", "#D9482B", "#30A0E0", "#FFF6E6", "#D9482B", "#FFC973", "#006BB9"];
  return (
    <svg viewBox="0 0 640 120" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M60 0 H600 L640 120 H0Z" fill="#FFF6E6" stroke={INK} strokeWidth={S} />
      {colors.map((c, i) => {
        const t0 = i / colors.length;
        const t1 = (i + 1) / colors.length;
        const x = (t: number, top: boolean) => (top ? 60 + t * 540 : t * 640);
        return (
          <path
            key={i}
            d={`M${x(t0, true)} 0 H${x(t1, true)} L${x(t1, false)} 120 H${x(t0, false)}Z`}
            fill={c}
            stroke={INK}
            strokeWidth="2.5"
          />
        );
      })}
    </svg>
  );
}

export function Cabinet() {
  return (
    <svg viewBox="0 0 560 170" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="560" height="26" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <rect x="18" y="26" width="524" height="122" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <rect x="18" y="26" width="524" height="122" fill="url(#cab-dots)" />
      {/* drawers */}
      <rect x="34" y="40" width="210" height="46" fill="#C8662E" stroke={INK} strokeWidth="4" />
      <rect x="34" y="92" width="210" height="46" fill="#C8662E" stroke={INK} strokeWidth="4" />
      <rect x="124" y="58" width="30" height="10" rx="3" fill="#8A3F1C" stroke={INK} strokeWidth="3" />
      <rect x="124" y="110" width="30" height="10" rx="3" fill="#8A3F1C" stroke={INK} strokeWidth="3" />
      {/* open shelf with VCR */}
      <rect x="262" y="40" width="264" height="98" fill="#13233A" />
      <rect x="282" y="52" width="170" height="14" fill="#FFC973" stroke={INK} strokeWidth="3" />
      <rect x="282" y="40" width="150" height="12" fill="#006BB9" stroke={INK} strokeWidth="3" />
      <rect x="282" y="98" width="200" height="36" fill="#006BB9" stroke={INK} strokeWidth="3" />
      <rect x="300" y="108" width="70" height="14" fill="#13233A" />
      <circle cx="440" cy="116" r="7" fill="#FFF6E6" stroke={INK} strokeWidth="2.5" />
      <circle cx="462" cy="116" r="7" fill="#FFF6E6" stroke={INK} strokeWidth="2.5" />
      {/* legs */}
      <path d="M40 148 V168 M520 148 V168" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <defs>
        <pattern id="cab-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="#13233A" opacity=".2" />
        </pattern>
      </defs>
    </svg>
  );
}
