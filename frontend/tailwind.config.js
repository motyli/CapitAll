/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // הגבלה קשיחה לקבצי JS/JSX בלבד
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Assistant"', 'sans-serif'],
      },
      colors: {
        navy: {
          800: '#144491',
          900: '#1d4091',
          950: '#3c5be6', // רקע המערכת המרכזי
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b', // כפתורים והדגשות
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}