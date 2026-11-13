import Image from "next/image";

/**
 * One of Ashita's painted Delhi scenes, filling the screen behind a section.
 * Fixed, so the place stays put while the content scrolls over it, with a
 * soft wash so text and stickers stay readable.
 */
export default function PaintedBackdrop({
  src,
  position = "center",
  wash = "light",
}: {
  src: string;
  position?: string;
  wash?: "light" | "dark" | "none";
}) {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
      {wash === "light" && <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(255_246_230/0.55),rgb(255_246_230/0.15)_45%,rgb(19_35_58/0.25))]" />}
      {wash === "dark" && <div className="absolute inset-0 bg-ink/35" />}
    </div>
  );
}
