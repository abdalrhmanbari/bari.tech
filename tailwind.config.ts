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
        // Arabic-capable family; swapped in for the three above when the
        // document is in Arabic (see the `:root[lang="ar"]` rule in globals.css).
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        section: "1360px",
      },
      spacing: {
        // Fixed header height — used for offsets and scroll-margin.
        header: "72px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 0.84, 0.32, 1)",
      },
      keyframes: {
        // Hero portrait entrance (was @keyframes portraitFrame / portraitImage).
        "portrait-frame": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "portrait-image": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Hero scroll indicator drip (was @keyframes scrolldrop).
        "scroll-drop": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(250%)" },
        },
      },
      animation: {
        "portrait-frame": "portrait-frame 1.2s ease-out both",
        "portrait-image": "portrait-image 1.2s ease-out both",
        "scroll-drop":
          "scroll-drop 2.2s infinite cubic-bezier(0.16, 0.84, 0.32, 1)",
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
