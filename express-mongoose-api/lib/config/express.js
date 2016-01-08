let morgan = require('morgan')
let bodyParser = require('body-parser')
let cors = require('cors')

module.exports = function(app) {

  app.disable('x-powered-by')
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cors())

  app.use(morgan('dev'))

  app.options('*', cors())

}
