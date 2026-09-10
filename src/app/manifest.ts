import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Portfolio`,
    short_name: "AB Portfolio",
    description: site.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#151515",
    theme_color: "#151515",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
