/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'b': '#27374D',
        'bb': '#526D82',
        'bbb': '#9DB2BF',
        'bbbb': '#DDE6ED'
      },
      boxShadow: {
        'right': '15px 0px 5px -5px rgba(0,0,0,0.3)',
        'left': '-15px 0px 5px -5px rgba(0,0,0,0.3)'
      }
    },
  },
  plugins: [],
}

