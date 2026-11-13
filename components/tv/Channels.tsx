"use client";

import Avatar from "../world/Avatar";
import CitySkyline from "../CitySkyline";

/**
 * What's on Ashita's TV. Each channel is a small illustrated broadcast in the
 * site's comic style. No real channel logos; the genres are the ones she
 * grew up watching. Captions stay [PLACEHOLDER] until she writes them.
 */
export const CHANNELS = [
  { n: "01", name: "Music", tag: "Songs on loop" },
  { n: "02", name: "Bollywood", tag: "Tonight's movie" },
  { n: "03", name: "Cartoons", tag: "After-school hour" },
  { n: "04", name: "Serials", tag: "Dramatic zoom" },
  { n: "05", name: "Photos", tag: "From my walks" },
] as const;

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute inset-x-[4%] bottom-[5%] z-10">
      <span className="inline-block max-w-full rounded-md bg-ink/90 px-2 py-1 text-[11px] leading-snug text-paper sm:px-3 sm:py-2 sm:text-sm">{children}</span>
    </span>
  );
}

function Music() {
  return (
    <div className="absolute inset-0 bg-[#3b2a8f]">
      <div className="halftone-light absolute inset-0" />
      {/* equaliser */}
      <div className="absolute inset-x-[10%] bottom-[24%] top-[22%] flex items-end gap-[3%]">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="eq-bar flex-1 rounded-t-sm border-[2px] border-ink"
            style={{ background: ["#FFC973", "#E8588A", "#30A0E0"][i % 3], animationDelay: `${(i * 137) % 600}ms`, height: `${30 + ((i * 53) % 60)}%` }}
          />
        ))}
      </div>
      <span className="absolute left-[6%] top-[20%] font-display text-[clamp(1.2rem,5vw,2.4rem)] uppercase leading-none text-butter">Non-stop hits</span>
      <Caption>
        <b className="text-butter">Now playing · </b>[PLACEHOLDER: a song I had on loop]
      </Caption>
    </div>
  );
}

function Bollywood() {
  return (
    <div className="absolute inset-0 bg-ink">
      {/* curtains */}
      <div className="absolute inset-y-0 left-0 w-[22%] bg-[repeating-linear-gradient(90deg,#D9482B_0_14px,#a8321c_14px_20px)] border-r-[3px] border-ink" />
      <div className="absolute inset-y-0 right-0 w-[22%] bg-[repeating-linear-gradient(90deg,#D9482B_0_14px,#a8321c_14px_20px)] border-l-[3px] border-ink" />
      <div className="absolute inset-x-0 top-0 h-[12%] bg-[#a8321c] border-b-[3px] border-ink" />
      {/* spotlight + reel */}
      <div className="absolute left-1/2 top-[18%] h-[60%] w-[46%] -translate-x-1/2 rounded-[50%] bg-butter/20" />
      <svg viewBox="0 0 100 100" className="reel-spin absolute left-1/2 top-[22%] h-[44%] -translate-x-1/2" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="#FFE3B3" stroke="#13233A" strokeWidth="5" />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={50 + Math.cos((a * Math.PI) / 180) * 24} cy={50 + Math.sin((a * Math.PI) / 180) * 24} r="10" fill="#13233A" />
        ))}
        <circle cx="50" cy="50" r="6" fill="#D9482B" stroke="#13233A" strokeWidth="3" />
      </svg>
      <Caption>
        <b className="text-butter">Tonight · </b>[PLACEHOLDER: the film I can rewatch forever]
      </Caption>
    </div>
  );
}

function Cartoons() {
  return (
    <div className="absolute inset-0 bg-[#4E9A4B]">
      <div className="absolute inset-x-0 bottom-0 h-[30%] border-t-[3px] border-ink bg-[#2F6B33]" />
      <div className="absolute right-[10%] top-[10%] h-[18%] aspect-square rounded-full border-[3px] border-ink bg-butter" />
      {/* bouncing ball buddy */}
      <div className="toon-bounce absolute bottom-[30%] left-[38%] h-[34%] aspect-square">
        <div className="toon-squash h-full w-full rounded-full border-[3px] border-ink bg-red">
          <span className="absolute left-[24%] top-[30%] h-[18%] w-[14%] rounded-full bg-ink" />
          <span className="absolute right-[24%] top-[30%] h-[18%] w-[14%] rounded-full bg-ink" />
          <span className="absolute bottom-[22%] left-1/2 h-[14%] w-[34%] -translate-x-1/2 rounded-b-full border-[3px] border-t-0 border-ink" />
        </div>
      </div>
      <span className="absolute left-[6%] top-[12%] rotate-[-6deg] font-display text-[clamp(1.1rem,5vw,2.2rem)] uppercase text-paper [text-shadow:3px_3px_0_#13233A]">Boing!</span>
      <Caption>
        <b className="text-butter">After school · </b>[PLACEHOLDER: the cartoon I never missed]
      </Caption>
    </div>
  );
}

function Serials() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#7a1f3d]">
      <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg_at_50%_40%,rgb(255_201_115/0.35)_0deg_10deg,transparent_10deg_20deg)]" />
      <div className="serial-zoom absolute left-1/2 top-[6%] h-[150%] -translate-x-1/2">
        <Avatar pose="stand" className="h-full w-auto" />
      </div>
      <span className="absolute right-[5%] top-[10%] rotate-[8deg] font-display text-[clamp(1rem,4.5vw,2rem)] uppercase text-butter [text-shadow:3px_3px_0_#13233A]">Dhum! Ta! Dhum!</span>
      <Caption>
        <b className="text-butter">Next episode · </b>[PLACEHOLDER: the serial my family watched together]
      </Caption>
    </div>
  );
}

function Photos() {
  return (
    <div className="absolute inset-0 bg-sky">
      <div className="absolute right-[12%] top-[12%] h-[18%] aspect-square rounded-full border-[3px] border-ink bg-butter" />
      <CitySkyline />
      <div className="absolute left-1/2 top-[14%] w-[44%] -translate-x-1/2 rotate-[-3deg] border-[3px] border-ink bg-paper p-[2%] pb-[1%] shadow-[4px_4px_0_rgb(19_35_58/0.4)]">
        <div className="grid aspect-[4/3] place-items-center bg-ink/15 text-[10px] font-semibold text-ink-soft sm:text-xs">[PLACEHOLDER: photo]</div>
        <p className="mt-1 text-center font-hand text-sm leading-none sm:text-lg">[a street I loved]</p>
      </div>
      <Caption>
        <b className="text-butter">From my walks · </b>[PLACEHOLDER: photo story]
      </Caption>
    </div>
  );
}

export function ChannelScreen({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <Music />;
    case 1:
      return <Bollywood />;
    case 2:
      return <Cartoons />;
    case 3:
      return <Serials />;
    default:
      return <Photos />;
  }
}
