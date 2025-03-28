/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arial: ["Arial", "sans-serif"], // Custom Arial font
      },
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
    },
    // fontFamily: {
    //   // Define custom font families
    //   roboto: ['"Roboto"', 'sans-serif'], // For Google Fonts
    //   customFont: ['"CustomFont"', 'sans-serif'], // For a local font
    // },
  },
  plugins: [],
}

