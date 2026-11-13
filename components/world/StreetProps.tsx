/**
 * Things along Ashita's street, drawn in the same pop-art comic style as the
 * living room: thick ink outlines, flat palette fills, halftone dots.
 * Each takes an `active` flag for its "opening" moment (shutter rolls up,
 * booth door swings, TV flickers, journal lifts).
 */
const INK = "#13233A";
const S = 5;

function Dots({ id }: { id: string }) {
  return (
    <pattern id={id} width="9" height="9" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.3" fill={INK} opacity=".2" />
    </pattern>
  );
}

/* ---------------- Home: the house, TV room seen through the window ---------------- */
export function House({ tvOn }: { tvOn: boolean }) {
  return (
    <svg viewBox="0 0 400 330" className="h-full w-auto overflow-visible" aria-hidden="true">
      <defs>
        <Dots id="house-dots" />
      </defs>
      {/* building */}
      <rect x="10" y="70" width="380" height="260" fill="#FFE3B3" stroke={INK} strokeWidth={S} />
      <rect x="10" y="70" width="380" height="260" fill="url(#house-dots)" />
      {/* roof */}
      <path d="M-6 76 L60 10 H340 L406 76 Z" fill="#D9482B" stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M40 54 H360 M22 70 H378" stroke={INK} strokeWidth="3" opacity=".4" />
      <rect x="300" y="-18" width="34" height="50" fill="#C8662E" stroke={INK} strokeWidth={S} />
      {/* door */}
      <rect x="34" y="190" width="70" height="140" rx="4" fill="#006BB9" stroke={INK} strokeWidth={S} />
      <circle cx="90" cy="262" r="5" fill="#FFC973" stroke={INK} strokeWidth="2.5" />
      <rect x="44" y="204" width="50" height="40" fill="#30A0E0" stroke={INK} strokeWidth="3" />
      <rect x="26" y="322" width="86" height="10" fill="#8A3F1C" stroke={INK} strokeWidth="3" />
      {/* house number */}
      <rect x="54" y="160" width="30" height="22" rx="3" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
      <text x="69" y="177" textAnchor="middle" fontSize="16" fontWeight="800" fill={INK}>01</text>

      {/* big window into the TV room */}
      <rect x="128" y="110" width="236" height="170" fill="#FFF6E6" stroke={INK} strokeWidth={S} />
      <g>
        {/* room interior */}
        <rect x="132" y="114" width="228" height="162" fill="#FFF6E6" />
        <rect x="132" y="236" width="228" height="40" fill="#C8662E" />
        <circle cx="168" cy="146" r="16" fill="#D9482B" stroke={INK} strokeWidth="3" />
        <circle cx="168" cy="146" r="11" fill="#FFF6E6" />
        <path d="M168 146 L168 138 M168 146 L174 149" stroke={INK} strokeWidth="2" />
        <rect x="292" y="126" width="44" height="52" fill="#FFF6E6" stroke={INK} strokeWidth="3" />
        <rect x="298" y="132" width="32" height="40" fill="#006BB9" />
        <circle cx="314" cy="148" r="8" fill="#D9482B" stroke={INK} strokeWidth="2" />
        {/* cabinet */}
        <rect x="196" y="218" width="104" height="26" fill="#C8662E" stroke={INK} strokeWidth="3" />
        {/* tv */}
        <path d="M222 164 L210 146 M236 164 L250 146" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <rect x="204" y="162" width="88" height="58" rx="8" fill="#C8662E" stroke={INK} strokeWidth="3.5" />
        <rect x="210" y="168" width="64" height="46" rx="6" fill={tvOn ? "#30A0E0" : "#13233A"} stroke={INK} strokeWidth="3" />
        {tvOn && (
          <>
            <circle cx="260" cy="180" r="6" fill="#FFC973" />
            <path d="M212 206 L226 194 L236 202 L250 188 L272 206 Z" fill="#FFF6E6" stroke={INK} strokeWidth="2" />
            <rect x="214" y="172" width="18" height="8" fill="#FFC973" stroke={INK} strokeWidth="1.5" />
          </>
        )}
        <circle cx="283" cy="180" r="4" fill="#FFC973" stroke={INK} strokeWidth="2" />
        <circle cx="283" cy="196" r="4" fill="#FFE3B3" stroke={INK} strokeWidth="2" />
        {/* armchair back, from behind */}
        <path d="M300 276 V236 Q300 220 316 220 H346 Q360 222 360 236 V276 Z" fill="#4E9A4B" stroke={INK} strokeWidth="3" />
      </g>
      {/* window frame + glare */}
      <path d="M246 110 V280 M128 194 H364" stroke={INK} strokeWidth="4" opacity=".0" />
      <path d="M140 270 L190 120 M160 270 L210 120" stroke="#FFFFFF" strokeWidth="8" opacity=".35" />
      <rect x="128" y="110" width="236" height="170" fill="none" stroke={INK} strokeWidth={S} />
      <rect x="118" y="280" width="256" height="14" fill="#FFC973" stroke={INK} strokeWidth="4" />
      {/* plant on sill */}
      <path d="M340 280 l-6 -18 h24 l-6 18z" fill="#D9482B" stroke={INK} strokeWidth="3" />
      <path d="M346 262 q-10 -16 -2 -26 q6 12 2 26 q6 -18 16 -20 q-2 14 -16 20" fill="#4E9A4B" stroke={INK} strokeWidth="2.5" />
    </svg>
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
      <rect x="30" y="8" width="200" height="44" rx="6" fill="#13233A" stroke={INK} strokeWidth={S} />
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
      <rect x="14" y="324" width="232" height="10" fill="#13233A" />
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
      <rect x="270" y="60" width="12" height="270" fill="#13233A" />
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
        <rect x="170" y="226" width="6" height="30" fill="#13233A" />
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
      <rect x="26" y="64" width="118" height="24" fill="#13233A" stroke={INK} strokeWidth="3" />
      <text x="85" y="82" textAnchor="middle" fontSize="15" fontWeight="900" letterSpacing="2" fill="#FFF6E6">TELEPHONE</text>
      {/* inside: the rotary phone on a shelf */}
      <rect x="28" y="100" width="114" height="220" fill="#FFF6E6" stroke={INK} strokeWidth="4" />
      <rect x="44" y="200" width="82" height="10" fill="#C8662E" stroke={INK} strokeWidth="2.5" />
      <path d="M58 200 L64 172 H106 L112 200 Z" fill="#13233A" />
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

/* ---------------- far background: rooftops and sky shapes ---------------- */
export function FarSkyline() {
  return (
    <svg viewBox="0 0 800 160" className="h-full w-auto shrink-0" preserveAspectRatio="xMinYMax meet" aria-hidden="true">
      <path
        d="M0 160 V110 H40 V80 H90 V120 H120 V60 H150 V40 H170 V60 H200 V100 H250 V70 Q280 40 310 70 V110 H360 V90 H420 V50 H460 V100 H520 V76 H560 V120 H600 V64 L630 40 L660 64 V110 H720 V86 H780 V120 H800 V160 Z"
        fill="#30A0E0"
        opacity=".45"
      />
    </svg>
  );
}
