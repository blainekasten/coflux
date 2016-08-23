
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

const extractCss = new ExtractTextPlugin('main.css');


module.exports = {
  context: __dirname + '/src',

  entry: './index',
  output: {
    filename: 'index.js',

    // We want to save the bundle in the same directory as the other JS.
    path: __dirname + '/build',
  },

  // Turns on source maps
  // Prefix with a '#' to squash the FF warnings that say:
  // 'Using //@ to indicate sourceMappingURL pragmas is deprecated.
  // Use //# instead'
  //devtool: '#eval-source-map',

  // The 'module' and 'loaders' options tell webpack to use loaders.
  // @see http://webpack.github.io/docs/using-loaders.html
  module: modules(),

  plugins: [
    extractCss,
  ],

  resolve: {
    alias: {
      'coflux': path.resolve(__dirname, '../src/index.js'),
    }
  }
};


function modules(){
  return {
    loaders: [
      { test: /\.css$/, loader: extractCss.extract(['style-loader', 'css-loader?localIdentName=[local]']) },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ]
  };
}
