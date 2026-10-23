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
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        rect: '8px',
        DEFAULT: '8px',
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'surface-subtle': 'var(--surface-subtle)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        varah: {
          cyan: '#00f0ff',
          blue: '#0284c7',
          emerald: '#10b981',
          obsidian: '#050608',
          warm: '#F3F3F0',
          surface: '#0b0c10',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
  plugins: [],
};
