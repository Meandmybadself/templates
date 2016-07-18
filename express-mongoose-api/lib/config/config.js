const appName = require('../../package.json').name

let c = {
  appName: appName,
  server: {
    host: '127.0.0.1',
    port: 3000
  },
  mongo: {
    uri: `mongodb://127.0.0.1/${appName}`,
    options: {
      db: {
        safe: true
      }
    }
  }
}

module.exports = c
