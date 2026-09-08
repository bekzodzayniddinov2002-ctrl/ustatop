/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // UstaTop brand — "teal trust", ish/xizmat sohasiga mos
        brand: {
          50: '#e6f7f5',
          100: '#c3ece7',
          200: '#8adcd3',
          300: '#4fc9bd',
          400: '#22b3a6',
          500: '#00a896',
          600: '#028090',
          700: '#046a77',
          800: '#08525c',
          900: '#0a3f47',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e1',
          300: '#b0b8c6',
          400: '#8590a4',
          500: '#667389',
          600: '#515c70',
          700: '#424b5b',
          800: '#39404d',
          900: '#1c222c',
          950: '#12161d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)',
        pop: '0 8px 24px rgba(16,24,40,.12)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'none' } },
        'pulse-ring': { '0%': { transform: 'scale(.7)', opacity: .8 }, '100%': { transform: 'scale(2.2)', opacity: 0 } },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out both',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
