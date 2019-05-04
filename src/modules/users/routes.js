const express = require('express')
const router = express.Router()
const { getUserById, getListStudent, deleteOutsider } = require('./controller')

router.get('/', getUserById)

router.get('/list_student/:code', getListStudent)

router.delete('/:id', deleteOutsider)

module.exports = router
