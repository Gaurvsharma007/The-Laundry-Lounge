/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3dbdbd',
          dark: '#299f9f',
          light: '#e0f4f4'
        },
        secondary: {
          DEFAULT: '#f8f9fa',
          dark: '#1a1a2e'
        },
        accent: '#ff6b6b',
        dark: {
          DEFAULT: '#333333',
          card: '#22223b'
        },
        muted: {
          DEFAULT: '#6c757d',
          dark: '#a0a0b0'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'btn': '0 5px 15px rgba(61, 189, 189, 0.3)',
        'btn-hover': '0 8px 20px rgba(61, 189, 189, 0.4)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      animation: {
        'fade-in-down': 'fadeInDown 1s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
