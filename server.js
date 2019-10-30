const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
var cors = require('cors')
const knex = require('./src/db/knex')
dotenv.config()

const app = express()
const apiRoute = require('./src/routes')
const port = process.env.PORT || 7000

// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', function (req, res) {
  res.status(200).send({
    status: 200,
    message: 'API Work'
  })
})

app.use('/', apiRoute)

app.get('/knex', async function (req, res) {
  const data = await knex.select().from('projects')
  res.send(data)
})

app.listen(port)
