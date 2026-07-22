/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1E40AF',
        'brand-lila': '#7C3AED',
        'brand-gray': '#475569',
        'brand-bg': '#FFFFFF',
        'brand-surface': '#F8FAFC',
        'sos-red': '#E74C3C',
      },
      borderRadius: {
        'card': '2.5rem',
        'button': '1.5rem',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'logo': ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
