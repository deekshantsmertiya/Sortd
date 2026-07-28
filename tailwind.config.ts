import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sortd: {
          yellow: "#F5C518",
          "yellow-hover": "#E5B60B",
          navy: "#1C2B6B",
          "navy-dark": "#121C47",
          pink: "#E8447C",
          "pink-hover": "#D6336B",
          black: "#111111",
          grey: "#6B6B6B",
          "grey-light": "#9E9E9E",
          "off-white": "#F7F7F8",
          "card-bg": "#FAFAFB",
          border: "#EAEAEA",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Montserrat", "sans-serif"],
        body: ["var(--font-body)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        'sortd': '12px',
        'sortd-lg': '18px',
        'pill': '9999px',
      },
      boxShadow: {
        'sortd-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'sortd-md': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'sortd-hover': '0 12px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
