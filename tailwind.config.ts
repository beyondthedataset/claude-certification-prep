import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0E12",
        surface: {
          DEFAULT: "#0D0E12",
          "container-lowest": "#08090C",
          "container-low": "#111319",
          container: "#151821",
          "container-high": "#1C202B",
          "container-highest": "#252B3A",
          card: "#14161D",
        },
        "on-surface": "#E2E4E9",
        "on-surface-variant": "#949AA7",
        outline: {
          DEFAULT: "#4E5464",
          variant: "rgba(255, 255, 255, 0.08)",
        },
        primary: {
          DEFAULT: "#FFFFFF",
          container: "#1F2430",
          "on-container": "#D6DAE3",
        },
        secondary: {
          DEFAULT: "#9AA3B2",
          container: "#181D28",
          "on-container": "#C9D1DF",
        },
        accent: {
          DEFAULT: "#7BD0FF",
          container: "#00354A",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.05)",
          accent: "rgba(255, 255, 255, 0.2)",
        },
        muted: {
          DEFAULT: "#14161D",
          foreground: "#8E95A5",
        },
      },
      fontFamily: {
        headline: ["'Hanken Grotesk'", "sans-serif"],
        sans: ["'Geist'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
