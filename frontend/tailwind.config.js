/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maritime: {
          50: '#f5fbff',
          100: '#eaf7ff',
          200: '#d5f0ff',
          300: '#aee8ff',
          400: '#7fd6ff',
          500: '#34bfe6',
          600: '#0ea5d9',
          700: '#0b8fb8',
          800: '#096b8a',
          900: '#054855'
        },
        accent: {
          500: '#0f172a',
          600: '#0b1321'
        }
      },
    },
  },
  plugins: [],
}