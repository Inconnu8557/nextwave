/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'success-modal': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.9)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        'success-check': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.5)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.2)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        }
      },
      animation: {
        'success-modal': 'success-modal 0.3s ease-out forwards',
        'success-check': 'success-check 0.5s ease-out forwards 0.2s'
      }
    },
  },
  plugins: [],
} 