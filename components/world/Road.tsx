/**
 * The road that runs under every painted scene, drawn the way it is in
 * Ashita's Flows frames: a warm kerb, black asphalt, yellow edge lines and
 * a white dashed centre line. Positioned by the shared street-road class.
 */
export default function Road() {
  return (
    <div aria-hidden="true" className="street-road absolute bottom-0 left-[-100vw] right-[-100vw]">
      <div className="absolute inset-x-0 top-0 h-[7%] bg-[linear-gradient(180deg,#8a5a34,#5a3a22)]" />
      <div className="absolute inset-x-0 bottom-0 top-[7%] bg-[#1c1b1d]">
        <div className="absolute inset-x-0 top-[9%] h-[4px] bg-[#f2b51d]" />
        <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#f4f1ea_0_44px,transparent_44px_80px)]" />
        <div className="absolute inset-x-0 bottom-[9%] h-[4px] bg-[#f2b51d]" />
      </div>
    </div>
  );
}
