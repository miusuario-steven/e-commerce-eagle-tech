/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        galaxyStart: '#1a0319',
        galaxyMid: '#1c011f',
        galaxyEnd: '#0a040d',
        galaxyBurst: '#603970'
      },
      animation: {
        gradient: 'gradient 20s ease infinite',
        'fade-slide-up': 'fade-slide-up 0.8s ease-out both',
        'spin-slow': 'spin 40s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
            backgroundSize: '400% 400%' // ✅ Necesario para el efecto
          },
          '50%': {
            backgroundPosition: '100% 50%',
            backgroundSize: '400% 400%' // ✅ Necesario para el efecto
          },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'neon-violet': '0 0 8px #a855f7, 0 0 16px #a855f7',
      }
    }
  },
  plugins: [],
};