const express = require('express')
const router = express.Router()
const controller = require('./controller')

const uploadImg = controller.multerImageConfig()
router.post('/image', uploadImg.single('file'), controller.uploadProjectImage)

const uploadDoc = controller.multerDocumentConfig()
router.post('/document', uploadDoc.single('file'), controller.uploadProjectDocument)

router.get('/image/:project_id', controller.getCover)
router.delete('/image', controller.deleteProjectImage)
router.delete('/document', controller.deleteProjectDocument)

module.exports = router
