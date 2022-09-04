module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '.75rem',
        '3xs': '.5rem',
      },
      colors: {
        'TDBlue': '#598FD1',
        'TDRed': '#E086BC',
        'TDGreen': '#81CCB1',
        'TDLightBlue': '#E7F0FF'
      },
      maxWidth: {
        'xss': '5rem',
      }
    },
  },
  plugins: [

  ],
}
