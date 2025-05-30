import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ECEDEE",
        muted: "#9ca3af",
        tint: "#ffffff",
        icon: "#9BA1A6",
      },
    },
  },
  plugins: [],
};
export default config;