/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      animation: {
        'up-down': 'up-down 1s',
      },
      keyframes: {
        'up-down': {
          '0%': {
            transform: 'translateY(40%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '35%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
