const express = require('express')
const router = express.Router()
const controller = require('./controller')
const fileController = require('../files/controller')
const { verifyToken } = require('../authentication/controller')

router.get('/default', controller.getUserDefaultInformation)
router.get('/project', controller.getUserProjectFilterTag)

const uploadImg = fileController.multerImageConfig()
router.patch('/image', verifyToken, uploadImg.single('file'), controller.updateUserImage)

router.get('/generate-resume/:id', verifyToken, controller.getStudentInformation)
router.patch('/generate-resume/:id', verifyToken, controller.updateStudentInformation)
router.patch('/count-generate-resume', verifyToken, controller.updateResemeCounting)
router.patch('/email', verifyToken, controller.updateUserEmail)
router.patch('/languages', verifyToken, controller.updateStudentLanguage)
router.patch('/educations', verifyToken, controller.updateStudentEducation)
router.patch('/skills', verifyToken, controller.updateStudentSkill)
router.patch('/social', verifyToken, controller.updateStudentSocial)

router.get('/list_student/:code', controller.getListStudent)
router.get('/list_lecturer', controller.getListLecturer)
router.get('/languages', controller.getLanguages)
router.get('/education-level', controller.getEducationLevel)
router.get('/skill-level', controller.getSkillLevel)

router.delete('/:outsider_id', controller.deleteOutsider)

module.exports = router
