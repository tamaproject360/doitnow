/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        surface: '#F9F9F9',
        primary: '#FF6B00',
        success: '#34C759',
        textPrimary: '#1C1C1E',
        textSecondary: '#8E8E93',
        separator: '#E5E5EA',
      },
      spacing: {
        'safe': '44px',
      },
    },
  },
  plugins: [],
}
