import type { Config } from "tailwindcss";

// Tokens lifted 1:1 from the Stitch design export
// (luminescent_precision/DESIGN.md)
const config: Config = {
  
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luminescent Precision: light ice-mint canvas, emerald actions
        background: "#F3F8F6",
        surface: "#F3F8F6",
        "surface-lowest": "#FFFFFF",
        "surface-low": "#F0F5F3",
        "surface-container": "#F8FAFC",
        "surface-high": "#EAEFED",
        "surface-highest": "#DEE4E2",
        outline: "#CBD5E1",
        "outline-soft": "#E2E8F0",

        "on-surface": "#0F172A",
        "on-surface-variant": "#334155",
        "on-surface-muted": "#94A3B8",

        // Legacy token names are kept so every page inherits the new palette.
        // cyan = primary emerald, violet = tertiary slate, emerald = electric mint.
        cyan: {
          DEFAULT: "#059669",
          dark: "#047857",
          deep: "#006948",
          soft: "#E6F9F2",
          border: "rgba(0, 210, 133, 0.3)",
        },
        violet: {
          DEFAULT: "#545C72",
          soft: "#EEF1F8",
          border: "rgba(84, 92, 114, 0.25)",
        },
        emerald: {
          DEFAULT: "#00D285",
          soft: "#E6F9F2",
          light: "#047857",
        },
        mint: "#00D285",
        brand: "#0F172A",
        logo: "#0060FF",
      },
      fontFamily: {
        bn: ["var(--font-body)", "var(--font-bengali)", "sans-serif"],
        display: ["var(--font-display)", "var(--font-bengali)", "sans-serif"],
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
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      spacing: {
        gutter: "1.25rem",
        "gutter-desktop": "1.75rem",
        margin: "1rem",
        "margin-tablet": "2rem",
        "margin-desktop": "3.5rem",
      },
      boxShadow: {
        "glow-cyan": "0 8px 20px -4px rgba(0, 210, 133, 0.35)",
        "glow-violet": "0 12px 32px -4px rgba(5, 150, 105, 0.08)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
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
