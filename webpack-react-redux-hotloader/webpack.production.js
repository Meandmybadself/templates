const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname, './src'),
  devtool: 'source-map',
  entry: [
    './index.js',
    './index.scss'
  ],
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
    filename: 'javascripts/[name]-[hash].min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PRODUCTION: 1
      }
    }),
    new HtmlWebpackPlugin({template: 'raw-loader!src/index.html', minify: {collapseWhitespace: true}}),
    new ExtractTextPlugin('stylesheets/[name]-[hash].min.css'),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
    new webpack.optimize.UglifyJsPlugin({sourceMap: true, compressor: {screw_ie8: true}}),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new StatsPlugin('webpack.stats.json', {source: false, modules: false})
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'assets/images/[name].[ext]'
          }
        }]
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/images/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /assets\/fonts/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[name].[ext]'
          }
        }]
      }
    ]
  }
}
