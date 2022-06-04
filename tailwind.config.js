module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    colors: {
      transparent: 'transparent',
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgb(25, 39, 52)',
      neutral: 'rgb(21, 32, 43)',
      blue: 'rgb(29, 155, 240)',
      red: 'rgb(244, 33, 46)',
      'reply-line': 'rgb(61, 84, 102)',
    },
    textColor: {
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgb(136, 153, 166)',
      delete: 'rgb(244, 33, 46)',
      'post-btn-default': 'rgb(29, 155, 240)',
      'post-btn-green': 'rgb(0, 186, 124)',
      'post-btn-red': 'rgb(249, 24, 128)',
    },
    borderColor: {
      primary: 'rgb(56, 68, 77)',
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
