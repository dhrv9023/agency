/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        varah: {
          cyan: '#00f0ff',
          emerald: '#10b981',
          obsidian: '#050608',
          surface: '#0b0c10',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
  plugins: [],
};
