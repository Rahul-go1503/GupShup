import { themes } from './src/utils/themes.js';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("tailwindcss-animate"), require('daisyui'),],
  extend: {
    gridTemplateRows: {
      // Simple 16 row grid
      '24': 'repeat(24, minmax(0, 1fr))',
    }
  },
  daisyui: { themes: themes },
};
