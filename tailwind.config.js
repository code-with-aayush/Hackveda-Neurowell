/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecf4ff', // Lightest Blue
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#0054A6', // Max Blue (Primary Brand)
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          DEFAULT: '#F37021', // Max Orange
          hover: '#e0651b',
        },
        sidebar: {
          bg: '#ffffff', // White sidebar for clinical look
          text: '#334155', // Slate-700
          active: '#eff6ff', // Light blue background
          border: '#e2e8f0', // Slate-200
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
