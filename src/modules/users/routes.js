const express = require('express')
const router = express.Router()
const { getUserDefaultInformation, getUserInformation, getListStudent, deleteOutsider, updateUserInformation, updateUserEmail, updateUserImage, getEducationLevel, getLanguages } = require('./controller')
const fileController = require('../files/controller')

router.get('/', getUserDefaultInformation)
router.patch('/email', updateUserEmail)

const uploadImg = fileController.multerImageConfig()
router.patch('/image', uploadImg.single('file'), updateUserImage)

router.get('/generate-resume', getUserInformation)
router.patch('/generate-resume', updateUserInformation)

router.get('/list_student/:code', getListStudent)
router.get('/languages', getLanguages)
router.get('/education-level', getEducationLevel)

router.delete('/:outsider_id', deleteOutsider)

module.exports = router
