/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff3ed',
          100: '#ffe3d4',
          200: '#ffc2a8',
          300: '#ff9871',
          400: '#ff734e',
          500: '#fe3911',
          600: '#ef1f07',
          700: '#c61108',
          800: '#9d110f',
          900: '#7e1110',
          950: '#440608',
        },
      },
    },
  },
  plugins: [],
};
