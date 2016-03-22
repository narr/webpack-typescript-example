var path = require('path');
var appPath = path.join(__dirname, 'ts');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: appPath,
  entry: {
    vendor: [
      'jquery', 'director'
    ],
    main: ['./index.ts']
  },
  output: {
    path: path.join(__dirname, 'public'),
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
      template: path.join(appPath, '../index.html'),
      inject: 'body'
    })
  ],
  resolve: {
    root: appPath
  },
  devtool: 'source-map',
  debug: true
};
