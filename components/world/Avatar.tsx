import Image from "next/image";

/**
 * Ashita, as her illustrated sticker (from the Figma file). Used everywhere
 * she appears, so the visitor always travels with the same character.
 * The image is never mirrored (that would move her nose ring); direction is
 * shown with a lean instead. Poses are small motions and props, not redraws.
 */
export type Pose = "stand" | "walk" | "wave" | "read" | "phone";

type Props = {
  pose?: Pose;
  facing?: "left" | "right";
  className?: string;
  title?: string;
  priority?: boolean;
};

export default function Avatar({ pose = "stand", facing = "right", className = "", title, priority }: Props) {
  const motion = pose === "walk" ? (facing === "left" ? "sticker-walk-left" : "sticker-walk") : pose === "wave" ? "sticker-hop" : "";
  return (
    <span className={`relative inline-block ${className}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <span aria-hidden="true" className="absolute bottom-[-1%] left-1/2 h-[3%] w-[70%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-[1px]" />
      <span className={`relative block h-full origin-bottom ${motion}`}>
        <Image
          src="/world/ashita.webp"
          alt=""
          width={425}
          height={900}
          priority={priority}
          sizes="(max-width: 640px) 40vw, 260px"
          className="h-full w-auto drop-shadow-[0_4px_0_rgb(19_35_58/0.25)]"
          draggable={false}
        />
        {/* little props for the poses */}
        {pose === "phone" && (
          <svg viewBox="0 0 60 40" className="absolute left-[62%] top-[18%] w-[34%]" aria-hidden="true">
            <path d="M6 30 Q4 10 22 8 H38 Q56 10 54 30" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
            <path d="M6 30 Q4 10 22 8 H38 Q56 10 54 30" fill="none" stroke="#13233A" strokeWidth="10" strokeLinecap="round" />
            <path d="M6 30 Q4 10 22 8 H38 Q56 10 54 30" fill="none" stroke="#D9482B" strokeWidth="6" strokeLinecap="round" />
          </svg>
        )}
        {pose === "read" && (
          <svg viewBox="0 0 60 44" className="absolute left-[18%] top-[47%] w-[64%]" aria-hidden="true">
            <path d="M4 6 L30 12 L56 6 V38 L30 44 L4 38 Z" fill="#D9482B" stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
            <path d="M4 6 L30 12 L56 6 V38 L30 44 L4 38 Z" fill="#D9482B" stroke="#13233A" strokeWidth="3" strokeLinejoin="round" />
            <path d="M30 12 V44" stroke="#13233A" strokeWidth="2.5" />
          </svg>
        )}
      </span>
    </span>
  );
}
