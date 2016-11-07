const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'src/index.js'),
    path.join(__dirname, 'src/index.scss')
  ],
  output: {
    path: '/',
    publicPath: 'http://localhost:3000/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({template: path.join(__dirname, 'src/index.html')}),
    new webpack.HotModuleReplacementPlugin({multiStep: true}),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')})
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
        loaders: ['style', 'css?sourceMap', 'resolve-url', 'sass?sourceMap']
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'url?limit=25000',
        include: path.join(__dirname, 'assets/images')
      },
      {
        test: /\.svg$/,
        loader: 'file',
        include: path.join(__dirname, 'assets/images')
      }
    ]
  }
}
