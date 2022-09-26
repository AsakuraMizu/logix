const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const logical = require('tailwindcss-logical');

/**
 * @type {import("tailwindcss").Config}
 */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [forms, typography, logical],
  darkMode: 'media',
};
