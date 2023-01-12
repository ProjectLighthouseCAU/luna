const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@luna': path.resolve(__dirname, 'src'),
    },
  },
};
