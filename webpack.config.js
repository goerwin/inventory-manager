const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

const PORT = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'production';
const isProd = environment === 'production';

console.log('ENVIRONMENT:', environment);

const distFolder = path.resolve(__dirname, 'dist');

const OBJECT = 'object';
const ARRAY = 'array';

function insertIf(condition, type, element) {
  if (type === ARRAY) {
    return condition ? [element] : [];
  } else if (type === OBJECT) {
    return condition ? element : {};
  }

  return null;
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  target: 'electron-renderer',
  devtool: isProd ? 'source-map' : 'inline-source-map',

  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    port: PORT,
    contentBase: distFolder,
  },

  entry: {
    index: path.resolve(__dirname, 'src/renderer/index.tsx'),
  },

  output: {
    path: distFolder,
    publicPath: '/',
    filename: isProd ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
          },
        },
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]/[name].[contenthash].[ext]',
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          ...insertIf(!isProd, ARRAY, 'style-loader'),
          ...insertIf(isProd, ARRAY, {
            loader: MiniCssExtractPlugin.loader,
          }),
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: isProd
                  ? '[contenthash:base64]'
                  : '[path][name]_[local]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-nested', {}]],
              },
            },
          },
        ],
      },
      {
        test: /\.font\.js$/,
        use: [
          ...insertIf(!isProd, ARRAY, 'style-loader'),
          ...insertIf(isProd, ARRAY, {
            loader: MiniCssExtractPlugin.loader,
          }),
          {
            loader: 'css-loader',
            options: { url: false },
          },
          'webfonts-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|ico|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isProd
                ? 'images/[name].[contenthash].[ext]'
                : 'images/[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disabled: !isProd,
              gifsicle: {
                enabled: false,
              },
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/renderer/index.html'),
    }),
    ...insertIf(
      isProd,
      ARRAY,
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].css',
        ignoreOrder: false,
      })
    ),
    ...insertIf(
      isProd,
      ARRAY,
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|jpg|png|gif|svg|woff|ico)$/,
        minRatio: 0.9,
      })
    ),
    ...insertIf(
      isProd,
      ARRAY,
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: path.resolve(distFolder, 'bundleAnalyzer.html'),
        openAnalyzer: false,
      })
    ),
  ],
};
