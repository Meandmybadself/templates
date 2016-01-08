let express = require('express')
let mongoose = require('mongoose')
let config = require('./config/config.js')

// Connect to MongoDB for reusable connection throughout app
let db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
require('./models/index.js')

// Create Express app, configure and setup routing
let app = express()
require('./config/express.js')(app)
require('./routes/index.js')(app)

// Kickoff HTTP server
app.listen(config.server.port, config.server.host, () => {
  console.log(`express-mongoose-api server listening on ${config.server.host}:${config.server.port}`)
})
