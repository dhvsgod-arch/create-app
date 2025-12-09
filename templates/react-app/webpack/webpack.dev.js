import path from 'path';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import common from './webpack.common.js';

const __dirname = path.resolve();

export default merge(common, {
  mode: 'development',

  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: { loader: 'tsx', target: 'es2017' },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                exportLocalsConvention: 'asIs',
              },
              esModule: false,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        exclude: /\.module\.scss$/,
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      inject: 'body',
      minify: false,
    }),
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      typescript: { configFile: path.resolve(__dirname, './tsconfig.json') },
    }),
    new ESLintPlugin({ extensions: ['ts', 'tsx', 'js', 'jsx'], fix: true, emitWarning: true }),
  ].filter(Boolean),

  devtool: 'cheap-module-source-map',

  devServer: {
    static: path.resolve(__dirname, './public'),
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
});
