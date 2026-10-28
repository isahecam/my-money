import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Money",
    short_name: "My Money",
    description: "Mi aplicación de finanzas personales.",
    start_url: "/",
    display: "standalone",
    background_color: "#ede9de",
    theme_color: "#3d3929",
    icons: [
      {
        src: "/static/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/static/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
