import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ToolHive — Free Online Tools",
    short_name: "ToolHive",
    description: "117 free online tools in one hive. Runs in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#F59E0B",
    icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
