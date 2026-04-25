export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Outfit', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        orbit: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        cosmic: {
          50:  '#f5f3ff',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        nova: {
          400: '#34d399',
          500: '#10b981',
        },
        ink: {
          900: '#050810',
          950: '#020408',
        }
      },
      boxShadow: {
        'glow-orbit':  '0 0 30px rgba(14,165,233,0.4)',
        'glow-cosmic': '0 0 30px rgba(139,92,246,0.3)',
        'glow-nova':   '0 0 20px rgba(16,185,129,0.3)',
        'card-dark':   '0 4px 24px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        'float':      'float 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'star':       'starTwinkle 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp:     { '0%': { opacity:'0', transform:'translateY(20px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        float:       { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        pulseRing:   { '0%': { transform:'scale(1)', opacity:'1' }, '100%': { transform:'scale(1.8)', opacity:'0' } },
        starTwinkle: { '0%,100%': { opacity:'0.3' }, '50%': { opacity:'1' } },
        shimmer:     { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
      },
    },
  },
  plugins: [],
}
