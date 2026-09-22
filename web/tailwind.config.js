/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hoangha: {
          green: '#009981',
          'green-dark': '#005944',
          'green-deep': '#004838',
          'green-light': '#e6f7f4',
          'green-badge': '#0d7d6c',
          red: '#9c2738',
          'red-dark': '#86202f',
          'red-gradient-start': '#8b2336',
          'red-gradient-end': '#ba2f48',
          bg: '#f4f6f8'
        }
      }
    },
  },
  plugins: [],
}

