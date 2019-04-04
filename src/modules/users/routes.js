const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.get('/', async (req, res) => {
  const data = await controller.getuUserById(req.body)
  res.send(data)
})

module.exports = router
