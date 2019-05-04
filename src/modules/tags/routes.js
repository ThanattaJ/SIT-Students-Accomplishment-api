const express = require('express')
const router = express.Router()
const { getTagByCharacter } = require('./controller')

router.get('/:character', getTagByCharacter)

module.exports = router
