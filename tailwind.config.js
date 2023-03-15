const themes = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./ui/**/*.{html,js}'],
  theme: {
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: '#35353A',
      white: '#FFFFFF',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...themes.fontFamily.sans],
      },
      colors: {
        green: {
          DEFAULT: '#00E67B',
          2: '#17E686',
          3: '#39E596',
          4: '#73E5B0',
          5: '#ACE5CB',
          6: '#CEF2E1',
          7: '#00B360',
          8: '#46a77a',
        },
        blue: {
          DEFAULT: '#408DFF',
          3: '#BFD9FF',
        },
        purple: {
          DEFAULT: '#6640FF',
          2: '#9980FF',
        },
        red: {
          DEFAULT: '#FF4040',
          2: '#FF8080',
          3: '#FFBFBF',
        },
        yellow: {
          DEFAULT: '#FFCC00',
          3: '#FFD840',
          5: '#FFF2BF',
          7: '#BF9500',
        },
        grey: {
          DEFAULT: '#8C8C99',
          2: 'rgba(140, 140, 153, 0.5)',
          3: '#BBBBCC',
          4: '#D2D2DA',
          5: '#DEE4F3',
          6: '#F3F3F9',
          7: '#EEEEF8',
        },
        accent: {
          success: '#CEF2E1',
          warning: '#ffc42d',
          error: '#FFBFBF',
          info: '#4663e2',
        },
        bg: {
          warning: '#fff4c6',
          error: '#FFBFBF',
          info: '#d9ebff',
          success: '#CEF2E1',
        },
      },
      boxShadow: {
        neumorphic:
          '-5px -5px 10px rgba(255, 255, 255, 0.5), 5px 5px 10px rgba(170, 170, 204, 0.15), 10px 10px 20px rgba(170, 170, 204, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.5)',
        input:
          'inset -2px -2px 4px rgba(255, 255, 255, 0.5), inset 2px 2px 4px rgba(170, 170, 204, 0.25), inset 5px 5px 10px rgba(170, 170, 204, 0.2), inset -5px -5px 10px #FFFFFF;',
      },
    },
  },
  plugins: [],
};
