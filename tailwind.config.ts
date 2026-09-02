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
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          lowest: "var(--surface-lowest)",
          low: "var(--surface-low)",
          card: "var(--surface-card)",
          high: "var(--surface-high)",
          container: "var(--surface-container)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          container: "var(--primary-container)",
          "on-container": "var(--on-primary-container)",
        },
        accent: {
          terracotta: "#ea580c",
          apricot: "#f97316",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          accent: "var(--border-accent)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        headline: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      fontSize: {
        "4xs": "0.5625rem",
        "3xs": "0.625rem",
        "2xs": "0.6875rem",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      boxShadow: {
        card: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
        glow: "0 4px 20px -2px rgba(234, 88, 12, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
