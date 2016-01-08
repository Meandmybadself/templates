let c = {
  server: {
    host: '127.0.0.1',
    port: 3000
  },
  mongo: {
    uri: 'mongodb://127.0.0.1/express-mongoose-api',
    options: {
      db: {
        safe: true
      }
    }
  }
}

module.exports = c
