import type { Metadata, Viewport } from "next";
import "@fontsource/anton-sc/400.css";
import "@fontsource-variable/funnel-sans";
import "@fontsource/caveat/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Ashita · Interaction and product designer", template: "%s · Ashita" },
  description:
    "Portfolio of Ashita, interaction and product designer. Switch on the TV and step inside.",
};

export const viewport: Viewport = {
  themeColor: "#FFF6E6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
