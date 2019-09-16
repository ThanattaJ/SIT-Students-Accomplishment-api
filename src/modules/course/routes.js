const express = require('express')
const router = express.Router()
const { getCourse, createCourse, updateCourse, deleteCourse } = require('./controller')

router.get('/', getCourse)
router.post('/', createCourse)
router.patch('/', updateCourse)
router.delete('/', deleteCourse)
module.exports = router
