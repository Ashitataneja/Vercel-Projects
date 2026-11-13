/**
 * Ashita, drawn in the site's comic style: long dark hair with a centre
 * parting, nose ring, pink floral dress with a tie waist, white sneakers.
 * One drawing, a few poses. Feet sit at the bottom centre of the viewBox.
 */
export type Pose = "stand" | "walk" | "wave" | "read" | "phone";

const INK = "#13233A";
const SKIN = "#F1C29C";
const SKIN_SHADE = "#E0A57E";
const HAIR = "#1E1A1F";
const ROSE = "#E8588A";
const ROSE_LIGHT = "#F7A8C4";
const PEACH = "#FFB37A";

type Props = {
  pose?: Pose;
  facing?: "left" | "right";
  className?: string;
  title?: string;
};

export default function Avatar({ pose = "stand", facing = "right", className, title }: Props) {
  const walking = pose === "walk";
  return (
    <svg
      viewBox="0 0 140 280"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <pattern id="av-floral" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="3" fill={ROSE_LIGHT} />
          <circle cx="13" cy="12" r="2.6" fill={PEACH} />
          <circle cx="13" cy="12" r="1" fill={ROSE} />
          <path d="M2 14 q2 -3 4 0" stroke="#FFF6E6" strokeWidth="1.2" fill="none" />
        </pattern>
      </defs>

      <g transform={facing === "left" ? "translate(140 0) scale(-1 1)" : undefined}>
        <g className={walking ? "av-bob" : undefined}>
          {/* ground shadow */}
          <ellipse cx="70" cy="272" rx="34" ry="6" fill={INK} opacity=".2" />

          {/* hair, back layer */}
          <path d="M40 58 Q36 20 70 18 Q104 20 100 58 L106 150 Q90 162 70 158 Q50 162 34 150 Z" fill={HAIR} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />

          {/* legs */}
          <g className={walking ? "av-leg-a" : undefined} style={{ transformOrigin: "62px 200px" }}>
            <path d="M58 200 V250" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <path d="M58 200 V250" stroke={INK} strokeWidth="15" strokeLinecap="round" opacity="0" />
            <path d="M46 258 Q46 246 58 246 Q66 246 68 252 L70 262 H46 Z" fill="#FFF6E6" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M50 252 H64" stroke={ROSE} strokeWidth="2" />
          </g>
          <g className={walking ? "av-leg-b" : undefined} style={{ transformOrigin: "78px 200px" }}>
            <path d="M82 200 V250" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <path d="M72 258 Q72 246 84 246 Q92 246 94 252 L96 262 H72 Z" fill="#FFF6E6" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M76 252 H90" stroke={ROSE} strokeWidth="2" />
          </g>
          {/* leg outlines */}
          <path d="M52.5 204 V246 M63.5 204 V246 M76.5 204 V246 M87.5 204 V246" stroke={INK} strokeWidth="2.5" opacity={walking ? 0 : 1} />

          {/* back arm (behind dress) */}
          {pose !== "read" && (
            <g className={walking ? "av-arm-b" : undefined} style={{ transformOrigin: "96px 100px" }}>
              <path d="M94 96 Q110 120 108 146" stroke={ROSE} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M94 96 Q110 120 108 146" stroke={INK} strokeWidth="19" strokeLinecap="round" fill="none" opacity=".0" />
              <path d="M108 146 L108 168" stroke={SKIN} strokeWidth="10" strokeLinecap="round" />
              <circle cx="108" cy="172" r="5.5" fill={SKIN} stroke={INK} strokeWidth="3" />
            </g>
          )}

          {/* dress */}
          <path
            d="M48 92 Q70 84 92 92 L98 140 Q96 146 92 148 L110 206 Q70 216 30 206 L48 148 Q44 146 42 140 Z"
            fill={ROSE}
            stroke={INK}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M48 92 Q70 84 92 92 L98 140 Q96 146 92 148 L110 206 Q70 216 30 206 L48 148 Q44 146 42 140 Z"
            fill="url(#av-floral)"
            opacity=".9"
          />
          {/* placket with buttons */}
          <path d="M70 92 V146" stroke={INK} strokeWidth="2" opacity=".6" />
          {[104, 116, 128].map((y) => (
            <circle key={y} cx="70" cy={y} r="2.2" fill="#FFF6E6" stroke={INK} strokeWidth="1.2" />
          ))}
          {/* tie waist */}
          <path d="M44 146 Q70 154 96 146" stroke={INK} strokeWidth="3" fill="none" />
          <path d="M70 150 q-8 4 -10 14 M70 150 q6 6 4 18" stroke={ROSE_LIGHT} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M70 150 q-8 4 -10 14 M70 150 q6 6 4 18" stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* front arm, posed */}
          {pose === "wave" ? (
            <g className="av-wave" style={{ transformOrigin: "46px 98px" }}>
              <path d="M46 98 Q28 84 26 62" stroke={ROSE} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M26 62 L24 44" stroke={SKIN} strokeWidth="10" strokeLinecap="round" />
              <circle cx="24" cy="38" r="7.5" fill={SKIN} stroke={INK} strokeWidth="3" />
            </g>
          ) : pose === "read" ? (
            <g>
              <path d="M46 98 Q36 120 52 132" stroke={ROSE} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M94 98 Q104 120 88 132" stroke={ROSE} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M44 120 L70 128 L96 120 L96 146 L70 154 L44 146 Z" fill="#D9482B" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M70 128 V154" stroke={INK} strokeWidth="2.5" />
            </g>
          ) : pose === "phone" ? (
            <g>
              <path d="M46 98 Q34 88 40 66" stroke={ROSE} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M38 50 Q34 70 46 74" stroke={INK} strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M38 50 Q34 70 46 74" stroke="#D9482B" strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="44" cy="70" r="7" fill={SKIN} stroke={INK} strokeWidth="3" />
            </g>
          ) : (
            <g className={walking ? "av-arm-a" : undefined} style={{ transformOrigin: "44px 100px" }}>
              <path d="M46 96 Q30 120 32 146" stroke={ROSE} strokeWidth="15" strokeLinecap="round" fill="none" />
              <path d="M32 146 L32 168" stroke={SKIN} strokeWidth="10" strokeLinecap="round" />
              <circle cx="32" cy="172" r="5.5" fill={SKIN} stroke={INK} strokeWidth="3" />
            </g>
          )}
          {/* sleeve cuffs */}
          {pose !== "read" && pose !== "wave" && pose !== "phone" && <path d="M25 146 H39" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
          {pose !== "read" && <path d="M101 146 H115" stroke={INK} strokeWidth="3" strokeLinecap="round" />}

          {/* neck */}
          <path d="M62 74 V90 Q70 96 78 90 V74 Z" fill={SKIN_SHADE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M60 90 L70 100 L80 90" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M63 92 Q70 98 77 92" stroke="#FFC973" strokeWidth="1.4" fill="none" />

          {/* head */}
          <ellipse cx="70" cy="51" rx="25" ry="27" fill={SKIN} stroke={INK} strokeWidth="3.5" />
          {/* eyes: smiling arcs */}
          <path d="M57 50 Q62 45 67 50" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M73 50 Q78 45 83 50" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M56 42 Q61 39 66 41 M74 41 Q79 39 84 42" stroke={HAIR} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          {/* nose + nose ring */}
          <path d="M70 52 Q68 60 71 61" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="66.5" cy="60" r="2.4" fill="none" stroke="#FFC973" strokeWidth="1.6" />
          {/* smile */}
          <path d="M60 66 Q70 76 80 66 Q70 70 60 66 Z" fill="#FFF6E6" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          {/* cheeks */}
          <circle cx="57" cy="61" r="4" fill={ROSE} opacity=".35" />
          <circle cx="83" cy="61" r="4" fill={ROSE} opacity=".35" />

          {/* hair, front: cap with a centre parting, strands falling past the face */}
          <path d="M45 54 Q41 20 70 19 Q99 20 95 54 Q92 38 84 33 Q76 29 70 35 Q64 29 56 33 Q48 38 45 54 Z" fill={HAIR} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M45 44 Q38 72 39 100 Q38 124 44 142 L54 140 Q49 116 51 94 Q51 76 47 62 Z" fill={HAIR} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M95 44 Q102 72 101 100 Q102 124 96 142 L86 140 Q91 116 89 94 Q89 76 93 62 Z" fill={HAIR} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M70 21 V34" stroke="#4A4048" strokeWidth="1.6" />
          <path d="M44 80 Q42 104 44 128 M96 80 Q98 104 96 128" stroke="#4A4048" strokeWidth="1.5" fill="none" />
        </g>
      </g>
    </svg>
  );
}
