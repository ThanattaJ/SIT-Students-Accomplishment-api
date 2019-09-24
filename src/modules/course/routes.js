const express = require('express')
const router = express.Router()
const { getCourse, createCourse, updateCourse, deleteCourse, getCourseSemester, addCourseSemester, updateCourseSemester, deleteCourseSemester } = require('./controller')

router.get('/', getCourse)
router.post('/', createCourse)
router.patch('/', updateCourse)
router.delete('/', deleteCourse)
router.get('/courseSemester', getCourseSemester)
router.post('/courseSemester', addCourseSemester)
router.patch('/courseSemester', updateCourseSemester)
router.delete('/courseSemester', deleteCourseSemester)
module.exports = router
