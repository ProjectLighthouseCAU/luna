const { nextui } = require('@nextui-org/react');
const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    path.join(
      // Use `require.resolve` to locate `node_modules/@nextui-org/theme`
      // dynamically (node_modules might be in a parent directory if luna is
      // part of an npm workspace, as e.g. in luna-desktop)
      path.dirname(require.resolve('@nextui-org/theme/package.json')),
      'dist/**/*.{js,ts,jsx,tsx}'
    ),
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
