/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF6",
        ink: "#22282A",
        pine: { DEFAULT: "#1F4E45", dark: "#173B34" },
        brass: "#B9932F",
        correct: { DEFAULT: "#2E7D5B", bg: "#EAF4EF" },
        wrong: { DEFAULT: "#B3402E", bg: "#F9ECE8" },
        line: "#E5E1D6",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      maxWidth: {
        reading: "720px",
      },
    },
  },
  plugins: [],
};
