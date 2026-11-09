import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050606",
        panel: "#0d0e0d",
        amber: "#ffa94d",
        "amber-light": "#ffc46b",
        "amber-dark": "#ff6a3d",
        lime: "#a3e635",
        muted: "#737373",
      },
      fontFamily: {
        sans:   ["var(--font-space-grotesk)", "sans-serif"],
        brand:  ["var(--font-space-grotesk)", "sans-serif"],
        serif:  ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
