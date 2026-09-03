/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#b0b0b5',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#3a3a3c',
          800: '#2c2c2e',
          850: '#242426',
          900: '#1c1c1e',
          950: '#0b0b0c',
        },
        terracotta: {
          300: '#8cc8ff',
          400: '#5ac8fa',
          500: '#2997ff',
          600: '#0077ed',
        },
        sage: {
          400: '#54d174',
          500: '#34c759',
          600: '#248a3d',
        },
        brand: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#b0b0b5',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#3a3a3c',
          800: '#2c2c2e',
          900: '#1c1c1e',
          950: '#0b0b0c',
        }
      },
      fontFamily: {
        serif: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"SFMono-Regular"', 'JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
