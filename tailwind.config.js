/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: { cyan: '#00f5ff', pink: '#ff00ff', green: '#7fff00', orange: '#ff6b00' },
        dark: { 900: '#050510', 800: '#080818', 700: '#0d0d20', 600: '#12122a' },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
