const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      theme: {
        extend: {},
      },
    },
    ...(isDev ? {} : {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeUnicode: false,
        }],
      },
    }),
  },
};
