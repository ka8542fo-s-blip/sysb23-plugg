/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Färgerna läses från CSS-variablerna i index.css, så att de byter
      // med temat (ljust/mörkt) och ändå tar opacitet (text-ink/70).
      colors: {
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        pine: {
          DEFAULT: "rgb(var(--pine-rgb) / <alpha-value>)",
          dark: "rgb(var(--pine-dark-rgb) / <alpha-value>)",
        },
        brass: {
          DEFAULT: "rgb(var(--brass-rgb) / <alpha-value>)",
          text: "rgb(var(--brass-text-rgb) / <alpha-value>)",
        },
        correct: {
          DEFAULT: "rgb(var(--correct-rgb) / <alpha-value>)",
          bg: "rgb(var(--correct-bg-rgb) / <alpha-value>)",
        },
        wrong: {
          DEFAULT: "rgb(var(--wrong-rgb) / <alpha-value>)",
          bg: "rgb(var(--wrong-bg-rgb) / <alpha-value>)",
          dark: "rgb(var(--wrong-dark-rgb) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line-rgb) / <alpha-value>)",
          strong: "rgb(var(--line-strong-rgb) / <alpha-value>)",
        },
        shade: "rgb(var(--shade-rgb) / <alpha-value>)",
        code: {
          DEFAULT: "rgb(var(--code-rgb) / <alpha-value>)",
          ink: "rgb(var(--code-ink-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      maxWidth: {
        reading: "45rem",
      },
    },
  },
  plugins: [],
};
