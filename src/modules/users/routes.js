const express = require('express')
const router = express.Router()
const { getUserById, getListStudent } = require('./controller')

router.get('/', getUserById)

router.get('/list_student/:code', getListStudent)

module.exports = router
