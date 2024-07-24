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
          light: '#F0F0F0',
          DEFAULT: '#FBE233',
          dark: '#D7C4A1',
        },
        'yellow': {
          light: '#FBE233',
          DEFAULT: '#B5A48E',
          dark: '#A69276',
        },
        'text': '#333333', // ダークグレーのテキスト色
      },
    },
  },
  plugins: [],
}