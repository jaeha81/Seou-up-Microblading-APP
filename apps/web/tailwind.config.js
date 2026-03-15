/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf4f0",
          100: "#fbe7dc",
          200: "#f5cbb8",
          300: "#eda58c",
          400: "#e37960",
          500: "#d9563e",  // primary brand
          600: "#c33e2a",
          700: "#a13024",
          800: "#852a23",
          900: "#6e2621",
        },
        gold: {
          300: "#f4d58d",
          400: "#e8bc5a",
          500: "#d4a017",  // accent
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
