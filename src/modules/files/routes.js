const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.post('/:id', async (req, res) => {
  res.send('eiri')
})

module.exports = router
