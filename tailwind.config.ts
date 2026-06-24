/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true, // Giúp Tailwind thắng Antd CSS specificity
  corePlugins: {
    preflight: false, // Tắt CSS reset của Tailwind để tránh conflict với Antd
  }
};
