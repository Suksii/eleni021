import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eleni — torte, kolači i ketering",
    short_name: "Eleni",
    description: "Grčka poslastičarnica u Novom Sadu: torte, komadni kolači i ketering.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4ede3",
    theme_color: "#8a6f4e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
