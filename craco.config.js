const path = require('path');
const process = require('process');

module.exports = {
  devServer: {
    client: {
      overlay: {
        runtimeErrors: error => {
          // NOTE: We forward ResizeObserver errors to the console, these seem
          // to come from framer-motion during the card flip on the login
          // screen. According to https://stackoverflow.com/a/77591424 we
          // shouldn't worry about this in our production build, so we'll just
          // adopt the workaround from https://stackoverflow.com/a/77914968 and
          // ignore these errors in dev builds.
          if (error?.message.startsWith('ResizeObserver')) {
            return false;
          }
          return true;
        },
      },
    },
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
