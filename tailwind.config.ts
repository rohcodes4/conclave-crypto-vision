
import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', 'class'],
  theme: {
    extend: {
      textShadow: {
        lg: '2px 2px 4px #ffffff', // white shadow
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      keyframes: {
        fadeInTop: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-top': 'fadeInTop 1s ease-out forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'crypto-bg': '#000000',
        'crypto-card': '#1c1c1c',
        'crypto-accent': '#ff7229',
        'crypto-highlight': '#f2a57c',
        'crypto-success': '#32CE79',
        'crypto-danger': '#E5574B',
        'crypto-muted': '#8A8A8A',
        'crypto-text': '#FFFFFF',
        'crypto-border': '#ff7229',
        'border': 'hsl(var(--border))',
        'border-border': 'hsl(var(--border))',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
} satisfies Config
