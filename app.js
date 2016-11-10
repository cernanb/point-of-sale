const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const controllers = require('./controllers')
const db = require('./models/db')

db.setup()

app.use(bodyParser.json())
app.use(controllers)

http.listen(3000, () => {
    console.log('listening on port 3000')
})
