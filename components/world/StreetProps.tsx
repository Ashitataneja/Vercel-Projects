/**
 * Things along Ashita's street, drawn in the same pop-art comic style as the
 * painted Delhi scenes: warm brown line, palette fills, soft painted shading.
 * Each takes an `active` flag for its "opening" moment (shutter rolls up,
 * booth door swings, TV flickers, journal lifts).
 */
const INK = "#3b2b24"; // warm brown line, shared by every drawn object
const S = 3.5;

/** Soft painted shading (light from the top left), shared by every drawn object. */
function Dots({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
      <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
      <stop offset="1" stopColor={INK} stopOpacity="0.28" />
    </linearGradient>
  );
}

/* ---------------- Work: the box-office kiosk ---------------- */
export function Kiosk({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 260 330" className="h-full w-auto overflow-visible" aria-hidden="true">
      <defs>
        <Dots id="kiosk-dots" />
        <clipPath id="kiosk-window">
          <rect x="40" y="130" width="180" height="110" />
        </clipPath>
      </defs>
      {/* sign */}
      <rect x="30" y="8" width="200" height="44" rx="6" fill={INK} stroke={INK} strokeWidth={S} />
      <text x="130" y="40" textAnchor="middle" fontSize="26" fontWeight="900" letterSpacing="3" fill="#FFC973" fontFamily="Anton SC, Impact, sans-serif">
        BOX OFFICE
      </text>
      {[44, 70, 96, 122, 148, 174, 200, 216].map((x, i) => (
        <circle key={x} cx={x} cy="62" r="4" fill={i % 2 ? "#FFC973" : "#FFF6E6"} stroke={INK} strokeWidth="2" />
      ))}
      {/* awning */}
      <path d="M10 72 H250 L236 116 H24 Z" fill="#FFF6E6" stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${24 + i * 48} 72 H${48 + i * 48} L${46 + i * 46} 116 H${26 + i * 46} Z`} fill="#D9482B" />
      ))}
      <path d="M24 116 Q36 128 48 116 Q60 128 72 116 Q84 128 96 116 Q108 128 120 116 Q132 128 144 116 Q156 128 168 116 Q180 128 192 116 Q204 128 216 116 Q228 128 236 116" fill="#FFF6E6" stroke={INK} strokeWidth="4" />
      {/* booth body */}
      <rect x="22" y="120" width="216" height="210" fill="#006BB9" stroke={INK} strokeWidth={S} />
      <rect x="22" y="120" width="216" height="210" fill="url(#kiosk-dots)" />
      {/* window: tickets inside, shutter on top */}
      <rect x="40" y="130" width="180" height="110" fill="#FFF6E6" stroke={INK} strokeWidth="4" />
      <g clipPath="url(#kiosk-window)">
        <g transform="translate(130 196)">
          {[-24, -8, 8, 24].map((r, i) => (
            <g key={r} transform={`rotate(${r}) translate(${i * 4 - 6} -22)`}>
              <rect x="-34" y="-16" width="68" height="34" rx="4" fill={["#FFC973", "#FFE3B3", "#30A0E0", "#FFF6E6"][i]} stroke={INK} strokeWidth="3" />
              <path d="M16 -16 V18" stroke={INK} strokeWidth="2" strokeDasharray="3 3" />
            </g>
          ))}
        </g>
        {/* roller shutter */}
        <g style={{ transform: active ? "translateY(-112px)" : "translateY(0)", transition: "transform .45s cubic-bezier(.5,0,.3,1)" }}>
          <rect x="40" y="130" width="180" height="110" fill="#8A3F1C" />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1="40" x2="220" y1={140 + i * 10} y2={140 + i * 10} stroke={INK} strokeWidth="2.5" />
          ))}
          <rect x="116" y="228" width="28" height="8" rx="3" fill="#FFC973" stroke={INK} strokeWidth="2" />
        </g>
      </g>
      <rect x="40" y="130" width="180" height="110" fill="none" stroke={INK} strokeWidth="4" />
      {/* counter */}
      <rect x="30" y="240" width="200" height="16" fill="#C8662E" stroke={INK} strokeWidth="4" />
      <text x="130" y="292" textAnchor="middle" fontSize="18" fontWeight="800" letterSpacing="2" fill="#FFF6E6">ADMIT ONE</text>
      <rect x="14" y="324" width="232" height="10" fill={INK} />
    </svg>
  );
}

/* ---------------- About: crossroads signpost (the signboards themselves are HTML links) ---------------- */
export function Crossroads() {
  return (
    <svg viewBox="0 0 300 330" className="h-full w-auto overflow-visible" aria-hidden="true">
      {/* side road curving off into the distance */}
      <path d="M90 330 Q140 250 210 214 Q250 196 300 190 V206 Q260 210 228 226 Q170 258 150 330 Z" fill="#FFE3B3" stroke={INK} strokeWidth="4" />
      <path d="M118 330 Q160 260 230 220" stroke={INK} strokeWidth="3" strokeDasharray="10 10" fill="none" opacity=".6" />
      {/* tree */}
      <rect x="230" y="120" width="16" height="80" fill="#8A3F1C" stroke={INK} strokeWidth="4" />
      <circle cx="238" cy="96" r="44" fill="#4E9A4B" stroke={INK} strokeWidth={S} />
      <circle cx="220" cy="86" r="6" fill="#D9482B" stroke={INK} strokeWidth="2" />
      <circle cx="256" cy="108" r="6" fill="#D9482B" stroke={INK} strokeWidth="2" />
      {/* post */}
      <rect x="62" y="30" width="16" height="300" fill="#C8662E" stroke={INK} strokeWidth={S} />
      <circle cx="70" cy="26" r="10" fill="#FFC973" stroke={INK} strokeWidth="4" />
    </svg>
  );
}

/* ---------------- Blog: bench under a lamp with the journal on it ---------------- */
export function Bench({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 320 330" className="h-full w-auto overflow-visible" aria-hidden="true">
      {/* street lamp */}
      <rect x="270" y="60" width="12" height="270" fill={INK} />
      <path d="M252 60 H300 L292 30 H260 Z" fill="#FFC973" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M262 64 L230 160 H322 L290 64" fill="#FFC973" opacity={active ? 0.35 : 0.15} />
      {/* bench */}
      <rect x="20" y="210" width="230" height="18" rx="4" fill="#C8662E" stroke={INK} strokeWidth="4" />
      <rect x="20" y="232" width="230" height="18" rx="4" fill="#C8662E" stroke={INK} strokeWidth="4" />
      <rect x="10" y="256" width="250" height="18" rx="4" fill="#C8662E" stroke={INK} strokeWidth="4" />
      <path d="M36 274 V330 M234 274 V330 M36 228 V256 M234 228 V256" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      {/* the journal */}
      <g style={{ transform: active ? "translate(0,-26px) rotate(-6deg)" : "none", transformOrigin: "150px 250px", transition: "transform .4s cubic-bezier(.3,1.4,.5,1)" }}>
        <rect x="112" y="234" width="76" height="22" rx="3" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
        <rect x="108" y="226" width="84" height="16" rx="3" fill="#D9482B" stroke={INK} strokeWidth="4" />
        <rect x="170" y="226" width="6" height="30" fill={INK} />
        <path d="M130 256 v14 l5 -4 l5 4 v-14" fill="#FFC973" stroke={INK} strokeWidth="2" />
      </g>
      {/* a coffee cup */}
      <path d="M214 240 h22 l-3 16 h-16z" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
      <path d="M220 232 q4 -6 0 -12 M228 232 q4 -6 0 -12" stroke={INK} strokeWidth="2" fill="none" opacity=".5" />
    </svg>
  );
}

/* ---------------- Contact: red telephone booth ---------------- */
export function PhoneBooth({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 170 340" className="h-full w-auto overflow-visible" aria-hidden="true">
      <defs>
        <Dots id="booth-dots" />
      </defs>
      <path d="M10 60 Q10 20 85 14 Q160 20 160 60 Z" fill="#D9482B" stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <rect x="10" y="56" width="150" height="284" fill="#D9482B" stroke={INK} strokeWidth={S} />
      <rect x="10" y="56" width="150" height="284" fill="url(#booth-dots)" />
      <rect x="26" y="64" width="118" height="24" fill={INK} stroke={INK} strokeWidth="3" />
      <text x="85" y="82" textAnchor="middle" fontSize="15" fontWeight="900" letterSpacing="2" fill="#FFF6E6">TELEPHONE</text>
      {/* inside: the rotary phone on a shelf */}
      <rect x="28" y="100" width="114" height="220" fill="#FFF6E6" stroke={INK} strokeWidth="4" />
      <rect x="44" y="200" width="82" height="10" fill="#C8662E" stroke={INK} strokeWidth="2.5" />
      <path d="M58 200 L64 172 H106 L112 200 Z" fill={INK} />
      <circle cx="85" cy="186" r="11" fill="#FFE3B3" stroke={INK} strokeWidth="2.5" />
      <path d="M56 170 Q56 158 70 158 H100 Q114 158 114 170" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      {/* door: swings open */}
      <g style={{ transform: active ? "perspective(400px) rotateY(-70deg)" : "none", transformOrigin: "28px 0", transformBox: "view-box", transition: "transform .5s cubic-bezier(.5,0,.3,1)" }}>
        <rect x="28" y="100" width="114" height="220" fill="#D9482B" stroke={INK} strokeWidth="4" />
        {[0, 1, 2].map((r) =>
          [0, 1].map((c) => <rect key={`${r}${c}`} x={38 + c * 50} y={110 + r * 66} width="44" height="58" fill="#30A0E0" fillOpacity=".55" stroke={INK} strokeWidth="3" />),
        )}
        <rect x="128" y="200" width="8" height="30" rx="3" fill="#FFC973" stroke={INK} strokeWidth="2" />
      </g>
    </svg>
  );
}
