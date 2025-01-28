module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 