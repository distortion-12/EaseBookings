/*
 * This file contains the Tailwind CSS configuration.
 * It defines the content paths for purging unused styles, extends the default theme (e.g., adding the 'Outfit' font), and includes necessary plugins.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Set Outfit as the primary sans-serif font for the application.
        sans: ['Outfit', 'sans-serif'], 
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};