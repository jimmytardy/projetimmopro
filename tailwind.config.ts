import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    screens: {
      sm:   '640px',
      md:   '768px',
      lg:   '1024px',
      xl:   '1280px',
      '2xl': '1536px',
      // Breakpoint personnalisé : viewport assez large pour les skyscrapers latéraux
      // contenu max-w-5xl (1024px) + 2 × 160px pub + 2 × 24px gouttières = ~1416px
      '3xl': '1500px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4F8C',
          50:  '#E8EFF8',
          100: '#C5D5EC',
          200: '#A2BBE0',
          300: '#7FA1D4',
          400: '#4B7BBF',
          500: '#2563AB',
          600: '#1B4F8C',
          700: '#153E6F',
          800: '#0F2D52',
          900: '#091C35',
        },
        accent: {
          DEFAULT: '#0F6E56',
          50:  '#E6F4F1',
          100: '#B3DDD6',
          200: '#80C7BB',
          300: '#4DB0A0',
          400: '#1A9985',
          500: '#14917A',
          600: '#0F6E56',
          700: '#0B5242',
          800: '#07372D',
          900: '#031B18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
