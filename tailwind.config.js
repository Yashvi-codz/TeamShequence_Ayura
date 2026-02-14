// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#27AE60',
        'primary-light': '#E8F5E9',
        'dark-text': '#1A1A1A',
        'gray-text': '#666666',
        cream: '#F5F5F0',
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
};
