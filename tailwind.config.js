/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cp: {
          bg:     '#07050f',
          bg2:    '#0d0a1a',
          bg3:    '#120f22',
          pink:   '#ff2d78',
          green:  '#00ff9f',
          gold:   '#ffd700',
          blue:   '#00cfff',
          purple: '#8b00ff',
          border: 'rgba(255,45,120,0.2)',
        },
      },
      fontFamily: {
        // Gotham = Montserrat (same designer, same proportions)
        sans:    ['Montserrat', 'system-ui', 'sans-serif'],
        // Century Gothic = Josefin Sans
        display: ['Josefin Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
