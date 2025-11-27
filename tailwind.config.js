/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-dark': '#1a1a2e',
        'game-primary': '#16213e',
        'game-secondary': '#0f3460',
        'game-accent': '#00d9ff',
        'game-highlight': '#ff00ff',
      },
    },
  },
  plugins: [],
}
