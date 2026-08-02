/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#080b10",
          900: "#0d1119",
          800: "#141a24",
          700: "#1c2431",
          600: "#2a3444",
        },
        line: "#2a3444",
      },
      fontFamily: {
        display: ["Fjalla One", "Arial Narrow", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
