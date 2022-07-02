/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    colors: {
      primary: 'rgb(21, 32, 43)',
      secondary: 'rgb(25, 39, 52)',
      hover: {
        1: 'rgb(255 255 255 / 0.05)',
        2: 'rgb(255 255 255 / 0.1)',
        3: 'rgb(255 255 255 / 0.2)',
      },
      accent: 'rgb(29, 155, 240)',
      danger: 'rgb(244, 33, 46)',
      error: 'rgb(244, 33, 46)',
      backdrop: 'rgb(21, 32, 43)',
      btn: {
        share: 'rgb(0, 186, 124)',
        like: 'rgb(249, 24, 128)',
      },
      transparent: 'transparent',
      'reply-line': 'rgb(61, 84, 102)',
    },
    textColor: {
      main: 'rgb(255, 255, 255)',
      muted: 'rgb(136, 153, 166)',
      accent: 'rgb(29, 155, 240)',
      danger: 'rgb(244, 33, 46)',
      error: 'rgb(244, 33, 46)',
      btn: {
        share: 'rgb(0, 186, 124)',
        like: 'rgb(249, 24, 128)',
      },
    },
    borderColor: {
      primary: 'rgb(56, 68, 77)',
      'match-background': 'rgb(21, 32, 43)',
    },
    boxShadow: {
      DEFAULT: '0 0 10px rgba(255, 255, 255, 0.1)',
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
