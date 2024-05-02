/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        pubble: '#1A60FE', // 메인 파랑
        plblue: '#E9F0FF', // 연하늘
        plred: '#FCEAEA', // 연빨강
        plyellow: '#FFFAE8', // 연노랑
        plgreen: '#E8F6ED', // 연초록
        plpurple: '#F5EBFD', // 연보라
      },
      boxShadow: {
        custom: '0px 0px 8px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
