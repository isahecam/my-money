import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { Shiori } from "@/components/og/shiori";

// Read from disk: the image is prerendered at build time, before the domain serves the logo.
const logoData = await readFile(join(process.cwd(), "public/static/logo.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default function Image() {
  return new ImageResponse(
    <Shiori
      title="Mi aplicación de finanzas personales"
      background="#ede9de"
      titleColor="#535146"
      logo={logoSrc}
      brand="My Money"
      brandColor="#3d3929"
    />,
    { width: 1200, height: 630 },
  );
}
