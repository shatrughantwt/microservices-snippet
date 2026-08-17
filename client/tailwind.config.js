/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0F16',
        panel: '#161922',
        panel2: '#1D212C',
        line: '#2A2F3D',
        text: '#E6E8F0',
        muted: '#868DA3',
        muted2: '#565C70',
        accent: '#7C9EFF',
        mint: '#5FE3B3',
        amber: '#F2A65A',
        danger: '#F2836A',
        go: '#5FA8FF',
        rust: '#DEA584',
        html: '#E34C26',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
