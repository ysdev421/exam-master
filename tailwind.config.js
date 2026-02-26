/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        'slide-in-up':    'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pop-in':         'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'shake':          'shake 0.45s ease-in-out',
        'correct-flash':  'correctFlash 0.6s ease-out',
        'float-up':       'floatUp 0.8s ease-out forwards',
        'streak-pop':     'streakPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'score-count':    'scoreCount 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        slideInUp:    { from: { transform: 'translateY(24px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        popIn:        { '0%': { transform: 'scale(0.75)', opacity: '0' }, '70%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shake:        { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-10px)' }, '40%': { transform: 'translateX(10px)' }, '60%': { transform: 'translateX(-6px)' }, '80%': { transform: 'translateX(6px)' } },
        correctFlash: { '0%': { boxShadow: '0 0 0 0 rgba(52,211,153,0.7)' }, '70%': { boxShadow: '0 0 0 16px rgba(52,211,153,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(52,211,153,0)' } },
        floatUp:      { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(-48px)', opacity: '0' } },
        streakPop:    { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.5)' }, '100%': { transform: 'scale(1)' } },
        scoreCount:   { from: { transform: 'scale(0.5) translateY(12px)', opacity: '0' }, to: { transform: 'scale(1) translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
