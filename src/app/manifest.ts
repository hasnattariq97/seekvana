import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seekvana — Learn AI, clearly",
    short_name: "Seekvana",
    description:
      "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#C9633F",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
