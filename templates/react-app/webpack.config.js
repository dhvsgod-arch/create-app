import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const __dirname = path.resolve(); // ESModule 下获取 __dirname

const isProd = process.env.NODE_ENV === 'production';

export default {
  mode: isProd ? 'production' : 'development',

  entry: path.resolve(__dirname, 'src/index.tsx'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    chunkFilename: isProd ? 'js/[name].[contenthash:8].chunk.js' : 'js/[name].chunk.js',
    publicPath: '/',
    clean: true, // 自动清理 dist 目录
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      // TS / TSX
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: { transpileOnly: true }, // 类型检查交给 ForkTsCheckerWebpackPlugin
          },
        ],
        exclude: /node_modules/,
      },

      // CSS / SCSS
      {
        test: /\.css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },

      // 静态资源（图片 / 字体）
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
        generator: { filename: 'images/[name].[hash:8][ext]' },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name].[hash:8][ext]' },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      inject: 'body',
      minify: isProd ? { removeComments: true, collapseWhitespace: true } : false,
    }),
    isProd && new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' }),
    new ForkTsCheckerWebpackPlugin({
      async: !isProd,
      typescript: { configFile: path.resolve(__dirname, 'tsconfig.json') },
    }),
    new ESLintPlugin({ extensions: ['ts', 'tsx', 'js', 'jsx'], fix: true, emitWarning: !isProd }),
  ].filter(Boolean),

  devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

  devServer: {
    static: path.resolve(__dirname, 'public'),
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  },
};
