// Belhandar marka renkleri: Siyah, Altın, Beyaz + Glassmorphism destekli tasarım sistemi
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bh-black': '#0F0F0F',
        'bh-gold': '#D4AF37',
        'bh-gold-light': '#E8CE7A',
        'bh-white': '#FFFFFF',
        'bh-cream': '#F5F5F0',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E8CE7A 50%, #D4AF37 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        gold: '0 8px 30px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
