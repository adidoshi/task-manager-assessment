import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      fontSize: {
        meta: ["11px", { lineHeight: "14px", fontWeight: "400" }],
        badge: ["11px", { lineHeight: "14px", fontWeight: "600" }],
        "body-xs": ["12px", { lineHeight: "18px" }],
        "card-title": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "col-heading": [
          "13px",
          { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.08em" },
        ],
        "page-title": ["24px", { lineHeight: "32px", fontWeight: "700" }],
      },
      colors: {
        canvas: "#F7F7F9",
        surface: "#FFFFFF",
        border: {
          subtle: "#EEF0F3",
          DEFAULT: "#E5E7EB",
        },
        ink: {
          900: "#0F1220",
          700: "#2A2E3F",
          500: "#5B6072",
          400: "#8A8FA3",
          300: "#B7BCCC",
        },
        brand: {
          50: "#F1EEFF",
          100: "#E3DEFF",
          500: "#6A5AF9",
          600: "#5B49F4",
          700: "#4A38DE",
        },
        priority: {
          high: "#FEECEC",
          highFg: "#DC2626",
          med: "#FFF4DB",
          medFg: "#B45309",
          low: "#EEF0FF",
          lowFg: "#4F46E5",
        },
        status: {
          todoBg: "#FFF4DB",
          todoFg: "#B45309",
          progBg: "#E6F1FF",
          progFg: "#2563EB",
          doneBg: "#E7F8EE",
          doneFg: "#16A34A",
        },
        overdue: "#DC2626",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,18,32,0.04), 0 1px 1px rgba(15,18,32,0.03)",
        modal: "0 20px 40px rgba(15,18,32,0.15)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
} satisfies Config;
