import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  context: __dirname,
  entry: {
    main: './src/index.tsx',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    open: true,
  },
  output: {
    path: require('path').resolve(__dirname, 'public'),
    publicPath: '/',
    clean: true,
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    assetModuleFilename: isDev ? '[name][ext]' : '[name].[contenthash:8][ext]',
    cssFilename: isDev ? '[name].css' : '[name].[contenthash:8].css',
    cssChunkFilename: isDev ? '[name].css' : '[name].[contenthash:8].css',
  },
  optimization: {
    minimize: !isDev,
    splitChunks: {
      chunks: 'all',
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react-vendors',
          priority: 20,
          reuseExistingChunk: true,
        },
        heroui: {
          test: /[\\/]node_modules[\\/]@heroui[\\/]/,
          name: 'heroui-vendors',
          priority: 15,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  mode: isDev ? 'development' : 'production',
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
     {
        test: /\.css$/,
        use: ["postcss-loader"],
        type: "css",
        sideEffects: true,
      },
      {
        test: /\.scss$/,
        type: 'css/auto',
        use: [
          {
            loader: 'builtin:sass-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  'chrome >= 87',
                  'edge >= 88',
                  'firefox >= 78',
                  'safari >= 14',
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.PUBLIC_API_URL': JSON.stringify(process.env.PUBLIC_API_URL || 'http://localhost:3002'),
    }),
    new rspack.HtmlRspackPlugin({
      template: './template/index.html',
    }),
    isDev ? new ReactRefreshPlugin() : null,
  ].filter(Boolean),
});