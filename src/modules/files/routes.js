const express = require('express')
const router = express.Router()
const controller = require('./controller')

const uploadImg = controller.multerImageConfig()
router.post('/image', uploadImg.single('file'), controller.uploadImage)

const uploadDoc = controller.multerDocumentConfig()
router.post('/document', uploadDoc.single('file'), controller.uploadDocument)

router.get('/image/:project_id', controller.getCover)
router.delete('/image', controller.deleteImage)
router.delete('/document', controller.deleteDocument)

module.exports = router
