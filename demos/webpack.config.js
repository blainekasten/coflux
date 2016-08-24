
/**
 * @see http://webpack.github.io/docs/configuration.html
 * for webpack configuration options
 */


/*
 * Banner Plugin is for code climate
 * @see https://gist.github.com/Ceane/9115471e90f4959e79da
 */
var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: {
    index: './index',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract({fallbackLoader: 'style', loader: ['css-loader?localIdentName=[local]']}) },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ]
  },
  plugins: [
    new ExtractTextPlugin({filename: 'main.css', allChunks: true})
  ],
  resolve: {
    alias: {
      'coflux': path.resolve(__dirname, '../src/index.js'),
    }
  }
};
