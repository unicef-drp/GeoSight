const path = require("path");
const BundleTracker = require('webpack-bundle-tracker');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const mode = process.env.npm_lifecycle_event;
const isDev = (mode === 'dev');
const filename = isDev ? "[name]" : "[name].[fullhash]";
const statsFilename = isDev ? './webpack-stats.dev.json' : './webpack-stats.prod.json';
const minimized = !isDev;

let conf = {
  entry: {
    Counter: ['./src/views/Counter.jsx'],
    Dashboard: ['./src/views/Dashboard.jsx'],
    Home: ['./src/views/Home.jsx'],
  },
  output: {
    path: path.resolve(__dirname, "./bundles/frontend"),
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
if (isDev) {
  conf['output'] = {
    path: path.resolve(__dirname, "./bundles"),
    filename: filename + '.js',
    publicPath: 'http://localhost:9000/',
  }
  conf['devServer'] = {
    hot: true,
    port: 9000
  }
  conf['plugins'].push(
    isDev && new ReactRefreshWebpackPlugin()
  )
}
module.exports = conf;