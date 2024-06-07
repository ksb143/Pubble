/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

const oldConfig = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        pubble: '#1A60FE', // 메인 파랑
        plblue: '#E9F0FF', // 연하늘
        dpubble: '#1A4CEA', // 진한 파랑
        plred: '#FCEAEA', // 연빨강
        plyellow: '#FFFAE8', // 연노랑
        plgreen: '#E8F6ED', // 연초록
        plpurple: '#F5EBFD', // 연보라
        // 코드 색깔
        'code-bg': '#1e1e1e',
        'code-text': '#dcdcdc',
      },
      boxShadow: {
        custom: '0px 0px 8px rgba(0, 0, 0, 0.12)',
      },
      keyframes: {
        'badge-ping': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '33%': { transform: 'scale(2)', opacity: 0 },
          '33.1%, 100%': { transform: 'scale(1)', opacity: 0 },
        },
      },
      animation: {
        // 알림 배지 1초동안 퍼지고, 2초동안 대기, 무한반복
        'badge-ping': 'badge-ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};

const shadcnConfig = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

const _ = require('lodash');

module.exports = {
  content: [...oldConfig.content, ...shadcnConfig.content],
  theme: {
    extend: _.merge({}, oldConfig.theme.extend, shadcnConfig.theme.extend),
  },
  plugins: [...oldConfig.plugins, ...shadcnConfig.plugins],
};
