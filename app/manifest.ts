import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MORPH - The Wrap Station",
    short_name: "MORPH",
    description: "Convert between JSON, XML, YAML, and CSV formats",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    orientation: "any",
    categories: ["utilities", "productivity", "developer tools"],
    shortcuts: [
      {
        name: "Morse Tools",
        url: "/morse-tools",
        description: "Morse code translator and tools",
      },
    ],
    screenshots: [
      {
        src: "/logo.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        form_factor: "wide",
      },
    ],
    id: "morph-wrap-station",
    dir: "ltr",
    lang: "en",
    prefer_related_applications: false,
    scope: "/",
    update_via_cache: "none",
  }
}
