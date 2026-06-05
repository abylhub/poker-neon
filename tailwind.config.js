/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vc: {
          pink:   '#ff2d78',
          teal:   '#00d4ff',
          purple: '#9d00ff',
          coral:  '#ff6b35',
          gold:   '#ffd166',
          bg:     '#0d0818',
          bg2:    '#120d1f',
          bg3:    '#1a1230',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],       // UI labels, nav
        casino:  ['Cinzel', 'serif'],               // 80s casino headings
        body:    ['Rajdhani', 'sans-serif'],         // body text
        mono:    ['JetBrains Mono', 'monospace'],    // numbers
      },
    },
  },
  plugins: [],
}
