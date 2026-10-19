/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#121014",
          light: "#1B1820",
          lighter: "#26222C",
        },
        maroon: {
          DEFAULT: "#7A1F2B",
          dark: "#571620",
          light: "#9A2E3B",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E1C158",
          dark: "#9C7C1B",
        },
        ivory: "#F3EDE3",
      },
      fontFamily: {
        display: ["\"Cormorant Garamond\"", "serif"],
        body: ["\"Inter\"", "sans-serif"],
      },
      backgroundImage: {
        "royal-gradient": "linear-gradient(135deg, #7A1F2B 0%, #4A131B 100%)",
      },
    },
  },
  plugins: [],
};
