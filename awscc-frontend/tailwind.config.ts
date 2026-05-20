import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:        '#101419',
          light:       '#F7F7F7',
          orange:      '#FFAA2B',
          navy:        '#1B4170',
          black:       '#0D0D0D',
          offwhite:    '#F2F3F3',
          'orange-muted': '#FFC874',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans:    ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'float-slow':   'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast':   'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
