import type { Config } from "tailwindcss";

// Tokens lifted 1:1 from the Stitch design export
// (cyber_minimalist_bengali_robotics/DESIGN.md)
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface / elevation layers
        background: "#0e1321",
        surface: "#0e1321",
        "surface-lowest": "#090e1c",
        "surface-low": "#161b2a",
        "surface-container": "#1a1f2e",
        "surface-high": "#252a39",
        "surface-highest": "#303444",
        outline: "#3b494b",
        "outline-soft": "rgba(148, 163, 184, 0.2)",

        // Text
        "on-surface": "#f8fafc",
        "on-surface-variant": "#94a3b8",
        "on-surface-muted": "#475569",

        // Brand accents (exact hex from the brief)
        cyan: {
          DEFAULT: "#00f0ff",
          soft: "rgba(0, 240, 255, 0.12)",
          border: "rgba(0, 240, 255, 0.18)",
        },
        violet: {
          DEFAULT: "#8b5cf6",
          soft: "rgba(139, 92, 246, 0.12)",
          border: "rgba(139, 92, 246, 0.25)",
        },
        emerald: {
          DEFAULT: "#10b981",
          soft: "rgba(16, 185, 129, 0.12)",
          light: "#34d399",
        },
      },
      fontFamily: {
        bn: ["var(--font-bengali)", "Hind Siliguri", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "headline-xl": ["40px", { lineHeight: "52px", fontWeight: "700" }],
        "headline-xl-mobile": ["30px", { lineHeight: "40px", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "42px", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "34px", fontWeight: "600" }],
        "headline-md": ["22px", { lineHeight: "30px", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "label-mono-lg": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-mono-md": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-mono-sm": ["10px", { lineHeight: "14px", fontWeight: "400" }],
        "price-display": ["20px", { lineHeight: "26px", fontWeight: "700" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      spacing: {
        gutter: "1.25rem",
        "gutter-desktop": "1.75rem",
        margin: "1rem",
        "margin-tablet": "2rem",
        "margin-desktop": "3.5rem",
      },
      boxShadow: {
        "glow-cyan": "0 0 24px -4px rgba(0, 240, 255, 0.35)",
        "glow-violet": "0 0 30px 0 rgba(139, 92, 246, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
