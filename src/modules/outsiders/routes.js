const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.delete('/:id', controller.deleteOutsider)

module.exports = router
