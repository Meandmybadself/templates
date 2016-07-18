const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/config.js')

// Connect to MongoDB for reusable connection throughout app
mongoose.connect(config.mongo.uri, config.mongo.options)

// Bootstrap models
require('./models/index.js')

// Create Express app, configure and setup routing
const app = express()
require('./config/express.js')(app)
require('./routes/index.js')(app)

// Kickoff HTTP server
app.listen(config.server.port, config.server.host, () => {
  console.log(`${config.appName} listening on ${config.server.host}:${config.server.port}`)
})
