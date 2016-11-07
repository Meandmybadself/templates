const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'src/index.js'),
    path.join(__dirname, 'src/index.scss')
  ],
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
    filename: 'javascripts/[name]-[hash].min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({template: path.join(__dirname, 'src/index.html'), minify: {collapseWhitespace: true}}),
    new ExtractTextPlugin('stylesheets/[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false, screw_ie8: true}}),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
    new StatsPlugin('webpack.stats.json', {source: false, modules: false})
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'url?limit=25000&name=assets/images/[name].[ext]',
        include: path.join(__dirname, 'assets/images')
      },
      {
        test: /\.svg$/,
        loader: 'file?name=assets/images/[name].[ext]',
        include: path.join(__dirname, 'assets/images')
      }
    ]
  }
}
