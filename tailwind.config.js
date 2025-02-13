/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        axiforma: ["Axiforma", "sans-serif"],
      },
      fontWeight: {
        bold: "700",
        black: "900",
      },
    },
  },
  plugins: [],
};