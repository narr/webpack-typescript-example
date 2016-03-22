var del = require('del');
var path = require('path');
var appPath = path.join(__dirname, 'ts');
var distPath = path.join(__dirname, 'public');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

del.sync(distPath);

module.exports = {
  context: appPath,
  entry: {
    vendor: [
      'jquery', 'director'
    ],
    main: ['./index.ts']
  },
  output: {
    path: distPath,
    filename: 'js/[name].bundle.js?[hash]'
  },
  module: {
    preLoaders: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loaders: ['tslint']
    }],
    loaders: [{
      test: /\.hbs$/,
      loader: 'handlebars?helperDirs[]=' + path.join(__dirname, 'handlebar/helper')
    }, {
      test: /\.tsx?$/,
      loaders: ['ts']
    }]
  },
  tslint: {
    emitErrors: true,
    failOnHint: true
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/[name].bundle.js?[hash]'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true
      },
      template: path.join(appPath, '../index.html'),
      inject: 'body'
    }),
    new webpack.optimize.DedupePlugin(), // https://github.com/webpack/docs/wiki/optimization#deduplication
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true
      }
    }),
    new CopyWebpackPlugin([
      { from: '../css', to: 'css' } // from: relative path to context path
    ])
  ],
  resolve: {
    root: appPath
  },
  bail: true
};
