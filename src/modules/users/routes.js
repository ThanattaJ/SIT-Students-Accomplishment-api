const express = require('express')
const router = express.Router()
const { getUserDefaultInformation, getStudentInformation, getListStudent, getListLecturer, deleteOutsider, updateStudentInformation, updateUserEmail, updateUserImage, getEducationLevel, getLanguages } = require('./controller')
const fileController = require('../files/controller')

router.get('/default', getUserDefaultInformation)
router.patch('/email', updateUserEmail)

const uploadImg = fileController.multerImageConfig()
router.patch('/image', uploadImg.single('file'), updateUserImage)

router.get('/generate-resume/:id', getStudentInformation)
router.patch('/generate-resume/:id', updateStudentInformation)

router.get('/list_student/:code', getListStudent)
router.get('/list_lecturer', getListLecturer)
router.get('/languages', getLanguages)
router.get('/education-level', getEducationLevel)

router.delete('/:outsider_id', deleteOutsider)

module.exports = router
