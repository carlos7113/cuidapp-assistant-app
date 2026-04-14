/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#6C5CE7",
        "secondary": "#0052CC",
        "dark-blue": "#002D72",
        "background": "#FFFFFF",
        "sos-red": "#E74C3C",
      },
      fontFamily: {
        "plus": ["Plus Jakarta Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}
