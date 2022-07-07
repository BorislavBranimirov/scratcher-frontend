/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    colors: {
      primary: 'rgb(var(--color-background-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-background-secondary) / <alpha-value>)',
      hover: {
        1: 'rgb(var(--color-hover) / 0.05)',
        2: 'rgb(var(--color-hover) / 0.1)',
        3: 'rgb(var(--color-hover) / 0.2)',
      },
      accent: 'rgb(var(--color-accent) / <alpha-value>)',
      danger: 'rgb(244, 33, 46)',
      error: 'rgb(244, 33, 46)',
      backdrop: {
        DEFAULT: 'rgb(21, 32, 43)',
        themed: 'rgb(var(--color-backdrop-themed) / 0.8)'
      },
      btn: {
        share: 'rgb(0, 186, 124)',
        like: 'rgb(249, 24, 128)',
      },
      transparent: 'transparent',
      'reply-line': 'rgb(61, 84, 102)',
    },
    textColor: {
      main: 'rgb(var(--color-text-main) / <alpha-value>)',
      muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
      accent: 'rgb(var(--color-accent) / <alpha-value>)',
      'accent-inverted': 'rgb(255, 255, 255)',
      danger: 'rgb(244, 33, 46)',
      error: 'rgb(244, 33, 46)',
      btn: {
        share: 'rgb(0, 186, 124)',
        like: 'rgb(249, 24, 128)',
      },
    },
    borderColor: {
      primary: 'rgb(var(--color-border) / <alpha-value>)',
      'match-background':
        'rgb(var(--color-background-primary) / <alpha-value>)',
    },
    boxShadow: {
      DEFAULT: '0 0 10px rgb(var(--color-shadow) / 0.1)',
      none: 'none',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      strokeWidth: {
        3: '3',
        4: '4',
      },
    },
  },
  plugins: [],
};
