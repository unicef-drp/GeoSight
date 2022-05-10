const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  port: 3000,
  hot: true,
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
};

const compiler = webpack(config);
const server = new webpackDevServer(options, compiler);

server.listen(3000, 'localhost', () => {
  console.log('dev server listening on port 3000');
});