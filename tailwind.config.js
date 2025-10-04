/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", //  enable dark mode toggle with a class
  theme: {
    screens: {
      'xsm': '510px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        gray5: "#333333",
        gray2: "#787474ff",
        gray3: "#e1e1e2",
        white: "#FFFFFF",
        red1 :"#ff0000",
        voilate :"#74419D",
        whitegray :"#f9f9f9",
        gray4 :"#A3A3A3",

        // 🌙 Dark theme colors
        darkBg: "#0f172a",   // background
        darkCard: "#1e293b", // card/bg containers
        darkText: "#f1f5f9", // text
        darkMuted: "#94a3b8", // secondary text
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none', /* IE 10+ */
          'scrollbar-width': 'none',    /* Firefox */
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none',              /* Chrome, Safari */
        },
      });
    },
  ],
};