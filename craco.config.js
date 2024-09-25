const path = require('path');
const process = require('process');

module.exports = {
  devServer: {
    port: parseInt(process.env['PORT'] ?? '4000'),
  },
  webpack: {
    alias: {
      '@luna': path.resolve(__dirname, 'src'),
    },
    output: {
      publicPath: 'auto',
    },
  },
};
