const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.development')

const server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: false,
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    color: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  }
})

server.listen(3000, 'localhost', error => {
  if (error) console.log(error)

  console.log('Listening at localhost:3000')
})
