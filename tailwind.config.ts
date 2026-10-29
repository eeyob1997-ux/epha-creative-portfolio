import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0c0a",
        panel: "#151713",
        lime: "#c5ff41",
        muted: "#a5a89f",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        brand: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
