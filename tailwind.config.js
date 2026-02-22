/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#dbe4fe",
          200: "#bfcffc",
          300: "#93aef9",
          400: "#6085f4",
          500: "#3b5eef",
          600: "#253de4",
          700: "#1d2dd1",
          800: "#1e27aa",
          900: "#1e2685",
        },
      },
    },
  },
  plugins: [],
};
