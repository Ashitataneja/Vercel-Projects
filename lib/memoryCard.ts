/**
 * Makes a downloadable "memory card" in the browser: a Polaroid of a painted
 * scene with a caption, a small map of the journey so far, Ashita's avatar
 * and her name and website. Returns a PNG blob.
 */
type Card = {
  scene: string;
  title: string;
  subtitle: string;
  /** the journey as a list of short names, with the index of this place */
  route?: { names: string[]; at: number };
  /** a plain photograph (gallery) instead of a scene */
  photo?: boolean;
};

const W = 1200;
const H = 1500;
const SITE = "atworks.com";

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function makeMemoryCard(card: Card): Promise<Blob> {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  await document.fonts.ready;

  // paper
  g.fillStyle = "#f6eedc";
  g.fillRect(0, 0, W, H);

  // the photograph, cover-cropped into the Polaroid window
  const img = await load(card.scene);
  const px = 70, py = 70, pw = W - 140, ph = 900;
  const s = Math.max(pw / img.width, ph / img.height);
  const sw = pw / s, sh = ph / s;
  g.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, px, py, pw, ph);
  g.strokeStyle = "rgba(59,43,36,0.35)";
  g.lineWidth = 2;
  g.strokeRect(px, py, pw, ph);

  // caption
  g.fillStyle = "#3b2b24";
  g.font = "600 76px Caveat, cursive";
  g.fillText(card.title, px, 1062, pw - 260);
  g.font = "600 34px 'Funnel Sans Variable', sans-serif";
  g.fillStyle = "#6b5547";
  g.fillText(card.subtitle, px, 1112, pw - 260);

  // little map of the journey: dots on a dashed road, this place in red
  if (card.route) {
    const { names, at } = card.route;
    const y = 1235, x0 = px + 20, x1 = W - px - 300;
    g.setLineDash([14, 12]);
    g.strokeStyle = "#3b2b24";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(x0, y);
    g.lineTo(x1, y);
    g.stroke();
    g.setLineDash([]);
    names.forEach((n, i) => {
      const x = x0 + ((x1 - x0) * i) / Math.max(1, names.length - 1);
      g.beginPath();
      g.arc(x, y, i === at ? 16 : 10, 0, Math.PI * 2);
      g.fillStyle = i === at ? "#d9482b" : i < at ? "#3b2b24" : "#f6eedc";
      g.fill();
      g.lineWidth = 4;
      g.strokeStyle = "#3b2b24";
      g.stroke();
      if (i === at || i === 0 || i === names.length - 1) {
        g.font = "600 26px 'Funnel Sans Variable', sans-serif";
        g.fillStyle = "#3b2b24";
        g.textAlign = "center";
        g.fillText(n, x, y + 52);
        g.textAlign = "left";
      }
    });
  }

  // avatar and signature
  const av = await load("/world/ashita.webp");
  const ah = 300, aw = (av.width / av.height) * ah;
  g.drawImage(av, W - px - aw, H - 60 - ah, aw, ah);
  g.font = "600 44px Caveat, cursive";
  g.fillStyle = "#3b2b24";
  g.textAlign = "right";
  g.fillText("Ashita", W - px - aw - 20, H - 120);
  g.font = "600 26px 'Funnel Sans Variable', sans-serif";
  g.fillStyle = "#6b5547";
  g.fillText(SITE, W - px - aw - 20, H - 80);
  g.textAlign = "left";

  return new Promise((resolve) => c.toBlob((b) => resolve(b!), "image/png"));
}

export async function downloadMemoryCard(card: Card, filename: string) {
  const blob = await makeMemoryCard(card);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
