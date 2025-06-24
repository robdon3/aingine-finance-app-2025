/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cassette: {
          50: '#f4f6fa', // off-white
          100: '#e9ecf3',
          200: '#c7d0e0',
          300: '#a3b3c7',
          400: '#7e97b0',
          500: '#5a7a99', // muted blue
          600: '#3d5c7a', // deep blue
          700: '#2c4257',
          800: '#1b2935',
          900: '#10151b', // near-black
        },
        teal: {
          400: '#4fd1c5', // pastel teal
          500: '#38b2ac',
        },
        orange: {
          400: '#f6ad55', // pastel orange
          500: '#ed8936',
        },
        magenta: {
          400: '#f472b6', // pastel magenta
          500: '#d53f8c',
        },
        green: {
          400: '#68d391', // pastel green
          500: '#38a169',
        },
        yellow: {
          400: '#faf089', // pastel yellow
          500: '#ecc94b',
        },
        // Keep aegis and liberty for accent
        aegis: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        liberty: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fbd7ac',
          300: '#f8bb77',
          400: '#f59540',
          500: '#f2751a',
          600: '#e35d10',
          700: '#bc4510',
          800: '#963814',
          900: '#7a3014',
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'Menlo', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 