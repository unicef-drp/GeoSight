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
    Home: ['./src/pages/Home'],
    Login: ['./src/pages/Login'],
    Dashboard: ['./src/pages/Dashboard'],
    DashboardForm: ['./src/pages/Admin/Dashboard/Form'],
    AdminDashboardList: ['./src/pages/Admin/Dashboard/List'],
    AdminIndicatorList: ['./src/pages/Admin/Indicator/List'],
    AdminIndicatorForm: ['./src/pages/Admin/Indicator/Form'],
    AdminBasemapList: ['./src/pages/Admin/Basemap/List'],
    AdminBasemapForm: ['./src/pages/Admin/Basemap/Form'],
    AdminContextLayerList: ['./src/pages/Admin/ContextLayer/List'],
    AdminContextLayerForm: ['./src/pages/Admin/ContextLayer/Form'],

    // INDICATOR MANAGEMENT
    IndicatorValueManagementMap: ['./src/pages/Admin/Indicator/ValueManagementMap'],
    IndicatorValueManagementForm: ['./src/pages/Admin/Indicator/ValueManagementForm'],

    // HARVESTERS
    HarvesterDetail: ['./src/pages/Admin/Harvesters/Detail'],
    MetaIngestor: ['./src/pages/Admin/Harvesters/MetaIngestor'],
    ExposedAPI: ['./src/pages/Admin/Harvesters/ExposedAPI'],
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

// This is for dev
if (isDev) {
  conf['output'] = {
    path: path.resolve(__dirname, "./bundles"),
    filename: filename + '.js',
    publicPath: 'http://localhost:9000/',
  }
  conf['devServer'] = {
    hot: true,
    port: 9000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
  conf['plugins'].push(
    isDev && new ReactRefreshWebpackPlugin()
  )
}
module.exports = conf;