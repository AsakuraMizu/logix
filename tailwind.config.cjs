const typography = require('@tailwindcss/typography');
// const forms = require('@tailwindcss/forms');
const logical = require('tailwindcss-logical');
const daisyui = require('daisyui');

/**
 * @type {import("tailwindcss").Config}
 */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [typography, /* forms, */ logical, daisyui],
  darkMode: 'media',
};
