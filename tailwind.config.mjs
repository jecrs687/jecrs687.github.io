/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with the 'class' strategy
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        sakura: {
          100: '#fff0f7',
          200: '#ffd6e8',
          300: '#ffadcf',
          400: '#ff85b3',
          500: '#ff5c98',
          600: '#ff337d',
          700: '#f01965',
          800: '#d10952',
          900: '#a30642',
        },
        cyber: {
          100: '#e0f7ff',
          200: '#bae8ff',
          300: '#7dd5fb',
          400: '#38bff8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        matcha: {
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
        },
        fuji: {
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        anime: ['"M PLUS Rounded 1c"', 'Inter', 'sans-serif'],
        code: ['"Fira Code"', 'monospace'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
        kr: ['"Noto Sans KR"', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'waving': 'waving 2s ease-in-out infinite',
        'glitch': 'glitch 1s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'sakura-fall': 'sakura-fall 10s linear infinite',
        'sakura-sway': 'sakura-sway 3s ease-in-out infinite alternate',
        'cyber-flicker': 'cyber-flicker 2s linear infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'breathing': 'breathing 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        waving: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right bottom'
          }
        },
        'sakura-fall': {
          '0%': { 
            transform: 'translateY(-10%) rotate(0deg)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0.6'
          }
        },
        'sakura-sway': {
          '0%': { transform: 'translateX(-5px)' },
          '100%': { transform: 'translateX(5px)' }
        },
        'cyber-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '25%, 75%': { opacity: '0.9' }
        },
        'matrix-rain': {
          '0%': { 
            top: '-10%',
            opacity: '1' 
          },
          '100%': { 
            top: '100%', 
            opacity: '0' 
          }
        },
        'breathing': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      },
      backgroundImage: {
        'sakura-pattern': "url('/src/assets/patterns/sakura-pattern.png')",
        'cyber-grid': "linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)",
        'cyber-circuit': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"%3E%3Cpath d=\"M15 0 L15 35 L35 35 L35 0 M65 0 L65 35 L85 35 L85 0 M15 65 L15 100 L35 100 L35 65 M65 65 L65 100 L85 100 L85 65 M0 15 L35 15 L35 35 L0 35 M65 15 L100 15 L100 35 L65 35 M0 65 L35 65 L35 85 L0 85 M65 65 L100 65 L100 85 L65 85 M40 40 L40 60 L60 60 L60 40 L40 40\" fill=\"none\" stroke=\"%230ea5e920\" stroke-width=\"1\"/%3E%3C/svg%3E')",
        'bamboo-pattern': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%2384cc16\" fill-opacity=\"0.2\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm20 0l2.83-2.83 1.41 1.41L21.41 4.24h-1.41V3.07zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zM20 7.93l2.83-2.83 1.41 1.41-2.83 2.83H20V7.93zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41z\"%3E%3C/path%3E%3C/g%3E%3C/svg%3E')",
        'library-shelves': "repeating-linear-gradient(to bottom, transparent 0px, transparent 20px, rgba(139, 92, 246, 0.07) 20px, rgba(139, 92, 246, 0.07) 40px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        'cyber-grid': '30px 30px',
        'cyber-circuit': '100px 100px',
      },
      borderRadius: {
        'anime': '30% 70% 70% 30% / 30% 30% 70% 70%', // Anime-style blob shape
      },
      boxShadow: {
        'neon-sakura': '0 0 5px rgba(255, 92, 152, 0.5), 0 0 20px rgba(255, 92, 152, 0.3)',
        'neon-cyber': '0 0 5px rgba(14, 165, 233, 0.5), 0 0 20px rgba(14, 165, 233, 0.3)',
        'neon-matcha': '0 0 5px rgba(132, 204, 22, 0.5), 0 0 20px rgba(132, 204, 22, 0.3)',
        'neon-fuji': '0 0 5px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.5)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
