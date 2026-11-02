/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {
      // Neo-brutalist palette. Rule: yellow is the action/fill colour; as text only on ink backgrounds
      // (on light surfaces its contrast is too low). Pink and sky are surface tints for blocks only. Text is always ink.
      colors: {
        paper: { DEFAULT: '#EDEDE6', deep: '#E0E0D6', card: '#FFFFFF' },
        ink: { DEFAULT: '#121212', soft: '#3A3A3A', faint: '#5E5E5E' },
        accent: '#FFD60A',
        pink: '#FF9ECF',
        sky: '#9CC5FF',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'Geist', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      borderWidth: { 3: '3px' },
      boxShadow: {
        brutal: '6px 6px 0 0 #121212',
        'brutal-sm': '3px 3px 0 0 #121212',
        'brutal-lg': '9px 9px 0 0 #121212',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        grow: { from: { transform: 'scaleX(0)' } },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(0.16, 1, 0.3, 1) both',
        grow: 'grow 1s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
}
