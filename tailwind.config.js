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
        primary: '#27AE60',
        'primary-light': '#A8D5BA',
        cream: '#F5F5F0',
        'dark-text': '#2C3E50',
        'gray-text': '#7F8C8D',
        vata: '#E8B4B8',
        pitta: '#F9D76C',
        kapha: '#B8D8C8',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
