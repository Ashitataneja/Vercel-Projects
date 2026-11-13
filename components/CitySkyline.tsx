/**
 * Placeholder city in the flat paper-and-ink style.
 * Swap for the city illustration from the Figma file once it's exported.
 */
function Tile() {
  const ink = "#13233A";
  const sw = 3;
  return (
    <svg
      viewBox="0 0 800 300"
      className="h-full w-auto shrink-0"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* far hills */}
      <path d="M0 230 Q120 190 240 222 T480 214 T800 226 V300 H0Z" fill="#006BB9" opacity=".35" />
      {/* tower block */}
      <rect x="40" y="120" width="70" height="140" fill="#FFE3B3" stroke={ink} strokeWidth={sw} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1].map((c) => (
          <rect key={`a${r}${c}`} x={54 + c * 26} y={136 + r * 28} width="16" height="16" fill="#FFC973" stroke={ink} strokeWidth="2" />
        )),
      )}
      {/* arch gate */}
      <path d="M150 260 V150 H260 V260 H230 V200 A25 25 0 0 0 180 200 V260Z" fill="#FFF6E6" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="142" y="136" width="126" height="16" fill="#FFC973" stroke={ink} strokeWidth={sw} />
      {/* dome */}
      <path d="M300 260 V196 H400 V260Z" fill="#FFE3B3" stroke={ink} strokeWidth={sw} />
      <path d="M306 196 A44 44 0 0 1 394 196Z" fill="#FFF6E6" stroke={ink} strokeWidth={sw} />
      <line x1="350" y1="152" x2="350" y2="134" stroke={ink} strokeWidth={sw} />
      <circle cx="350" cy="130" r="5" fill="#D9482B" stroke={ink} strokeWidth="2" />
      {/* office (chimney: the factory) */}
      <rect x="440" y="170" width="120" height="90" fill="#FFF6E6" stroke={ink} strokeWidth={sw} />
      <path d="M440 170 L470 150 L500 170 L530 150 L560 170" fill="#FFC973" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="530" y="100" width="18" height="52" fill="#FFE3B3" stroke={ink} strokeWidth={sw} />
      <circle cx="546" cy="86" r="10" fill="#FFF6E6" opacity=".8" />
      <circle cx="560" cy="70" r="13" fill="#FFF6E6" opacity=".6" />
      {/* tall glass block */}
      <rect x="600" y="90" width="80" height="170" fill="#006BB9" stroke={ink} strokeWidth={sw} />
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <line key={`g${r}`} x1="600" y1={114 + r * 24} x2="680" y2={114 + r * 24} stroke={ink} strokeWidth="2" />
      ))}
      {/* tree */}
      <line x1="730" y1="260" x2="730" y2="220" stroke={ink} strokeWidth={sw} />
      <circle cx="730" cy="206" r="24" fill="#FFC973" stroke={ink} strokeWidth={sw} />
      {/* road */}
      <rect x="0" y="258" width="800" height="42" fill="#13233A" />
      <line x1="0" y1="280" x2="800" y2="280" stroke="#FFE3B3" strokeWidth="3" strokeDasharray="22 18" />
    </svg>
  );
}

export default function CitySkyline() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[78%] overflow-hidden" aria-hidden="true">
      <div className="city-pan flex h-full w-max">
        <Tile />
        <Tile />
        <Tile />
        <Tile />
      </div>
    </div>
  );
}
