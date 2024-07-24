// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'skin': {
          light: '#F5E6D3',
          DEFAULT: '#E6D5BA',
          dark: '#D7C4A1',
        },
        'brown': {
          light: '#C4B7A6',
          DEFAULT: '#B5A48E',
          dark: '#A69276',
        },
        'text': '#333333', // ダークグレーのテキスト色
      },
    },
  },
  plugins: [],
}