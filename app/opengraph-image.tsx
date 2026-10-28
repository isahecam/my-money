import { ImageResponse } from "next/og";

import { Shiori } from "@/components/og/shiori";

export default function Image() {
  return new ImageResponse(
    <Shiori
      title="Mi aplicación de finanzas personales"
      background="#ede9de"
      titleColor="#535146"
      logo="https://finances.isahecam.com/static/logo.png"
      brand="My Money"
      brandColor="#3d3929"
    />,
    { width: 1200, height: 630 },
  );
}
