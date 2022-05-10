const path = require("path");
var BundleTracker = require('webpack-bundle-tracker');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.npm_lifecycle_event;
let filename = (mode === 'dev') ? "[name]" : "[name].[fullhash]"
let statsFilename = (mode === 'dev') ? './webpack-stats.dev.json' : './webpack-stats.prod.json'
let minimized = mode !== 'dev'

module.exports = {
  entry: {
    Dashboard: ['./src/views/Dashboard.js']
  },
  output: {
    path: path.resolve(__dirname, "./bundles"),
    filename: filename + '.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  optimization: {
    minimize: minimized
  },
  plugins: [
    new BundleTracker({ filename: statsFilename }),
    new MiniCssExtractPlugin({
      filename: filename + '.css',
      chunkFilename: filename + '.css',
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
};