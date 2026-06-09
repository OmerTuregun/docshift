import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1D3461",
          teal: "#1A9BA1",
          "teal-light": "#4BBFC4",
          "teal-bg": "#d0f0f2",
          "navy-bg": "#e8ecf4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;
