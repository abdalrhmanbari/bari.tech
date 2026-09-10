import type { Config } from "tailwindcss";

/**
 * Design tokens mirror the reference site's CSS custom properties exactly.
 * Kept here so every component can reach them through Tailwind utilities.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#151515",
          secondary: "#1C1C1C",
        },
        surface: "#222222",
        card: "#1A1A1A",
        ink: {
          primary: "#F5F5F5",
          secondary: "#BDBDBD",
          muted: "#888888",
        },
        hair: "#353535",
        accent: {
          DEFAULT: "#C9CBCE",
          dim: "#8B8D90",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        grotesk: ["var(--font-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        section: "1360px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 0.84, 0.32, 1)",
      },
      screens: {
        // Named to match the reference's media-query breakpoints.
        "bp-xl": { max: "1150px" },
        "bp-lg": { max: "980px" },
        "bp-md": { max: "900px" },
        "bp-nav": { max: "860px" },
        "bp-sm": { max: "820px" },
        "bp-xs": { max: "760px" },
        "bp-2xs": { max: "700px" },
      },
    },
  },
  plugins: [],
};

export default config;
