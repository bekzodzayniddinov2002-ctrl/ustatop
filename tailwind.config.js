/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // UstaTop brand — pitch deck infografikasidagi neon moviy urg'u
        brand: {
          50: '#e4f8ff',
          100: '#bdefff',
          200: '#85e2ff',
          300: '#4ad3ff',
          400: '#22c3f5',
          500: '#04ade4',
          600: '#008cc2',
          700: '#006d9b',
          800: '#08556f',
          900: '#0b4257',
        },
        // Neytral shkala moviy tomonga siljitilgan — qorong'i rejim
        // infografikadagi tungi ko'k fonni takrorlaydi
        ink: {
          50: '#f4f7fb',
          100: '#e6edf6',
          200: '#cdd9e9',
          300: '#a3b5ce',
          400: '#7286a6',
          500: '#54688a',
          600: '#3d5070',
          700: '#263a56',
          800: '#152840',
          900: '#0b1a2e',
          950: '#050e1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)',
        pop: '0 8px 24px rgba(16,24,40,.12)',
        glow: '0 0 0 1px rgba(34,195,245,.25), 0 0 20px rgba(34,195,245,.18)',
        'glow-sm': '0 0 12px rgba(34,195,245,.22)',
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
