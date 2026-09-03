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
          50: '#faf8f5',
          100: '#f3efe6',
          200: '#e7e0d2',
          300: '#d5c9b6',
          400: '#ab9a83',
          500: '#7e6e5a',
          600: '#5c4f3f',
          700: '#3f352a',
          800: '#272420',
          850: '#1f1c18',
          900: '#181613',
          950: '#12110f',
        },
        terracotta: {
          300: '#e89a65',
          400: '#dc8045',
          500: '#c8672b',
          600: '#a74d1a',
        },
        sage: {
          400: '#82ab8d',
          500: '#638c6e',
          600: '#4c7056',
        },
        brand: {
          50: '#fbf9f6',
          100: '#f3eee4',
          200: '#e6dbca',
          300: '#d5c1a7',
          400: '#c4a37f',
          500: '#b28659',
          600: '#9d6e43',
          700: '#7e5332',
          800: '#603e26',
          900: '#442b1b',
          950: '#27170c',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif Thai"', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Prompt', '"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
