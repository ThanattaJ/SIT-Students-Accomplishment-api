const express = require('express')
const router = express.Router()
const { getUserDefaultInformation, getUserById, getListStudent, deleteOutsider, updateUserInformation, updateUserEmail, updateUserImage } = require('./controller')
const fileController = require('../files/controller')

router.get('/', getUserDefaultInformation)
router.patch('/email', updateUserEmail)

const uploadImg = fileController.multerImageConfig()
router.patch('/image', uploadImg.single('file'), updateUserImage)
router.get('/generate-resume', getUserById)
router.patch('/generate-resume', updateUserInformation)

router.get('/list_student/:code', getListStudent)

router.delete('/:outsider_id', deleteOutsider)

module.exports = router
